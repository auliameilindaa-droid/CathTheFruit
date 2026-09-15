import { FallingObject, Particle, ScorePopup } from '../types';

/**
 * Procedural 2D cartoon Canvas rendering routines.
 * Crisp, vibrant, scalable without any external images.
 */

// Draw peaceful cheerful orchard background
export function drawOrchardBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  // 1. Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#70c5ff');
  skyGrad.addColorStop(0.55, '#c0ebff');
  skyGrad.addColorStop(1, '#e3f7ff');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Sunny Sun
  const sunX = width * 0.85;
  const sunY = height * 0.12;
  const sunRadius = 42;

  // Sun glow
  const sunGlow = ctx.createRadialGradient(sunX, sunY, sunRadius * 0.3, sunX, sunY, sunRadius * 1.8);
  sunGlow.addColorStop(0, 'rgba(255, 235, 120, 0.55)');
  sunGlow.addColorStop(1, 'rgba(255, 235, 120, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius * 1.8, 0, Math.PI * 2);
  ctx.fill();

  // Sun core
  ctx.fillStyle = '#ffde59';
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();

  // Sun rays
  ctx.save();
  ctx.translate(sunX, sunY);
  ctx.rotate(time * 0.2);
  ctx.strokeStyle = 'rgba(255, 215, 60, 0.4)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * (sunRadius + 8), Math.sin(angle) * (sunRadius + 8));
    ctx.lineTo(Math.cos(angle) * (sunRadius + 22), Math.sin(angle) * (sunRadius + 22));
    ctx.stroke();
  }
  ctx.restore();

  // 3. Clouds (slowly drifting)
  drawCloud(ctx, (width * 0.15 + time * 12) % (width + 120) - 60, height * 0.14, 52);
  drawCloud(ctx, (width * 0.65 + time * 8) % (width + 120) - 60, height * 0.22, 40);
  drawCloud(ctx, (width * 0.35 + time * 10) % (width + 120) - 60, height * 0.08, 34);

  // 4. Distant Rolling Green Hills
  ctx.fillStyle = '#8bd460';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.76);
  ctx.bezierCurveTo(width * 0.3, height * 0.68, width * 0.7, height * 0.82, width, height * 0.73);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // 5. Midground hills with cartoon trees
  ctx.fillStyle = '#6ab840';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.83);
  ctx.bezierCurveTo(width * 0.25, height * 0.77, width * 0.75, height * 0.88, width, height * 0.81);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Draw cute orchard trees along hills
  drawOrchardTree(ctx, width * 0.12, height * 0.73, 24);
  drawOrchardTree(ctx, width * 0.28, height * 0.71, 28);
  drawOrchardTree(ctx, width * 0.68, height * 0.74, 30);
  drawOrchardTree(ctx, width * 0.88, height * 0.72, 26);

  // 6. Wooden Garden Fence
  drawFence(ctx, width, height * 0.82);

  // 7. Foreground Grass Floor
  ctx.fillStyle = '#4ea128';
  ctx.beginPath();
  ctx.ellipse(width * 0.5, height * 0.94, width * 0.65, height * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#3f8c1e';
  ctx.fillRect(0, height * 0.91, width, height * 0.09);

  // Flowers on grass
  drawFlower(ctx, width * 0.08, height * 0.93, '#fff');
  drawFlower(ctx, width * 0.18, height * 0.95, '#ffdf59');
  drawFlower(ctx, width * 0.42, height * 0.94, '#ff80bf');
  drawFlower(ctx, width * 0.78, height * 0.95, '#fff');
  drawFlower(ctx, width * 0.92, height * 0.93, '#ffdf59');
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.6, 0, Math.PI * 2);
  ctx.arc(x + r * 0.45, y - r * 0.25, r * 0.75, 0, Math.PI * 2);
  ctx.arc(x + r * 0.95, y, r * 0.55, 0, Math.PI * 2);
  ctx.arc(x + r * 0.45, y + r * 0.15, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawOrchardTree(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  // Trunk
  ctx.fillStyle = '#7a4b27';
  ctx.fillRect(x - r * 0.2, y, r * 0.4, r * 1.1);

  // Foliage
  ctx.fillStyle = '#489c25';
  ctx.beginPath();
  ctx.arc(x, y - r * 0.3, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#5cbe32';
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.5, r * 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Little red apples on tree
  ctx.fillStyle = '#e83636';
  ctx.beginPath();
  ctx.arc(x - r * 0.4, y - r * 0.2, 3.5, 0, Math.PI * 2);
  ctx.arc(x + r * 0.3, y - r * 0.4, 3.5, 0, Math.PI * 2);
  ctx.arc(x, y - r * 0.7, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawFence(ctx: CanvasRenderingContext2D, width: number, y: number) {
  ctx.save();
  ctx.fillStyle = '#deb887';
  ctx.strokeStyle = '#c49a6c';
  ctx.lineWidth = 1.5;

  // Horizontal rails
  ctx.fillRect(0, y, width, 5);
  ctx.strokeRect(0, y, width, 5);
  ctx.fillRect(0, y + 14, width, 5);
  ctx.strokeRect(0, y + 14, width, 5);

  // Posts
  const step = 45;
  for (let x = 15; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, y + 26);
    ctx.lineTo(x, y - 8);
    ctx.lineTo(x + 4, y - 14);
    ctx.lineTo(x + 8, y - 8);
    ctx.lineTo(x + 8, y + 26);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, petalColor: string) {
  ctx.fillStyle = petalColor;
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    ctx.beginPath();
    ctx.arc(x + Math.cos(angle) * 5, y + Math.sin(angle) * 5, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffb300';
  ctx.beginPath();
  ctx.arc(x, y, 3, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw the player basket.
 * Has nice woven wicker lines, polished wooden rim, cute handles.
 */
export function drawBasket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  tiltAngle: number = 0
) {
  ctx.save();
  ctx.translate(x + width / 2, y + height / 2);
  ctx.rotate(tiltAngle);

  const w = width;
  const h = height;
  const hw = w / 2;
  const hh = h / 2;

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(0, hh + 6, hw * 0.9, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Basket Body (tapered trapezoid with curved bottom)
  ctx.fillStyle = '#c68a4c';
  ctx.beginPath();
  ctx.moveTo(-hw, -hh + 12);
  ctx.lineTo(-hw + 14, hh - 4);
  ctx.quadraticCurveTo(0, hh + 8, hw - 14, hh - 4);
  ctx.lineTo(hw, -hh + 12);
  ctx.closePath();
  ctx.fill();

  // Woven Wicker Lines
  ctx.strokeStyle = '#9d632c';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  // Diagonal weaves
  for (let i = -hw + 10; i < hw; i += 16) {
    ctx.moveTo(i, -hh + 12);
    ctx.lineTo(i + 14, hh - 2);
    ctx.moveTo(i + 14, -hh + 12);
    ctx.lineTo(i, hh - 2);
  }
  ctx.stroke();

  // Basket Inner Opening / Cavity
  ctx.fillStyle = '#593214';
  ctx.beginPath();
  ctx.ellipse(0, -hh + 14, hw * 0.92, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Basket Top Rim (curved wood)
  ctx.fillStyle = '#e8ab66';
  ctx.strokeStyle = '#854e1d';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, -hh + 12, hw, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Rim Highlight
  ctx.strokeStyle = 'rgba(255, 240, 200, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, -hh + 10, hw * 0.85, 8, 0, Math.PI * 0.2, Math.PI * 0.8);
  ctx.stroke();

  // Handles on left and right
  ctx.strokeStyle = '#854e1d';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';

  // Left handle
  ctx.beginPath();
  ctx.arc(-hw - 3, -hh + 16, 8, Math.PI * 0.5, Math.PI * 1.7);
  ctx.stroke();

  // Right handle
  ctx.beginPath();
  ctx.arc(hw + 3, -hh + 16, 8, -Math.PI * 0.7, Math.PI * 0.5);
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw falling objects: Apple, Orange, Banana, Watermelon, Golden Strawberry, Bomb
 */
export function drawFallingObject(
  ctx: CanvasRenderingContext2D,
  obj: FallingObject,
  time: number
) {
  ctx.save();
  ctx.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
  ctx.rotate(obj.rotation);

  const s = Math.min(obj.width, obj.height);
  const r = s / 2;

  if (obj.type === 'FRUIT') {
    switch (obj.fruitType) {
      case 'APPLE':
        drawApple(ctx, r);
        break;
      case 'ORANGE':
        drawOrange(ctx, r);
        break;
      case 'BANANA':
        drawBanana(ctx, r);
        break;
      case 'WATERMELON':
        drawWatermelon(ctx, r);
        break;
      default:
        drawApple(ctx, r);
    }
  } else if (obj.type === 'GOLDEN_STRAWBERRY') {
    drawGoldenStrawberry(ctx, r, time);
  } else if (obj.type === 'BOMB') {
    drawBomb(ctx, r, time);
  }

  ctx.restore();
}

function drawApple(ctx: CanvasRenderingContext2D, r: number) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.beginPath();
  ctx.ellipse(0, r + 4, r * 0.7, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Body gradient
  const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.2, 0, 0, r);
  grad.addColorStop(0, '#ff6161');
  grad.addColorStop(0.7, '#e61e1e');
  grad.addColorStop(1, '#a60a0a');
  ctx.fillStyle = grad;

  // Heart-like apple shape
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.5);
  ctx.bezierCurveTo(-r * 0.6, -r * 1.1, -r * 1.1, -r * 0.1, -r * 0.95, r * 0.4);
  ctx.bezierCurveTo(-r * 0.8, r * 1.0, -r * 0.2, r * 1.05, 0, r * 0.85);
  ctx.bezierCurveTo(r * 0.2, r * 1.05, r * 0.8, r * 1.0, r * 0.95, r * 0.4);
  ctx.bezierCurveTo(r * 1.1, -r * 0.1, r * 0.6, -r * 1.1, 0, -r * 0.5);
  ctx.closePath();
  ctx.fill();

  // Stem
  ctx.strokeStyle = '#5a3416';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.5);
  ctx.quadraticCurveTo(r * 0.2, -r * 0.9, r * 0.1, -r * 1.1);
  ctx.stroke();

  // Green Leaf
  ctx.fillStyle = '#48b82b';
  ctx.beginPath();
  ctx.ellipse(r * 0.35, -r * 0.8, r * 0.38, r * 0.2, Math.PI * 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.38, -r * 0.28, r * 0.25, r * 0.15, -Math.PI * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawOrange(ctx: CanvasRenderingContext2D, r: number) {
  // Body gradient
  const grad = ctx.createRadialGradient(-r * 0.25, -r * 0.25, r * 0.2, 0, 0, r);
  grad.addColorStop(0, '#ffa834');
  grad.addColorStop(0.75, '#f57c00');
  grad.addColorStop(1, '#c95100');
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.arc(0, 0, r * 0.92, 0, Math.PI * 2);
  ctx.fill();

  // Citrus dimples / texture
  ctx.fillStyle = 'rgba(200, 70, 0, 0.25)';
  ctx.beginPath();
  ctx.arc(-r * 0.3, r * 0.3, 2, 0, Math.PI * 2);
  ctx.arc(r * 0.4, r * 0.2, 2, 0, Math.PI * 2);
  ctx.arc(0, r * 0.5, 2, 0, Math.PI * 2);
  ctx.fill();

  // Stem & leaf cap
  ctx.fillStyle = '#489c25';
  ctx.beginPath();
  ctx.arc(0, -r * 0.85, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(r * 0.25, -r * 0.92, r * 0.35, r * 0.18, Math.PI * 0.1, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.3, -r * 0.3, r * 0.28, r * 0.16, -Math.PI * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

function drawBanana(ctx: CanvasRenderingContext2D, r: number) {
  ctx.save();
  ctx.rotate(-Math.PI * 0.15);

  // Curved banana crescent
  ctx.fillStyle = '#ffe234';
  ctx.beginPath();
  ctx.moveTo(-r * 0.8, -r * 0.6);
  ctx.quadraticCurveTo(0, -r * 0.2, r * 0.85, r * 0.55);
  ctx.quadraticCurveTo(0, r * 0.4, -r * 0.8, -r * 0.6);
  ctx.closePath();
  ctx.fill();

  // Shadow edge on bottom
  ctx.fillStyle = '#f0be1a';
  ctx.beginPath();
  ctx.moveTo(-r * 0.7, -r * 0.5);
  ctx.quadraticCurveTo(0, r * 0.28, r * 0.8, r * 0.5);
  ctx.quadraticCurveTo(0, r * 0.4, -r * 0.7, -r * 0.5);
  ctx.closePath();
  ctx.fill();

  // Ridge line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-r * 0.7, -r * 0.4);
  ctx.quadraticCurveTo(0, 0, r * 0.75, r * 0.45);
  ctx.stroke();

  // Greenish-brown stem
  ctx.fillStyle = '#6d531a';
  ctx.beginPath();
  ctx.arc(-r * 0.8, -r * 0.6, 4, 0, Math.PI * 2);
  ctx.fill();

  // Bottom tip
  ctx.beginPath();
  ctx.arc(r * 0.85, r * 0.55, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawWatermelon(ctx: CanvasRenderingContext2D, r: number) {
  ctx.save();
  ctx.rotate(Math.PI * 0.05);

  // Outer green striped rind
  ctx.fillStyle = '#1e7b2e';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.95, Math.PI * 0.15, Math.PI * 0.85);
  ctx.lineTo(0, -r * 0.25);
  ctx.closePath();
  ctx.fill();

  // Inner pale rind
  ctx.fillStyle = '#d7f7be';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.84, Math.PI * 0.17, Math.PI * 0.83);
  ctx.lineTo(0, -r * 0.25);
  ctx.closePath();
  ctx.fill();

  // Red juicy pulp
  ctx.fillStyle = '#e82b47';
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.74, Math.PI * 0.2, Math.PI * 0.8);
  ctx.lineTo(0, -r * 0.22);
  ctx.closePath();
  ctx.fill();

  // Black teardrop seeds
  ctx.fillStyle = '#222';
  const seedOffsets = [
    { x: -r * 0.25, y: r * 0.32 },
    { x: r * 0.25, y: r * 0.32 },
    { x: 0, y: r * 0.48 },
    { x: -r * 0.12, y: r * 0.18 },
    { x: r * 0.12, y: r * 0.18 },
  ];

  seedOffsets.forEach(s => {
    ctx.beginPath();
    ctx.ellipse(s.x, s.y, 2.8, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

function drawGoldenStrawberry(ctx: CanvasRenderingContext2D, r: number, time: number) {
  // 1. Shimmering Golden Aura Glow
  const pulse = Math.sin(time * 6) * 0.15 + 0.85;
  const glow = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 1.5 * pulse);
  glow.addColorStop(0, 'rgba(255, 230, 80, 0.6)');
  glow.addColorStop(0.6, 'rgba(255, 195, 0, 0.25)');
  glow.addColorStop(1, 'rgba(255, 195, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.5 * pulse, 0, Math.PI * 2);
  ctx.fill();

  // 2. Strawberry Gold Body
  const bodyGrad = ctx.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.15, 0, 0, r);
  bodyGrad.addColorStop(0, '#fff6a3');
  bodyGrad.addColorStop(0.4, '#ffd700');
  bodyGrad.addColorStop(0.85, '#e69500');
  bodyGrad.addColorStop(1, '#b36b00');
  ctx.fillStyle = bodyGrad;

  ctx.beginPath();
  ctx.moveTo(0, -r * 0.5);
  ctx.bezierCurveTo(-r * 0.7, -r * 0.9, -r * 1.05, -r * 0.1, -r * 0.75, r * 0.5);
  ctx.bezierCurveTo(-r * 0.5, r * 0.95, -r * 0.15, r * 1.05, 0, r * 1.1);
  ctx.bezierCurveTo(r * 0.15, r * 1.05, r * 0.5, r * 0.95, r * 0.75, r * 0.5);
  ctx.bezierCurveTo(r * 1.05, -r * 0.1, r * 0.7, -r * 0.9, 0, -r * 0.5);
  ctx.closePath();
  ctx.fill();

  // Gold Strawberry Seeds
  ctx.fillStyle = '#fff48f';
  const seeds = [
    { x: -r * 0.35, y: -r * 0.1 },
    { x: 0, y: -r * 0.15 },
    { x: r * 0.35, y: -r * 0.1 },
    { x: -r * 0.4, y: r * 0.25 },
    { x: 0, y: r * 0.22 },
    { x: r * 0.4, y: r * 0.25 },
    { x: -r * 0.2, y: r * 0.58 },
    { x: r * 0.2, y: r * 0.58 },
    { x: 0, y: r * 0.8 },
  ];
  seeds.forEach(sd => {
    ctx.beginPath();
    ctx.ellipse(sd.x, sd.y, 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Green/Gold Crown Leaves
  ctx.fillStyle = '#52b72c';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.5);
  ctx.lineTo(-r * 0.45, -r * 0.85);
  ctx.lineTo(-r * 0.15, -r * 0.6);
  ctx.lineTo(0, -r * 0.95);
  ctx.lineTo(r * 0.15, -r * 0.6);
  ctx.lineTo(r * 0.45, -r * 0.85);
  ctx.closePath();
  ctx.fill();

  // 3. Animated Sparkling Stars
  const starTime = time * 4;
  drawSparkleStar(ctx, Math.cos(starTime) * r * 0.85, Math.sin(starTime) * r * 0.85, 7);
  drawSparkleStar(ctx, Math.cos(starTime + Math.PI) * r * 0.9, Math.sin(starTime + Math.PI) * r * 0.9, 6);
  drawSparkleStar(ctx, -r * 0.3, -r * 0.35, 5);
}

function drawSparkleStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = '#ffffff';

  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(0, 0, size, 0);
  ctx.quadraticCurveTo(0, 0, 0, size);
  ctx.quadraticCurveTo(0, 0, -size, 0);
  ctx.quadraticCurveTo(0, 0, 0, -size);
  ctx.fill();

  ctx.restore();
}

function drawBomb(ctx: CanvasRenderingContext2D, r: number, time: number) {
  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, r + 4, r * 0.7, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cannonball Body gradient
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r * 0.95);
  grad.addColorStop(0, '#666666');
  grad.addColorStop(0.4, '#2b2b2b');
  grad.addColorStop(0.9, '#111111');
  grad.addColorStop(1, '#050505');
  ctx.fillStyle = grad;

  ctx.beginPath();
  ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2);
  ctx.fill();

  // Brass fuse cap / neck
  ctx.fillStyle = '#a87428';
  ctx.fillRect(-r * 0.2, -r * 0.98, r * 0.4, r * 0.22);

  // Curved rope fuse
  ctx.strokeStyle = '#c49a6c';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -r * 0.95);
  ctx.quadraticCurveTo(r * 0.4, -r * 1.25, r * 0.35, -r * 1.45);
  ctx.stroke();

  // Animated Spark & Fire at the fuse tip!
  const sparkX = r * 0.35;
  const sparkY = -r * 1.45;
  const sparkSize = 6 + Math.sin(time * 30) * 3;

  // Outer orange spark
  ctx.fillStyle = '#ff5722';
  ctx.beginPath();
  ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
  ctx.fill();

  // Inner yellow spark
  ctx.fillStyle = '#ffeb3b';
  ctx.beginPath();
  ctx.arc(sparkX, sparkY, sparkSize * 0.55, 0, Math.PI * 2);
  ctx.fill();

  // Spark rays
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const angle = time * 20 + (i * Math.PI) / 2;
    ctx.beginPath();
    ctx.moveTo(sparkX, sparkY);
    ctx.lineTo(sparkX + Math.cos(angle) * (sparkSize + 5), sparkY + Math.sin(angle) * (sparkSize + 5));
    ctx.stroke();
  }

  // Cartoon Danger Mark on bomb: Bright Yellow Warning Exclamation / Skull
  ctx.fillStyle = '#ffd600';
  ctx.font = `bold ${Math.round(r * 0.72)}px Fredoka, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('!', 0, 2);

  // Glossy highlight on sphere
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.beginPath();
  ctx.ellipse(-r * 0.35, -r * 0.35, r * 0.22, r * 0.14, -Math.PI * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Draw all particle effects (bursts, sparkles, smoke, confetti)
 */
export function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.alpha);

    if (p.shape === 'star') {
      drawSparkleStar(ctx, p.x, p.y, p.size);
    } else if (p.shape === 'confetti') {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size * 1.5);
    } else if (p.shape === 'smoke') {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Default circle / juice droplet
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  });
}

/**
 * Draw animated floating score popups (+10, +20, -10)
 */
export function drawScorePopups(ctx: CanvasRenderingContext2D, popups: ScorePopup[]) {
  popups.forEach(pop => {
    ctx.save();
    ctx.translate(pop.x, pop.y);
    ctx.scale(pop.scale, pop.scale);
    ctx.globalAlpha = Math.max(0, pop.alpha);

    ctx.font = '800 24px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Black / Dark stroke outline for readability
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.strokeText(pop.text, 0, 0);

    // Colored Fill
    ctx.fillStyle = pop.color;
    ctx.fillText(pop.text, 0, 0);

    ctx.restore();
  });
}
