import { Link } from "react-router-dom";
import content, { isPlaceholder } from "../content.js";
import GlobeSlot from "../components/GlobeSlot.jsx";

const h = content.home;

// Marks placeholder text in yellow so it is easy to spot.
const T = ({ children }) => (isPlaceholder(children) ? <mark className="ph">{children}</mark> : children);

export default function Home() {
  const it = h.itHighlight;
  const sv = h.serviceHighlight;
  return (
    <main id="main">
      <section className="wrap hero">
        <div>
          <p className="eyebrow">{content.site.name}</p>
          <h1>{h.statement}</h1>
          <p className="lead">{h.goal}</p>
          <dl className="facts">
            {h.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>
                  <T>{f.value}</T>
                  {f.note && <small>{f.note}</small>}
                </dd>
              </div>
            ))}
          </dl>
          <div className="actions">
            {isPlaceholder(h.cv) ? (
              <span className="btn off">Download CV (PDF): <T>{h.cv}</T></span>
            ) : (
              <a className="btn" href={h.cv} download>Download CV (PDF)</a>
            )}
            <Link className="btn alt" to="/contact">Contact</Link>
          </div>
        </div>
        <GlobeSlot />
      </section>

      <section className="wrap">
        <div className="stat">
          <p className="stat-line">
            National 1st place in <T>{h.statCount}</T> events
          </p>
          <Link to="/achievements">See all results and proof</Link>
        </div>
      </section>

      <section className="wrap" aria-labelledby="featured">
        <h2 id="featured">Featured work</h2>
        <div className="grid3">
          {h.featured.map((p, i) => (
            <article className="card" key={i}>
              <h3><T>{p.title}</T></h3>
              <p><T>{p.summary}</T></p>
              <Link to="/work">See all work</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="wrap two" aria-label="Highlights">
        <article className="card">
          <span className="tag">Technical</span>
          <h2>{it.title}</h2>
          <p><strong>{it.result}</strong></p>
          <p>Organizer: <T>{it.organizer}</T>. Year: <T>{it.year}</T>.</p>
          <p>Proof: <T>{it.proof}</T></p>
        </article>
        <article className="card">
          <span className="tag">Environmental service</span>
          <h2>{sv.title}</h2>
          <p>{sv.text}</p>
          <p>Place: <T>{sv.place}</T>. Date: <T>{sv.date}</T>.</p>
          <p>Proof: <T>{sv.proof}</T></p>
        </article>
      </section>

      <section className="wrap">
        <p className="now"><strong>Currently working on:</strong> <T>{h.currently}</T></p>
      </section>
    </main>
  );
}
