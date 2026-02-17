export default function PulseRing({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: "1.5px solid rgba(110, 231, 160, 0.2)",
            animation: `pulseRing 3.5s ease-out ${i * 1.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
