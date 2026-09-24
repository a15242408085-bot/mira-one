window.createHeroField = window.createHeroField || null;

(() => {
const fieldReduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fieldIsMobile = window.matchMedia("(max-width: 960px)").matches;

const hash = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
};

const noise = (x, y) => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = x - x0;
  const fy = y - y0;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const a = hash(x0, y0);
  const b = hash(x0 + 1, y0);
  const c = hash(x0, y0 + 1);
  const d = hash(x0 + 1, y0 + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

const fbm = (x, y) =>
  noise(x, y) * 0.55 + noise(x * 2.1, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3) * 0.15;

function createHeroField(canvas) {
  if (!canvas) return { start() {}, stop() {} };

  const ctx = canvas.getContext("2d", { alpha: false });
  const src = canvas.getAttribute("data-field") || "./assets/hero-half.png";
  const count = fieldIsMobile ? 1800 : 6400;
  const field = { w: 0, h: 0, data: null, iw: 0, ih: 0, seeds: [] };
  const mouse = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };
  let particles = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let running = false;
  let ready = false;
  let t = 0;

  const loadMask = () =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const scale = 280 / img.width;
        const iw = Math.max(2, Math.round(img.width * scale));
        const ih = Math.max(2, Math.round(img.height * scale));
        const off = document.createElement("canvas");
        off.width = iw;
        off.height = ih;
        const octx = off.getContext("2d", { willReadFrequently: true });
        octx.drawImage(img, 0, 0, iw, ih);
        field.data = octx.getImageData(0, 0, iw, ih).data;
        field.iw = iw;
        field.ih = ih;
        field.seeds = [];
        for (let y = 1; y < ih - 1; y += 1) {
          for (let x = 1; x < iw - 1; x += 1) {
            const i = (y * iw + x) * 4;
            const a = field.data[i + 3];
            if (a > 40) field.seeds.push([x / (iw - 1), y / (ih - 1)]);
          }
        }
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });

  const sample = (u, v) => {
    if (!field.data) return { a: 0, gx: 0, gy: 0 };
    const x = Math.min(field.iw - 2, Math.max(1, u * (field.iw - 1)));
    const y = Math.min(field.ih - 2, Math.max(1, v * (field.ih - 1)));
    const xi = x | 0;
    const yi = y | 0;
    const idx = (yi * field.iw + xi) * 4;
    const a = field.data[idx + 3] / 255;
    const r = field.data[idx];
    const g = field.data[idx + 1];
    const b = field.data[idx + 2];
    const lum = (r * 0.3 + g * 0.5 + b * 0.2) / 255;
    const right = field.data[idx + 7] / 255;
    const left = field.data[idx - 1] / 255;
    const down = field.data[((yi + 1) * field.iw + xi) * 4 + 3] / 255;
    const up = field.data[((yi - 1) * field.iw + xi) * 4 + 3] / 255;
    return { a, lum, gx: (right - left) * 0.5, gy: (down - up) * 0.5 };
  };

  const vector = (x, y) => {
    const padX = width * 0.18;
    const padY = height * 0.12;
    const u = (x - padX) / (width - padX * 1.15);
    const v = (y - padY) / (height - padY * 2);
    const m = u >= 0 && u <= 1 && v >= 0 && v <= 1 ? sample(u, v) : { a: 0, lum: 0, gx: 0, gy: 0 };
    const nx = x * 0.0028 + t * 0.04;
    const ny = y * 0.0028;
    const e = 0.018;
    const cx = (fbm(nx, ny + e) - fbm(nx, ny - e)) / (e * 2);
    const cy = (fbm(nx - e, ny) - fbm(nx + e, ny)) / (e * 2);
    const edge = Math.hypot(m.gx, m.gy);
    const tx = edge > 0.002 ? -m.gy / edge : 0;
    const ty = edge > 0.002 ? m.gx / edge : 0;
    const ax = (0.5 - u) * (1 - m.a) * 0.35;
    const ay = (0.46 - v) * (1 - m.a) * 0.28;
    const mx = (mouse.x * width - x) * 0.00035;
    const my = (mouse.y * height - y) * 0.00035;
    const align = Math.min(1, m.a * 0.82 + edge * 6);
    return {
      x: cx * (1 - align) + tx * align * 1.55 + ax + mx,
      y: cy * (1 - align) + ty * align * 1.55 + ay + my,
      a: m.a,
      edge,
      lum: m.lum,
    };
  };

  const toScreen = (u, v) => ({
    x: width * 0.18 + u * (width - width * 0.33),
    y: height * 0.12 + v * (height - height * 0.36),
  });

  const spawn = (seeded = false) => {
    let x;
    let y;
    if (field.seeds.length && Math.random() < 0.82) {
      const [u, v] = field.seeds[(Math.random() * field.seeds.length) | 0];
      const p = toScreen(u, v);
      x = p.x + (Math.random() - 0.5) * 6;
      y = p.y + (Math.random() - 0.5) * 6;
    } else {
      x = Math.random() * width;
      y = Math.random() * height;
    }
    const life = seeded ? Math.random() * 90 : 0;
    return { x, y, px: x, py: y, life, max: 70 + Math.random() * 110 };
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    particles = Array.from({ length: count }, () => spawn(true));
  };

  const paintStatic = () => {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < count * 0.45; i += 1) {
      let x = Math.random() * width;
      let y = Math.random() * height;
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let s = 0; s < 18; s += 1) {
        const f = vector(x, y);
        x += f.x * 7;
        y += f.y * 7;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(180, 210, 225, 0.08)";
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  };

  const tick = () => {
    if (!running) return;
    t += 0.016;
    mouse.x += (mouse.tx - mouse.x) * 0.06;
    mouse.y += (mouse.ty - mouse.y) * 0.06;
    ctx.fillStyle = "rgba(0, 0, 0, 0.045)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";
    particles.forEach((p) => {
      p.life += 1;
      const f = vector(p.x, p.y);
      p.px = p.x;
      p.py = p.y;
      p.x += f.x * (1.8 + f.a * 1.4);
      p.y += f.y * (1.8 + f.a * 1.4);
      const fade = 1 - p.life / p.max;
      const glow = 0.12 + f.a * 0.38 + f.edge * 1.15;
      const ice = 0.7 + f.lum * 0.3;
      ctx.strokeStyle = `rgba(${170 + ice * 70}, ${205 + ice * 35}, ${220 + ice * 25}, ${Math.min(0.55, glow * fade)})`;
      ctx.lineWidth = f.a > 0.18 ? 1.35 : 0.7;
      ctx.beginPath();
      ctx.moveTo(p.px, p.py);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      if (p.life >= p.max || p.x < -20 || p.y < -20 || p.x > width + 20 || p.y > height + 20) {
        Object.assign(p, spawn());
      }
    });
    ctx.globalCompositeOperation = "source-over";
    frame = requestAnimationFrame(tick);
  };

  const onMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.tx = (event.clientX - rect.left) / rect.width;
    mouse.ty = (event.clientY - rect.top) / rect.height;
  };

  const start = async () => {
    if (running) return;
    if (!ready) {
      try {
        await loadMask();
        ready = true;
      } catch {
        return;
      }
    }
    resize();
    running = true;
    if (fieldReduceMotion) {
      paintStatic();
      return;
    }
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    window.removeEventListener("pointermove", onMove);
  };

  return { start, stop };
}

window.createHeroField = createHeroField;
})();
