/** Moody nested-arch backdrop matching the luxury navy/teal reference. */
export const HeroArchesBackground = () => {
  const arches = [
    { rx: 760, ry: 520, opacity: 0.18 },
    { rx: 640, ry: 430, opacity: 0.24 },
    { rx: 520, ry: 350, opacity: 0.3 },
    { rx: 400, ry: 270, opacity: 0.38 },
    { rx: 290, ry: 195, opacity: 0.48 },
    { rx: 190, ry: 128, opacity: 0.62 },
    { rx: 110, ry: 74, opacity: 0.8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 48%, #1F4959 0%, #011425 58%, #011425 100%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="arch-void" cx="50%" cy="48%" r="18%">
            <stop offset="0%" stopColor="#011425" />
            <stop offset="100%" stopColor="#1F4959" stopOpacity="0" />
          </radialGradient>
        </defs>
        {arches.map((arch, i) => (
          <ellipse
            key={i}
            cx="600"
            cy="390"
            rx={arch.rx}
            ry={arch.ry}
            fill="none"
            stroke={i % 2 === 0 ? "#5C7C89" : "#1F4959"}
            strokeWidth={i < 3 ? 1.25 : 1.6}
            opacity={arch.opacity}
          />
        ))}
        <ellipse cx="600" cy="390" rx="70" ry="46" fill="url(#arch-void)" />
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#011425_100%)]" />
    </div>
  );
};
