import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - var(--nav-h, 68px))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--gutter, 24px)",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display, system-ui)",
            fontSize: "clamp(72px, 10vw, 120px)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            color: "var(--muted-2, #555560)",
          }}
        >
          404
        </span>
        <h2
          style={{
            fontFamily: "var(--font-display, system-ui)",
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--ink, #FAFAFA)",
          }}
        >
          Page not found
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--ink-2, #C4C4CC)",
            lineHeight: 1.55,
          }}
        >
          The page you are looking for does not exist or has been moved.
        </p>
        <Link href="/" className="btn btn-primary" style={{ marginTop: 8 }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
