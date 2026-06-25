"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0B",
          color: "#FAFAFA",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: 24,
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
              background: "#16161A",
              border: "1px solid rgba(255,255,255,0.08)",
              display: "grid",
              placeItems: "center",
              fontSize: 28,
            }}
          >
            !
          </div>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Something went wrong
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "#C4C4CC",
              lineHeight: 1.55,
              margin: 0,
            }}
          >
            A critical error occurred. Please reload the page to continue.
          </p>
          <button
            onClick={() => unstable_retry()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "13px 20px",
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 15,
              background: "#FFFFFF",
              color: "#0A0A0B",
              border: "none",
              cursor: "pointer",
              marginTop: 8,
              boxShadow:
                "0 8px 24px -8px rgba(255,255,255,0.14), inset 0 0 0 1px rgba(255,255,255,0.2)",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
