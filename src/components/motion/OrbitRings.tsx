/**
 * Slow-turning concentric gold rings with two orbiting dots — a quiet "compass / drawing instrument" motif
 * for dark hero sections. Pure CSS; decorative only.
 */
export function OrbitRings({ className = "" }: { className?: string }) {
  return (
    <div className={`orbit pointer-events-none absolute aspect-square select-none ${className}`} aria-hidden="true">
      <span className="orbit-ring orbit-ring-1">
        <i />
      </span>
      <span className="orbit-ring orbit-ring-2">
        <i />
      </span>
      <span className="orbit-ring orbit-ring-3" />
      <span className="orbit-cross" />
    </div>
  );
}
