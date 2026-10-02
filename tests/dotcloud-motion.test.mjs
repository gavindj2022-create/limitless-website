import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const cloud = readFileSync(join(root, "components/experience/DotCloud.tsx"), "utf8");
const css = readFileSync(join(root, "app/consulting.module.css"), "utf8");

test("DotCloud has the approved shapes, cadence, interaction and opacity", () => {
  assert.match(cloud, /\["phone", "envelope", "calendar", "star", "bar chart", "infinity"\]/);
  assert.match(cloud, /const CYCLE_MS = 4200/);
  assert.match(cloud, /window\.addEventListener\("pointermove", onPointer/);
  assert.match(cloud, /host\.addEventListener\("click", onClick\)/);
  assert.match(cloud, /distanceSquared < 2304/);
  assert.match(cloud, /ctx\.globalAlpha = 0\.75/);
  assert.match(cloud, /ctx\.fillStyle = "#F3D98B"/);
});

test("DotCloud pauses offscreen, waits for idle and respects reduced motion", () => {
  assert.match(cloud, /const FRAME_MS = 1000 \/ 30/);
  assert.match(cloud, /new IntersectionObserver/);
  assert.match(cloud, /visible = entry\.isIntersecting/);
  assert.match(cloud, /if \(running \|\| !visible \|\| document\.hidden\) return/);
  assert.match(cloud, /requestIdleCallback/);
  assert.match(cloud, /prefers-reduced-motion: reduce/);
  assert.match(cloud, /<InfinityMark \/>/);
});

test("founder hero keeps DotCloud in its desktop and mobile zones", () => {
  assert.match(css, /\.founderHero \.dotCorner\{left:56%;top:30%;width:min\(17vw,24vh\)\}/);
  assert.match(css, /\.founderStage\{position:absolute;right:max\(0px,calc\(\(100vw - 1680px\) \/ 2\)\);bottom:0;height:min\(96svh,900px\)/);
  assert.match(css, /@media\(max-width:767px\)[\s\S]*\.founderHero \.dotCorner\{left:22%;top:27%;width:min\(28vw,18vh\)\}/);
  assert.match(css, /@media\(max-width:767px\)[\s\S]*\.heroCopy\{width:100%;max-width:100%;transform:translateY\(-32px\)\}/);
});
