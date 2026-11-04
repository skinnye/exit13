import { BAR_FEATURES } from '../data'

export default function Bar() {
  return (
    <section id="bar" className="section relative">
      <div className="container-x">
        <div className="max-w-3xl">
          <h2 className="section-title">
            Вечером бар,
            <br />
            ночью танцпол
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Заходишь на пиво и закуски в уютный пивной бар у Площади 1905 года. Сдаёшь обувь, получаешь
            тапочки. А ближе к ночи в пятницу и субботу свет гаснет, включается звук, и EXIT 13 превращается
            в танцпол до семи утра.
          </p>
        </div>

        <dl className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {BAR_FEATURES.map((f) => (
            <div key={f.t}>
              <dt className="font-display text-lg font-medium text-text">{f.t}</dt>
              <dd className="mt-2 leading-relaxed text-white/60">{f.d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
