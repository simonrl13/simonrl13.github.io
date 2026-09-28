/* Exploded isometric view of a project's system layers — extruded slabs,
   top (what the user touches) to bottom (foundation). Static stack by
   default; the slabs pull apart on card hover / focus. Each slab's --k is
   its distance from the middle of the stack, so the CSS spreads any number
   of layers symmetrically. */

const CX = 74;
const HW = 56;
const HH = 21;
const D = 6; // slab thickness
const TOP_Y = 22;
const STEP = 38;

export default function IsoStack({
  layers,
  className,
}: {
  layers: readonly string[];
  className?: string;
}) {
  const baseY = layers.map((_, i) => TOP_Y + i * STEP);
  return (
    <svg
      className={`iso${className ? ` ${className}` : ""}`}
      viewBox={`0 -16 300 ${44 + layers.length * STEP}`}
      role="img"
      aria-label={`System layers, top to bottom: ${layers.join("; ")}`}
    >
      <g className="iso__links" aria-hidden="true">
        {baseY.slice(0, -1).map((y, i) => (
          <line key={i} x1={CX} y1={y + HH + D} x2={CX} y2={baseY[i + 1] - HH} />
        ))}
      </g>

      {layers.map((label, i) => {
        const y = baseY[i];
        const top = `${CX},${y - HH} ${CX + HW},${y} ${CX},${y + HH} ${
          CX - HW
        },${y}`;
        const leftFace = `${CX - HW},${y} ${CX},${y + HH} ${CX},${y + HH + D} ${
          CX - HW
        },${y + D}`;
        const rightFace = `${CX},${y + HH} ${CX + HW},${y} ${CX + HW},${y + D} ${
          CX
        },${y + HH + D}`;
        return (
          <g
            className="iso__layer"
            data-layer={i}
            key={label}
            style={{ ["--k" as string]: i - (layers.length - 1) / 2 }}
          >
            <polygon className="iso__face" points={leftFace} />
            <polygon className="iso__face iso__face--r" points={rightFace} />
            <polygon className="iso__top" points={top} />
            <line
              className="iso__leader"
              x1={CX + HW}
              y1={y}
              x2={150}
              y2={y}
            />
            <text className="iso__idx" x={0} y={y + 3}>
              {`0${i + 1}`}
            </text>
            <text className="iso__label" x={156} y={y + 3.5}>
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
