import { useEffect, useRef } from 'react'

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float a = hash(i);
  float b = hash(i+vec2(1.0,0.0));
  float c = hash(i+vec2(0.0,1.0));
  float d = hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.02; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res)/u_res.y;
  float t = u_time*0.05;
  vec2 q = vec2(fbm(uv*1.4 + vec2(0.0, t)), fbm(uv*1.4 + vec2(5.2, -t)));
  float n = fbm(uv*2.0 + q*1.9 + vec2(t*1.4, t*0.8));

  vec3 c1 = vec3(0.025,0.025,0.04);
  vec3 c2 = vec3(0.10,0.02,0.20);
  vec3 mag = vec3(1.0,0.12,0.42);
  vec3 cyan = vec3(0.10,0.85,1.0);
  vec3 acid = vec3(0.80,1.0,0.0);

  vec3 col = mix(c1, c2, smoothstep(0.18,0.62,n));
  col = mix(col, mag*0.85, smoothstep(0.55,0.82,n)*0.55);
  col += cyan * pow(smoothstep(0.70,0.96,n), 2.0) * 0.45;

  // тонкая кислотная "лазерная" линия
  float line = smoothstep(0.018, 0.0, abs(uv.y - 0.28*sin(uv.x*2.2 + u_time*0.4)));
  col += acid * line * 0.18;

  // сканлайны + виньетка
  col *= 0.9 + 0.1*sin(gl_FragCoord.y*1.4 + u_time*1.6);
  col *= smoothstep(1.35, 0.15, length(uv));

  gl_FragColor = vec4(col, 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('shader', gl.getShaderInfoLog(sh))
    return null
  }
  return sh
}

export default function ShaderBG({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    if (!gl) {
      canvas.style.background = 'radial-gradient(120% 80% at 50% 0%, #18062a, #07070a 70%)'
      return
    }

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      canvas.style.background = 'radial-gradient(120% 80% at 50% 0%, #18062a, #07070a 70%)'
      return
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, 'u_res')
    const uTime = gl.getUniformLocation(prog, 'u_time')

    const mobile = window.matchMedia('(max-width: 768px)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25)
    const resize = () => {
      const w = Math.floor(canvas.clientWidth * dpr)
      const h = Math.floor(canvas.clientHeight * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let running = true
    const start = performance.now()
    const render = (now: number) => {
      if (!running) return
      resize()
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!reduced) raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    const onVis = () => {
      running = !document.hidden && !reduced
      if (running) raf = requestAnimationFrame(render)
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden />
}
