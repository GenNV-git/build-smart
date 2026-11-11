/** A few specks of gold light drifting upwards — for dark hero sections. Pure CSS; decorative only. */
const specks = [
  { left: "6%", size: 3, dur: 17, delay: 0, dx: 30 },
  { left: "18%", size: 4, dur: 22, delay: 4, dx: -20 },
  { left: "33%", size: 2, dur: 15, delay: 8, dx: 24 },
  { left: "47%", size: 3, dur: 24, delay: 2, dx: -30 },
  { left: "61%", size: 4, dur: 19, delay: 10, dx: 18 },
  { left: "74%", size: 2, dur: 16, delay: 6, dx: -14 },
  { left: "86%", size: 3, dur: 21, delay: 12, dx: 26 },
  { left: "94%", size: 2, dur: 18, delay: 3, dx: -22 },
];

export function GoldDust({ className = "" }: { className?: string }) {
  return (
    <div className={`dust ${className}`} aria-hidden="true">
      {specks.map((s, i) => (
        <i
          key={i}
          style={{
            left: s.left,
            width: s.size,
            height: s.size,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
            ["--dx" as string]: `${s.dx}px`,
          }}
        />
      ))}
    </div>
  );
}
