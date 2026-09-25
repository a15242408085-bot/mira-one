const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const bar = document.querySelector("[data-bar]");
const pct = document.querySelector("[data-pct]");
const brand = document.querySelector("[data-brand]");
const heroWord = document.querySelector("[data-word]");
const heroHint = document.querySelector("[data-hint]");
const heroVideo = document.querySelector("[data-hero-video]");
const autoTrigger = document.querySelector("[data-auto-trigger]");
let autoBrowse = false;
let autoFrame = null;
let autoLastTime = 0;
let autoVelocity = 0;
let autoPauseUntil = 0;
let autoWaypointIndex = 0;
let heroWant = 0;

if (heroVideo) {
  heroVideo.muted = true;
  heroVideo.volume = 0;
}

function scrubHero(progress, active) {
  if (!heroVideo || !heroVideo.duration || Number.isNaN(heroVideo.duration)) return;
  heroVideo.muted = true;
  heroVideo.volume = 0;
  if (active !== "hero") {
    heroVideo.pause();
    return;
  }
  heroWant = clamp(progress) * Math.max(0, heroVideo.duration - 0.04);
  const drift = heroWant - heroVideo.currentTime;
  if (!heroVideo.seeking && Math.abs(drift) > 0.08) heroVideo.currentTime = heroWant;
}

if (heroVideo) {
  heroVideo.addEventListener("seeked", () => {
    if (Math.abs(heroVideo.currentTime - heroWant) > 0.06) heroVideo.currentTime = heroWant;
  });
}
const layers = [...document.querySelectorAll("[data-layer]")];
const notes = [...document.querySelectorAll(".explode-notes li")];
const specs = [...document.querySelectorAll("[data-specs] li")];
const scenes = ["hero", "split", "field", "clarity", "bento", "audience"].map((id) =>
  document.getElementById(id)
);
const light = new Set(["field", "bento", "audience", "clarity"]);

let target = 0;
let shown = 0;

const clamp = (n, a = 0, b = 1) => Math.min(b, Math.max(a, n));

function metrics() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

function localOf(el, y) {
  const start = el.offsetTop;
  const end = start + el.offsetHeight - window.innerHeight;
  if (end <= start) return y >= start ? 1 : 0;
  return clamp((y - start) / (end - start));
}

function activeScene(y) {
  let name = "hero";
  for (const el of scenes) {
    if (y + window.innerHeight * 0.42 >= el.offsetTop) name = el.id;
  }
  return name;
}

const fieldVideo = document.querySelector("[data-field-video]");

function playField(active) {
  if (!fieldVideo) return;
  fieldVideo.muted = true;
  fieldVideo.volume = 0;
  if (active === "field") {
    if (fieldVideo.paused) {
      const played = fieldVideo.play();
      if (played) played.catch(() => {});
    }
  } else if (!fieldVideo.paused) {
    fieldVideo.pause();
  }
}

function place(name, locals) {
  const heroT = locals.hero;
  const splitT = locals.split;

  const heroFadeProgress = clamp((heroT - 0.48) / 0.48);
  const heroFadeEase = heroFadeProgress * heroFadeProgress * (3 - 2 * heroFadeProgress);
  const heroFade = name === "hero" ? 1 - heroFadeEase : 0;
  if (heroWord) heroWord.style.opacity = String(heroFade);
  if (heroHint) heroHint.style.opacity = String(name === "hero" ? 1 - clamp((heroT - 0.62) / 0.28) : 0);
  scrubHero(locals.hero, name);
  playField(name);

  const brandOn = name === "hero" ? clamp(heroT / 0.15) : 1;
  brand.style.opacity = String(brandOn);

  const spread = name === "split" ? splitT : 0;
  const mid = (layers.length - 1) / 2;
  layers.forEach((img, index) => {
    const offset = (index - mid) * spread * 108;
    img.style.transform = `translateY(calc(-50% + ${offset}px))`;
    img.style.opacity = name === "split" ? "1" : "0";
  });
  notes.forEach((note, index) => {
    const t = clamp((spread - index * 0.12) / 0.2);
    note.style.opacity = String(t);
    note.style.transform = `translateY(calc(-50% + ${(index - mid) * spread * 108}px))`;
  });

  const clarityT = locals.clarity;
  specs.forEach((item, index) => {
    const t = clamp((clarityT - index * 0.14) / 0.28);
    item.style.opacity = String(0.34 + t * 0.66);
    item.style.transform = `translateY(${(1 - t) * 7}px)`;
  });
}

