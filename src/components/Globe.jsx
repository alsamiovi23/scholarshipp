import { useEffect, useRef } from "react";

// Rough continent outlines as [longitude, latitude]. Decorative, not a map.
const LAND = [
  [[-165,65],[-140,70],[-110,72],[-85,70],[-62,58],[-55,48],[-70,43],[-76,35],[-81,25],[-90,29],[-97,26],[-97,19],[-88,16],[-83,9],[-78,8],[-86,13],[-95,16],[-105,20],[-112,30],[-118,34],[-124,40],[-125,49],[-135,58],[-150,60],[-165,60]],
  [[-55,60],[-45,60],[-20,70],[-20,82],[-60,82],[-72,76]],
  [[-78,8],[-62,11],[-50,0],[-35,-6],[-40,-22],[-48,-28],[-58,-38],[-65,-42],[-68,-52],[-74,-50],[-72,-35],[-70,-18],[-81,-5],[-78,2]],
  [[-17,15],[-17,21],[-10,30],[-6,36],[10,37],[20,32],[32,31],[35,28],[43,12],[51,12],[42,-2],[40,-15],[35,-25],[27,-34],[18,-34],[12,-18],[9,-1],[9,4],[-8,5]],
  [[-9,37],[-9,43],[-2,47],[4,52],[8,56],[5,60],[15,69],[30,71],[60,69],[100,77],[140,72],[170,69],[180,66],[180,62],[162,58],[156,51],[142,53],[136,44],[129,36],[125,40],[121,38],[122,30],[117,23],[108,21],[106,10],[100,13],[103,2],[98,9],[97,17],[92,21],[90,22],[86,20],[80,15],[78,8],[73,17],[68,23],[62,25],[57,26],[51,25],[48,30],[52,24],[56,22],[59,22],[52,16],[43,13],[38,20],[35,28],[34,31],[36,36],[28,37],[26,40],[22,37],[19,41],[13,45],[17,40],[12,42],[8,44],[3,43],[-2,37]],
  [[-5,50],[1,51],[0,57],[-5,58]],
  [[114,-22],[122,-18],[130,-12],[137,-12],[142,-11],[146,-19],[153,-26],[150,-37],[141,-38],[131,-31],[115,-34]],
  [[-180,-70],[180,-70],[180,-90],[-180,-90]],
];
const BD = [90.4, 23.8]; // Bangladesh marker: [longitude, latitude]
const TILT = 0.35;       // radians; shows the north a little

// Draw the outlines on a tiny hidden canvas, then keep sphere dots that fall on land.
function buildDots() {
  const c = document.createElement("canvas");
  c.width = 360;
  c.height = 180;
  const g = c.getContext("2d");
  g.fillStyle = "#000";
  for (const poly of LAND) {
    g.beginPath();
    poly.forEach(([lo, la], i) => g[i ? "lineTo" : "moveTo"](lo + 180, 90 - la));
    g.closePath();
    g.fill();
  }
  const px = g.getImageData(0, 0, 360, 180).data;
  const dots = [];
  const n = 2600;
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const lat = Math.asin(1 - (2 * i + 1) / n) * (180 / Math.PI);
    const lon = ((i * golden * 180) / Math.PI) % 360 - 180;
    const x = Math.min(359, Math.floor(lon + 180));
    const y = Math.min(179, Math.floor(90 - lat));
    if (px[(y * 360 + x) * 4 + 3] > 128) dots.push([(lat * Math.PI) / 180, (lon * Math.PI) / 180]);
  }
  return dots;
}

export default function Globe({ onReady }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv.getContext("2d");
    const dots = buildDots();
    let rot = -(BD[0] * Math.PI) / 180; // start with Bangladesh facing the viewer
    let size = 0, col, raf = 0, last = 0, visible = true, dragX = null, told = false;

    // Colors come from the CSS theme variables, so dark mode works.
    const readColors = () => {
      const st = getComputedStyle(document.documentElement);
      const v = (n) => st.getPropertyValue(n).trim();
      col = { sea1: v("--globe-sea1"), sea2: v("--globe-sea2"), land: v("--globe-land"), mark: v("--globe-mark") };
    };
    readColors();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = cv.clientWidth;
      cv.width = cv.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Turn latitude/longitude into screen position and depth (z > 0 faces the viewer).
    const proj = (la, lo) => {
      const a = lo + rot, cl = Math.cos(la);
      const x = cl * Math.sin(a), y = Math.sin(la), z = cl * Math.cos(a);
      return { x, y: y * Math.cos(TILT) - z * Math.sin(TILT), z: y * Math.sin(TILT) + z * Math.cos(TILT) };
    };

    const draw = (t) => {
      const c = size / 2, r = size * 0.46, d = Math.max(1.5, size / 170);
      ctx.clearRect(0, 0, size, size);
      const grad = ctx.createRadialGradient(c - r * 0.3, c - r * 0.3, r * 0.1, c, c, r);
      grad.addColorStop(0, col.sea1);
      grad.addColorStop(1, col.sea2);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, 7);
      ctx.fill();
      ctx.fillStyle = col.land;
      for (const [la, lo] of dots) {
        const p = proj(la, lo);
        if (p.z <= 0) continue;
        ctx.globalAlpha = 0.3 + 0.7 * p.z; // dots fade toward the edge
        ctx.fillRect(c + p.x * r - d / 2, c - p.y * r - d / 2, d, d);
      }
      ctx.globalAlpha = 1;
      const m = proj((BD[1] * Math.PI) / 180, (BD[0] * Math.PI) / 180);
      if (m.z > 0) {
        const mx = c + m.x * r, my = c - m.y * r;
        ctx.strokeStyle = col.mark;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mx, my, 6 + 3 * Math.sin(t / 400), 0, 7);
        ctx.stroke();
        ctx.fillStyle = col.mark;
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, 7);
        ctx.fill();
      }
      if (!told) { told = true; onReady && onReady(); }
    };

    const tick = (t) => {
      if (!visible) { raf = 0; return; } // pause when off-screen
      if (dragX === null) rot += (last ? t - last : 16) * 0.0001; // gentle auto-rotation
      last = t;
      draw(t);
      raf = requestAnimationFrame(tick);
    };
    const start = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); });
    io.observe(cv);
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    // Drag to rotate with a mouse only. Touch is left alone so the page always scrolls.
    const down = (e) => { if (e.pointerType === "mouse") { dragX = e.clientX; cv.setPointerCapture(e.pointerId); } };
    const move = (e) => { if (dragX !== null) { rot += (e.clientX - dragX) * 0.008; dragX = e.clientX; } };
    const up = () => { dragX = null; };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);

    start();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect(); mo.disconnect();
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
