/**
 * Architectural line art that draws itself when it scrolls into view (pure SVG + CSS, no images).
 * "house" = front elevation with dimension lines; "plan" = a simple floor plan.
 * Decorative only: hidden from screen readers. Colour follows the text colour of `className`.
 */
type Line = string;

const house: Line[] = [
  "M10 310 H510", // ground
  "M110 310 V170 H410 V310", // walls
  "M88 172 L260 68 L432 172", // roof
  "M326 108 V80 H358 V127", // chimney
  "M235 310 V228 H285 V310", // door
  "M276 272 h0.1", // door knob
  "M140 200 H200 V256 H140 Z M170 200 V256 M140 228 H200", // left window
  "M320 200 H380 V256 H320 Z M350 200 V256 M320 228 H380", // right window
  "M244 135 a16 16 0 1 0 32 0 a16 16 0 1 0 -32 0 M260 119 V151 M244 135 H276", // attic window
  "M110 338 H410 M110 331 V345 M410 331 V345", // width dimension
  "M462 172 V310 M455 172 H469 M455 310 H469", // height dimension
  "M58 310 V268 M58 268 m-20 -14 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0", // tree
  "M206 310 q54 -22 108 0", // path to the door
];

const plan: Line[] = [
  "M20 20 H460 V320 H20 Z", // outer wall
  "M32 32 H448 V308 H32 Z", // inner wall
  "M200 32 V150 M200 196 V210 H32", // bedroom walls (door gap)
  "M200 150 a46 46 0 0 1 46 46", // door swing
  "M300 308 V214 H372 M418 214 H448", // kitchen walls
  "M372 214 a46 46 0 0 0 46 46", // door swing
  "M58 58 H150 V132 H58 Z M58 82 H150", // bed
  "M240 58 H366 V98 H240 Z M240 70 H366", // sofa
  "M278 150 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0", // coffee table
  "M324 290 H430 M430 290 V238", // kitchen counter
  "M60 250 a24 24 0 1 0 48 0 a24 24 0 1 0 -48 0 M132 232 H172 V268 H132 Z", // dining
  "M20 338 H460 M20 331 V345 M460 331 V345", // dimension
];

export function BlueprintArt({ variant = "house", className = "" }: { variant?: "house" | "plan"; className?: string }) {
  const lines = variant === "house" ? house : plan;
  const viewBox = variant === "house" ? "0 0 520 356" : "0 0 480 356";
  return (
    <div className={`bp pointer-events-none select-none ${className}`} aria-hidden="true" data-reveal="draw">
      <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="bp-float h-auto w-full">
        {lines.map((d, i) => (
          <path key={i} d={d} pathLength={1} style={{ ["--i" as string]: i }} />
        ))}
      </svg>
    </div>
  );
}
