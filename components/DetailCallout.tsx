/** A drafting detail callout above a section heading: the section's rail ref
    (same numbers as SiteChrome's rail) in a copper circle, and a ring that
    sweeps out of it as the section scrolls in (CSS: .detail). Decorative. */
export default function DetailCallout({ refNo }: { refNo: string }) {
  return (
    <div className="detail" aria-hidden="true">
      <span className="detail__ring" />
      <span className="detail__bubble mono">{refNo}</span>
    </div>
  );
}
