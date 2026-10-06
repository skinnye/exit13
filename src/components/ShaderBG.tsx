import { useEffect, useRef } from 'react'

// Фон hero: почти чёрный «дым» (#080808) с еле заметным золотым свечением (#f0c030) —
// дизайн v2, без неона. Анимация только пока hero в кадре и вкладка видима;
// при prefers-reduced-motion — один статичный кадр.

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
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
  for(int i=0;i<4;i++){ v += a*noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5*u_res)/u_res.y;
  float t = u_time*0.035;
  vec2 q = vec2(fbm(uv*1.2 + vec2(0.0, t)), fbm(uv*1.2 + vec2(5.2, -t)));
  float n = fbm(uv*1.7 + q*1.8 + vec2(t*1.3, t*0.7));

  vec3 base  = vec3(0.031);                 // void #080808
  vec3 smoke = vec3(0.085, 0.077, 0.062);   // тёплый графит
  vec3 gold  = vec3(0.941, 0.753, 0.188);   // acid #f0c030

  vec3 col = mix(base, smoke, smoothstep(0.30, 0.80, n));

  // мягкий золотой свет сверху справа — как прожектор сквозь дым
  vec2 lp = vec2(0.62 + 0.12*sin(u_time*0.06), 0.42);
  float glow = exp(-2.1*length((uv - lp)*vec2(0.7, 1.1)));
  col += gold * glow * (0.35 + 0.65*smoothstep(0.35, 0.85, n)) * 0.15;
  // редкие тёплые прожилки в самых плотных клубах
  col += gold * pow(smoothstep(0.62, 0.95, n), 3.0) * 0.05;

  // виньетка + дизеринг против полос на тёмных градиентах
  col *= smoothstep(1.45, 0.20, length(uv*vec2(0.9, 1.0)));
  col += (hash(gl_FragCoord.xy + fract(u_time)) - 0.5) / 255.0;

  gl_FragColor = vec4(col, 1.0);
}
`

const FALLBACK_BG = 'radial-gradient(90% 70% at 75% 0%, #1a160c, #080808 70%)'

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)
  if (!sh) return null
  gl.shaderSource(sh, src)
  gl.compileShader(sh)
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn('shader', gl.getShaderInfoLog(sh))
    gl.deleteShader(sh)
    return null
  }
  return sh
}

export default function ShaderBG({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const fallback = () => {
      canvas.style.background = FALLBACK_BG
    }

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    })
    if (!gl) return fallback()

    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    const prog = vs && fs ? gl.createProgram() : null
    if (!vs || !fs || !prog) return fallback()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return fallback()
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
    const reducedMq = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      gl.viewport(0, 0, canvas.width, canvas.height)
      gl.uniform2f(uRes, canvas.width, canvas.height)
    }

    let raf = 0
    let inView = true
    const start = performance.now()
    const animating = () => inView && !document.hidden && !reducedMq.matches
    const frame = (now: number) => {
      raf = 0
      gl.uniform1f(uTime, reducedMq.matches ? 0 : (now - start) / 1000)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (animating()) raf = requestAnimationFrame(frame)
    }
    // Рисует хотя бы один кадр (статичный режим/после ресайза), дальше — если можно анимировать.
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    resize()
    kick()

    const ro = new ResizeObserver(() => {
      resize()
      kick()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) kick()
    })
    io.observe(canvas)
    const onVis = () => {
      if (!document.hidden) kick()
    }
    document.addEventListener('visibilitychange', onVis)
    reducedMq.addEventListener('change', kick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      reducedMq.removeEventListener('change', kick)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return <canvas ref={ref} className={className} aria-hidden />
}
