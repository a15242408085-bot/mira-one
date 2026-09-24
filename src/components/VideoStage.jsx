export default function VideoStage({ src, variant = "radial" }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[50vh] overflow-hidden md:inset-0 md:h-auto">
      <video
        className="h-full w-full object-cover"
        src={src}
        muted
        playsInline
        loop
        preload="auto"
        autoPlay
      />
      {variant === "radial" ? (
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "radial-gradient(ellipse 70% 70% at 50% 45%, rgba(0,0,0,0.3), rgba(0,0,0,0.7))",
          }}
        />
      ) : (
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "radial-gradient(ellipse 58% 52% at 50% 42%, rgba(0,0,0,0.22), rgba(0,0,0,0.72) 78%)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black md:hidden" />
    </div>
  );
}
