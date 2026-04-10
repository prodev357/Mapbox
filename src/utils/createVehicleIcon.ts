/**
 * Draws top-down vehicle icons onto an offscreen canvas and returns raw
 * ImageData that Mapbox GL can consume synchronously via addImage().
 *
 * All icons point UPWARD — Mapbox rotates them via icon-rotate to match heading.
 */

export interface RawIcon {
  width: number;
  height: number;
  data: Uint8Array;
}

// ─── Drawing helpers ──────────────────────────────────────────────────────────

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rx = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rx, y);
  ctx.lineTo(x + w - rx, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rx);
  ctx.lineTo(x + w, y + h - rx);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rx, y + h);
  ctx.lineTo(x + rx, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rx);
  ctx.lineTo(x, y + rx);
  ctx.quadraticCurveTo(x, y, x + rx, y);
  ctx.closePath();
}

function toRawIcon(canvas: HTMLCanvasElement): RawIcon {
  const ctx = canvas.getContext('2d')!;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return {
    width: canvas.width,
    height: canvas.height,
    data: new Uint8Array(data.data.buffer),
  };
}

// ─── Car icon (top-down, pointing up) ────────────────────────────────────────

export function createCarIcon(bodyColor: string, w = 16, h = 28): RawIcon {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  const wheelW = Math.max(2, w * 0.22);
  const wheelH = Math.max(3, h * 0.14);
  const bodyX = wheelW * 0.6;
  const bodyW = w - bodyX * 2;
  const r = bodyW * 0.35;

  // ── Wheels (behind body) ──────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(20, 20, 20, 0.85)';
  // front-left
  roundRect(ctx, 0, h * 0.08, wheelW, wheelH, 2);
  ctx.fill();
  // front-right
  roundRect(ctx, w - wheelW, h * 0.08, wheelW, wheelH, 2);
  ctx.fill();
  // rear-left
  roundRect(ctx, 0, h * 0.72, wheelW, wheelH, 2);
  ctx.fill();
  // rear-right
  roundRect(ctx, w - wheelW, h * 0.72, wheelW, wheelH, 2);
  ctx.fill();

  // ── Car body ──────────────────────────────────────────────────────────────
  ctx.fillStyle = bodyColor;
  roundRect(ctx, bodyX, h * 0.04, bodyW, h * 0.92, r);
  ctx.fill();

  // ── Body highlight (subtle top edge gloss) ────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  roundRect(ctx, bodyX + 1, h * 0.05, bodyW - 2, h * 0.25, r * 0.8);
  ctx.fill();

  // ── Front windshield ──────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(200, 230, 255, 0.82)';
  roundRect(ctx, bodyX + bodyW * 0.1, h * 0.09, bodyW * 0.8, h * 0.22, r * 0.5);
  ctx.fill();

  // ── Rear window ──────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(200, 230, 255, 0.55)';
  roundRect(ctx, bodyX + bodyW * 0.12, h * 0.67, bodyW * 0.76, h * 0.17, r * 0.4);
  ctx.fill();

  // ── Headlights (front) ───────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255, 250, 200, 0.95)';
  roundRect(ctx, bodyX + bodyW * 0.08, h * 0.055, bodyW * 0.3, h * 0.034, 1);
  ctx.fill();
  roundRect(ctx, bodyX + bodyW * 0.62, h * 0.055, bodyW * 0.3, h * 0.034, 1);
  ctx.fill();

  // ── Tail lights (rear) ───────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255, 80, 80, 0.9)';
  roundRect(ctx, bodyX + bodyW * 0.08, h * 0.915, bodyW * 0.28, h * 0.028, 1);
  ctx.fill();
  roundRect(ctx, bodyX + bodyW * 0.64, h * 0.915, bodyW * 0.28, h * 0.028, 1);
  ctx.fill();

  return toRawIcon(canvas);
}

// ─── Ambulance / emergency vehicle (top-down, pointing up) ───────────────────

export function createEmergencyIcon(w = 20, h = 34): RawIcon {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);

  const wheelW = Math.max(2, w * 0.2);
  const wheelH = Math.max(3, h * 0.12);
  const bodyX = wheelW * 0.55;
  const bodyW = w - bodyX * 2;
  const r = bodyW * 0.22; // boxier than a car

  // ── Wheels ────────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(20, 20, 20, 0.85)';
  roundRect(ctx, 0, h * 0.08, wheelW, wheelH, 2);       ctx.fill();
  roundRect(ctx, w - wheelW, h * 0.08, wheelW, wheelH, 2); ctx.fill();
  roundRect(ctx, 0, h * 0.74, wheelW, wheelH, 2);       ctx.fill();
  roundRect(ctx, w - wheelW, h * 0.74, wheelW, wheelH, 2); ctx.fill();

  // ── Body ──────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#EF4444';
  roundRect(ctx, bodyX, h * 0.03, bodyW, h * 0.94, r);
  ctx.fill();

  // ── Roof gloss ────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  roundRect(ctx, bodyX + 1, h * 0.04, bodyW - 2, h * 0.2, r * 0.8);
  ctx.fill();

  // ── Light bar (top of vehicle) ────────────────────────────────────────────
  ctx.fillStyle = '#1E40AF';
  roundRect(ctx, bodyX + bodyW * 0.08, h * 0.045, bodyW * 0.38, h * 0.045, 2);
  ctx.fill();
  ctx.fillStyle = '#DC2626';
  roundRect(ctx, bodyX + bodyW * 0.54, h * 0.045, bodyW * 0.38, h * 0.045, 2);
  ctx.fill();

  // ── Windshield ────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(200, 230, 255, 0.78)';
  roundRect(ctx, bodyX + bodyW * 0.1, h * 0.1, bodyW * 0.8, h * 0.19, r * 0.5);
  ctx.fill();

  // ── White cross ───────────────────────────────────────────────────────────
  const cx = w / 2;
  const cy = h * 0.56;
  const armLen = bodyW * 0.28;
  const armThick = armLen * 0.42;

  ctx.fillStyle = 'white';
  // vertical bar
  ctx.fillRect(cx - armThick / 2, cy - armLen, armThick, armLen * 2);
  // horizontal bar
  ctx.fillRect(cx - armLen, cy - armThick / 2, armLen * 2, armThick);

  // ── Rear window ───────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(200, 230, 255, 0.5)';
  roundRect(ctx, bodyX + bodyW * 0.12, h * 0.73, bodyW * 0.76, h * 0.14, r * 0.3);
  ctx.fill();

  // ── Headlights ────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255, 250, 200, 0.95)';
  roundRect(ctx, bodyX + bodyW * 0.07, h * 0.035, bodyW * 0.3, h * 0.03, 1);
  ctx.fill();
  roundRect(ctx, bodyX + bodyW * 0.63, h * 0.035, bodyW * 0.3, h * 0.03, 1);
  ctx.fill();

  return toRawIcon(canvas);
}

// ─── Icon registry ────────────────────────────────────────────────────────────

export const VEHICLE_ICONS: Record<string, () => RawIcon> = {
  normal:    () => createCarIcon('#3B82F6'),          // blue car
  clearing:  () => createCarIcon('#F97316'),          // orange car
  returning: () => createCarIcon('#F97316'),          // orange car
  emergency: () => createEmergencyIcon(),             // red ambulance
};
