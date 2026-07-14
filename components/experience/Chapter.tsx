"use client";

import {
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const getReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const getReducedServer = () => false;

interface ChapterProps {
  /** Path to the looping background film (mp4). */
  film: string;
  /** Poster image shown before playback and for reduced-motion users. */
  poster: string;
  /** Scrim gradient — "center" darkens edges, "left"/"right" darken one side for copy. */
  scrim?: "center" | "left" | "right";
  /** Eagerly preload + autoplay (use for the above-the-fold hero only). */
  eager?: boolean;
  /** Extra class on the section. */
  className?: string;
  id?: string;
  children: ReactNode;
}

/**
 * Full-viewport cinematic chapter: a muted looping film with a poster
 * fallback, a gradient scrim for copy contrast, play-on-visible via
 * IntersectionObserver, a slow settle-zoom on entry, and a static poster
 * for prefers-reduced-motion users. The Orbital chapter engine, in React.
 */
export default function Chapter({
  film,
  poster,
  scrim = "center",
  eager = false,
  className,
  id,
  children,
}: ChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getReducedServer
  );

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
            section.classList.add("is-playing");
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.2 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`xp-chapter xp-scrim-${scrim}${className ? ` ${className}` : ""}`}
    >
      <div className="xp-film" aria-hidden="true">
        {reduced ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" />
        ) : (
          <video
            muted
            loop
            playsInline
            autoPlay={eager}
            preload={eager ? "auto" : "metadata"}
            poster={poster}
            ref={videoRef}
          >
            <source src={film} type="video/mp4" />
          </video>
        )}
      </div>
      <div className="xp-scrim" />
      <div className="xp-content wrap">{children}</div>
    </section>
  );
}