function apply(p) {
  const max = metrics();
  const y = p * max;
  const locals = {};
  for (const el of scenes) locals[el.id] = localOf(el, y);
  const name = activeScene(y);
  document.body.classList.toggle("is-light", light.has(name));
  place(name, locals);
}

const cursor = document.querySelector("[data-cursor]");
const cursorInner = document.querySelector("[data-cursor-inner]");
const cursorLabel = document.querySelector("[data-cursor-label]");
const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, cx: window.innerWidth / 2, cy: window.innerHeight / 2 };
let cursorHot = false;

document.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  if (cursor) cursor.classList.add("is-on");
  const nx = event.clientX / window.innerWidth * 2 - 1;
  const ny = event.clientY / window.innerHeight * 2 - 1;
  document.documentElement.style.setProperty("--px", nx.toFixed(3));
  document.documentElement.style.setProperty("--py", ny.toFixed(3));
});

document.addEventListener("pointerover", (event) => {
  cursorHot = Boolean(event.target.closest("a, button, input"));
  if (cursor) cursor.classList.toggle("is-hot", cursorHot);
  if (!cursorLabel) return;
  cursorLabel.textContent = cursorHot ? "打开" : "";
});

const water = document.querySelector("[data-water]");
const waterCtx = water ? water.getContext("2d") : null;
const drops = [];
let lastDrop = { x: pointer.cx, y: pointer.cy };

function fitWater() {
  if (!water) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  water.width = Math.floor(window.innerWidth * dpr);
  water.height = Math.floor(window.innerHeight * dpr);
  waterCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spawnDrop(x, y, vx, vy, life, size) {
  drops.push({ x, y, px: x, py: y, vx, vy, life, max: life, size });
  if (drops.length > 420) drops.splice(0, drops.length - 420);
}

function drawWater(time) {
  if (!waterCtx) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  waterCtx.clearRect(0, 0, w, h);
  const dx = pointer.cx - lastDrop.x;
  const dy = pointer.cy - lastDrop.y;
  const speed = Math.hypot(dx, dy);
  const count = 5 + Math.min(10, speed * 0.35);
  for (let i = 0; i < count; i += 1) {
    const angle = Math.random() * Math.PI * 2;
    const force = 0.4 + Math.random() * 1.8 + speed * 0.08;
    spawnDrop(
      pointer.cx + Math.cos(angle) * 6,
      pointer.cy + Math.sin(angle) * 6,
      Math.cos(angle) * force - dx * 0.12,
      Math.sin(angle) * force - dy * 0.12 - 0.35,
      28 + Math.random() * 26,
      1.2 + Math.random() * 3.4
    );
  }
  lastDrop.x = pointer.cx;
  lastDrop.y = pointer.cy;

  const glow = waterCtx.createRadialGradient(pointer.cx, pointer.cy, 0, pointer.cx, pointer.cy, 54);
  glow.addColorStop(0, "rgba(255,255,255,0.9)");
  glow.addColorStop(0.25, "rgba(120, 210, 255, 0.45)");
  glow.addColorStop(1, "rgba(80, 170, 255, 0)");
  waterCtx.fillStyle = glow;
  waterCtx.beginPath();
  waterCtx.arc(pointer.cx, pointer.cy, 54, 0, Math.PI * 2);
  waterCtx.fill();

  for (let i = 0; i < 14; i += 1) {
    const angle = time * 0.003 + i * 0.45;
    const radius = 18 + (i % 5) * 8 + Math.sin(time * 0.005 + i) * 6;
    spawnDrop(
      pointer.cx + Math.cos(angle) * radius,
      pointer.cy + Math.sin(angle * 1.4) * radius * 0.72,
      Math.cos(angle + 1.2) * 1.4,
      Math.sin(angle) * 1.1 - 0.4,
      16,
      1.4
    );
  }

  waterCtx.globalCompositeOperation = "lighter";
  for (let i = drops.length - 1; i >= 0; i -= 1) {
    const drop = drops[i];
    drop.px = drop.x;
    drop.py = drop.y;
    drop.vx += Math.sin(time * 0.002 + drop.y * 0.02) * 0.04;
    drop.vy += -0.015;
    drop.x += drop.vx;
    drop.y += drop.vy;
    drop.vx *= 0.985;
    drop.vy *= 0.985;
    drop.life -= 1;
    if (drop.life <= 0) {
      drops.splice(i, 1);
      continue;
    }
    const fade = drop.life / drop.max;
    waterCtx.strokeStyle = `rgba(${180 + fade * 75}, ${230 + fade * 25}, 255, ${fade * 0.85})`;
    waterCtx.lineWidth = drop.size * fade;
    waterCtx.lineCap = "round";
    waterCtx.beginPath();
    waterCtx.moveTo(drop.px, drop.py);
    waterCtx.lineTo(drop.x, drop.y);
    waterCtx.stroke();
    if (fade > 0.65) {
      waterCtx.fillStyle = `rgba(255,255,255,${fade})`;
      waterCtx.beginPath();
      waterCtx.arc(drop.x, drop.y, drop.size * 0.45, 0, Math.PI * 2);
      waterCtx.fill();
    }
  }
  waterCtx.globalCompositeOperation = "source-over";
}

window.addEventListener("resize", fitWater);
fitWater();

function frame() {
  pointer.cx += (pointer.x - pointer.cx) * (reduce ? 1 : 0.16);
  pointer.cy += (pointer.y - pointer.cy) * (reduce ? 1 : 0.16);
  if (cursorInner) cursorInner.style.transform = `translate(${pointer.cx}px, ${pointer.cy}px) translate(-21px, -21px)`;
  drawWater(performance.now());
  target = window.scrollY / metrics();
  shown += (target - shown) * (reduce ? 1 : 0.09);
  if (Math.abs(target - shown) < 0.0005) shown = target;
  apply(target);
  bar.style.setProperty("--bar", shown.toFixed(4));
  pct.textContent = `${Math.round(shown * 100)}%`;
  requestAnimationFrame(frame);
}

const form = document.querySelector("[data-form]");
if (form) form.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  form.querySelector("[data-thanks]").hidden = false;
  form.reset();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href").slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    event.preventDefault();
    window.scrollTo({ top: el.offsetTop, behavior: reduce ? "auto" : "smooth" });
  });
});

