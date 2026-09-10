import { pipeline } from "@/content/pipeline";

export default function Pipeline() {
  return (
    <section
      id="pipeline"
      className="section pipeline"
      aria-labelledby="pipeline-title"
    >
      <header className="sec-head">
        <div>
          <p className="sec-head__eyebrow mono">{pipeline.eyebrow}</p>
          <h2 id="pipeline-title">{pipeline.title}</h2>
        </div>
        <p>{pipeline.lead}</p>
      </header>

      <div className="pipeline__frame">
        <ol className="flow" data-reveal>
          <span className="flow__trace" aria-hidden="true" />
          {pipeline.nodes.map((node) => (
            <li
              key={node.idx}
              className={`flow__node${
                node.kind === "gate" ? " flow__node--gate" : ""
              }`}
            >
              <span className="flow__dot" aria-hidden="true" />
              <p className="flow__idx mono">{node.idx}</p>
              <h3>{node.title}</h3>
              <p className="flow__body">{node.body}</p>
              {node.kind === "gate" && (
                <span className="flow__assist mono">manual step</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <dl className="pipeline__meta">
        {pipeline.meta.map((m) => (
          <div key={m.dt}>
            <dt>{m.dt}</dt>
            <dd>{m.dd}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
