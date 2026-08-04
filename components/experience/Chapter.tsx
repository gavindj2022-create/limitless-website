"use client";

import {
  useEffect,
  useRef,
  useState,
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

type IdleWindow = Window & {
  requestIdleCallback?: (
    cb: () => void,
    opts?: { timeout: number }
  ) => number;
};

interface ChapterProps {
  /**
   * Extensionless base path for the looping background film. Two sources are
   * emitted: `${film}.webm` (AV1) and `${film}-slim.mp4` (H.264 fallback).
   */
  film: string;
  /** Poster image shown before playback and for reduced-motion users. */
  poster: string;
  /** Scrim gradient — "center" darkens edges, "left"/"right" darken one side for copy. */
  scrim?: "center" | "left" | "right";
  /** Above-the-fold hero: mounts immediately, loads film bytes only after idle. */
  eager?: boolean;
  /** Extra class on the section. */
  className?: string;
  id?: string;
  children: ReactNode;
}

/**
 * Full-viewport cinematic chapter: a muted looping film with a poster
 * fallback, a gradient scrim for copy contrast, a slow settle-zoom on entry,
 * and a static poster for prefers-reduced-motion users.
 *
 * Loading is deliberately lazy in two stages, because four full-viewport
 * films on one page is otherwise ~11 MB and four live video decoders:
 *   1. The <video> element only exists in the DOM within ~1.5 viewports of
 *      the section (off-screen chapters render a lazy poster <img> instead).
 *      Unmounting hard-releases the decoder and its buffered bytes.
 *   2. While mounted, playback is gated on actual visibility, plus a pause
 *      when the tab goes to the background.
 * The hero mounts immediately so its poster paints as the LCP element, but
 * its film bytes wait for idle so they don't compete with HTML/CSS/JS.
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
  const [mounted, setMounted] = useState(eager);
  const reduced = useSyncExternalStore(
    subscribeReduced,
    getReduced,
    getReducedServer
  );

  // Stage 1: mount / unmount the <video> element itself.
  useEffect(() => {
    if (reduced || eager) return;
    const section = sectionRef.current;
    if (!section) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setMounted(entry.isIntersecting);
      },
      { rootMargin: "150% 0px 150% 0px", threshold: 0 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [reduced, eager]);

  // Stage 2: play / pause on real visibility while mounted.
  useEffect(() => {
    if (reduced || !mounted) return;
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
      { threshold: 0.15 }
    );
    io.observe(section);

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (section.classList.contains("is-playing"))
        video.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced, mounted]);

  // Release the decoder and buffered bytes when the element goes away.
  useEffect(() => {
    if (!mounted) return;
    const video = videoRef.current;
    if (!video) return;
    return () => {
      try {
        video.pause();
        while (video.firstChild) video.removeChild(video.firstChild);
        video.removeAttribute("src");
        video.load();
      } catch {
        /* element already torn down */
      }
    };
  }, [mounted]);

  // Hero only: poster paints first, film bytes fetch once the main thread is idle.
  useEffect(() => {
    if (!eager || reduced) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!video) return;

    const start = () => {
      video.preload = "auto";
      video.load();
      video.play().catch(() => {});
      section?.classList.add("is-playing");
    };

    const w = window as IdleWindow;
    if (w.requestIdleCallback) {
      const handle = w.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback?.(handle);
    }
    const timer = window.setTimeout(start, 800);
    return () => window.clearTimeout(timer);
  }, [eager, reduced]);

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
        ) : mounted ? (
          <video
            muted
            loop
            playsInline
            /* Hero waits for idle (see effect above). Others: mounting IS the gate. */
            preload={eager ? "none" : "auto"}
            poster={poster}
            ref={videoRef}
          >
            <source
              src={`${film}.webm`}
              type='video/webm; codecs="av01.0.05M.08"'
            />
            <source src={`${film}-slim.mp4`} type="video/mp4" />
          </video>
        ) : (
          /* Off-screen placeholder so fast scrolling never hits a black hole.
             Raw <img> on purpose: this is a video-poster twin, already sized by
             object-fit: cover, and <video poster> needs the same plain URL. */
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" loading="lazy" decoding="async" />
        )}
      </div>
      <div className="xp-scrim" />
      <div className="xp-content wrap">{children}</div>
    </section>
  );
}
