"use client";

import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

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
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--surface, #16161A)",
            border: "1px solid var(--border, rgba(255,255,255,0.08))",
            display: "grid",
            placeItems: "center",
            fontSize: 28,
          }}
        >
          !
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display, system-ui)",
            fontSize: "clamp(24px, 3vw, 32px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--ink, #FAFAFA)",
          }}
        >
          Something went wrong
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--ink-2, #C4C4CC)",
            lineHeight: 1.55,
          }}
        >
          An unexpected error occurred. Please try again or contact support if
          the problem persists.
        </p>
        <button
          onClick={() => unstable_retry()}
          className="btn btn-primary"
          style={{ marginTop: 8 }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
