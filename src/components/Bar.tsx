import { BAR_FEATURES } from '../data'

export default function Bar() {
  return (
    <section id="bar" className="section relative">
      <div className="container-x">
        <div className="max-w-3xl">
          <h2 className="section-title">
            Днём ланчи, вечером кино,
            <br />
            ночью танцпол
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Со вторника по четверг EXIT 13 — бар и кухня у Площади 1905 года: днём бизнес-ланчи, вечером
            кино. А в пятницу и субботу с 22:00 гаснет свет, включается звук, и клуб превращается в танцпол
            до шести утра.
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
