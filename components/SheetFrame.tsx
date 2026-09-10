/* The fixed drawing-sheet plate: outer border, registration corners,
   an alphanumeric margin index, and a faint vellum grain. Decorative. */

const COLS = ["A", "B", "C", "D", "E", "F"];
const ROWS = ["1", "2", "3", "4"];

export default function SheetFrame() {
  return (
    <div className="sheet-frame" aria-hidden="true">
      <div className="sheet-frame__plate">
        <span className="sheet-frame__corner sheet-frame__corner--tl" />
        <span className="sheet-frame__corner sheet-frame__corner--tr" />
        <span className="sheet-frame__corner sheet-frame__corner--bl" />
        <span className="sheet-frame__corner sheet-frame__corner--br" />

        <div className="sheet-frame__index sheet-frame__index--bottom">
          {COLS.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        <div className="sheet-frame__index sheet-frame__index--left">
          {ROWS.map((r) => (
            <span key={r}>{r}</span>
          ))}
        </div>
        <div className="sheet-frame__index sheet-frame__index--right">
          {ROWS.map((r) => (
            <span key={r}>{r}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
