export function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="w-1 h-1 rounded-full bg-emerald-400/80"
          style={{
            animation: "bounce 1s infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}