function stopAutoBrowse() {
  autoBrowse = false;
  if (autoFrame) window.cancelAnimationFrame(autoFrame);
  autoFrame = null;
  autoLastTime = 0;
  autoVelocity = 0;
  autoPauseUntil = 0;
  autoTrigger?.classList.remove("is-active");
  autoTrigger?.setAttribute("aria-pressed", "false");
  if (autoTrigger) autoTrigger.textContent = "自动浏览";
}

function startAutoBrowse() {
  const root = document.scrollingElement || document.documentElement;
  autoBrowse = true;
  autoLastTime = 0;
  autoVelocity = 0;
  autoPauseUntil = 0;
  autoWaypointIndex = scenes.findIndex((scene) => scene.offsetTop > root.scrollTop + 40);
  if (autoWaypointIndex < 0) autoWaypointIndex = scenes.length;
  autoTrigger?.classList.add("is-active");
  autoTrigger?.setAttribute("aria-pressed", "true");
  if (autoTrigger) autoTrigger.textContent = "暂停浏览";
  const move = (time) => {
    if (!autoBrowse) return;
    if (!autoLastTime) autoLastTime = time;
    const dt = Math.min((time - autoLastTime) / 1000, 0.05);
    autoLastTime = time;
    const maxScroll = root.scrollHeight - window.innerHeight;
    if (root.scrollTop >= maxScroll - 1) {
      stopAutoBrowse();
      return;
    }
    const nextScene = scenes[autoWaypointIndex];
    if (nextScene && nextScene.offsetTop - root.scrollTop < 90) {
      autoPauseUntil = Math.max(autoPauseUntil, time + (reduce ? 0 : 360));
      autoWaypointIndex += 1;
    }
    const remaining = maxScroll - root.scrollTop;
    const maxSpeed = reduce ? 84 : 184;
    const braking = reduce ? 330 : 620;
    const cruise = time < autoPauseUntil ? 0 : Math.min(maxSpeed, Math.sqrt(2 * braking * Math.max(remaining, 0)));
    autoVelocity += (cruise - autoVelocity) * Math.min(1, dt * 4.2);
    root.scrollTop += autoVelocity * dt;
    autoFrame = window.requestAnimationFrame(move);
  };
  autoFrame = window.requestAnimationFrame(move);
}

autoTrigger?.addEventListener("click", () => {
  if (autoBrowse) stopAutoBrowse();
  else startAutoBrowse();
});

frame();
