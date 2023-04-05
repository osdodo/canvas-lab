import Ball from './shape/ball';
import Line from './shape/line';
import { randomNum, randomColor, angle2Radian } from '../lib/helper';

interface CanvasSize {
  w: number;
  h: number;
}

export default class BallDropSimulation {
  isDestroyed = false;
  canvas: HTMLCanvasElement | undefined;
  ctx: CanvasRenderingContext2D | null;
  canvasSize: CanvasSize = {
    w: 800,
    h: 600,
  };
  balls: Array<Ball> = [];
  lines: Array<Line> = [];
  g = 0.3;
  spring = 0.25;
  yfriction = 0.05;
  xfriction = 0.01;
  bounce = -0.5;

  constructor(args: { canvas: HTMLCanvasElement; canvasSize?: CanvasSize }) {
    Object.assign(this, args);
    const { canvas } = args;
    this.ctx = canvas.getContext('2d');
    canvas.width = this.canvasSize.w;
    canvas.height = this.canvasSize.h;
  }

  run() {
    this.generateBallsAndLines();
    this.drawFrame();
  }

  destroy() {
    this.isDestroyed = true;
    this.balls.length = 0;
    this.canvas = undefined;
    this.ctx = null;
  }

  generateBallsAndLines() {
    this.lines.push(new Line({ x: 100, y: 400, x2: 290, rotation: angle2Radian(20), lineWidth: 5 }));
    this.lines.push(new Line({ x: 700, y: 400, x2: 290, rotation: angle2Radian(160), lineWidth: 5 }));
    const { w, h } = this.canvasSize;
    for (let i = 0; i < 20; i++) {
      this.balls.push(
        new Ball({
          x: randomNum([0, w], false),
          y: randomNum([0, h], false),
          r: randomNum([3, 20], false),
          color: randomColor(),
        }),
      );
    }
  }

  drawFrame() {
    if (this.isDestroyed) return;
    window.requestAnimationFrame(() => {
      this.drawFrame();
    });
    const { ctx, canvasSize } = this;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);
    this.hitEffect();
    this.moveBall();
    this.renderBall();
    this.renderLine();
  }

  hitEffect() {
    const { balls, lines } = this;
    for (let i = 0, ballsLen = balls.length; i < ballsLen; i++) {
      const currentBall = balls[i];
      for (let j = 0, len = lines.length; j < len; j++) {
        this.lineHitEffect(currentBall, lines[j]);
      }
      for (let k = i + 1; k < ballsLen; k++) {
        this.ballHitEffect(currentBall, balls[k]);
      }
    }
  }

  lineHitEffect(ball: Ball, line: Line): void {
    const { bounce } = this;
    let sin = Math.sin(line.rotation);
    let cos = Math.cos(line.rotation);

    let rx = ball.x - line.x;
    let ry = ball.y - line.y;

    let x_ = rx * cos + ry * sin;
    let y_ = ry * cos - rx * sin;

    let vx_ = ball.vx * cos + ball.vy * sin;
    let vy_ = ball.vy * cos - ball.vx * sin;

    if (x_ + ball.r > line.x1 && x_ - ball.r < line.x2) {
      if (y_ + ball.r > 0 && vy_ > y_) {
        y_ = -ball.r;
        vy_ *= bounce;
      }
      if (y_ - ball.r < 0 && vy_ < y_) {
        y_ = ball.r;
        vy_ *= bounce;
      }
    }

    rx = x_ * cos - y_ * sin;
    ry = y_ * cos + x_ * sin;

    ball.vx = vx_ * cos - vy_ * sin;
    ball.vy = vy_ * cos + vx_ * sin;

    ball.x = line.x + rx;
    ball.y = line.y + ry;
  }

  ballHitEffect(b1: Ball, b2: Ball): void {
    const { spring } = this;
    const dx = b2.x - b1.x;
    const dy = b2.y - b1.y;
    const dist = Math.sqrt(dx ** 2 + dy ** 2);
    const minDist = b1.r + b2.r;
    if (dist < minDist) {
      const tx = b1.x + (dx / dist) * minDist;
      const ty = b1.y + (dy / dist) * minDist;
      const ax = (tx - b2.x) * spring;
      const ay = (ty - b2.y) * spring;
      b1.vx -= ax;
      b1.vy -= ay;
      b2.vx += ax;
      b2.vy += ay;
    }
  }

  moveBall() {
    const {
      balls,
      canvasSize: { w, h },
      g,
      xfriction,
      yfriction,
      bounce,
    } = this;

    for (let i = 0, len = balls.length; i < len; i++) {
      //重力作用
      balls[i].vy += g;

      //阻力作用
      if (balls[i].vy > 0 && balls[i].vy - yfriction > 0) {
        balls[i].vy -= yfriction;
      } else if (balls[i].vy < 0 && balls[i].vy + yfriction < 0) {
        balls[i].vy += yfriction;
      } else {
        balls[i].vy = 0;
      }

      if (balls[i].vx > 0 && balls[i].vx - xfriction > 0) {
        balls[i].vx -= xfriction;
      } else if (balls[i].vx < 0 && balls[i].vx + xfriction < 0) {
        balls[i].vx += xfriction;
      } else {
        balls[i].vx = 0;
      }

      //y方向速度作用&&落地处理
      balls[i].y += balls[i].vy;
      if (balls[i].y + balls[i].r >= h) {
        balls[i].y = h - balls[i].r;
        balls[i].vy *= -1;
      }

      //x方向速度作用&&左右边界处理
      balls[i].x += balls[i].vx;
      if (balls[i].x - balls[i].r <= 0) {
        balls[i].x = balls[i].r;
        balls[i].vx *= bounce;
      } else if (balls[i].x + balls[i].r >= w) {
        balls[i].x = w - balls[i].r;
        balls[i].vx *= bounce;
      }
    }
  }

  renderLine() {
    const { lines, ctx } = this;
    if (!ctx) return;
    for (let i = 0, len = lines.length; i < len; i++) {
      lines[i].render(ctx);
    }
  }

  renderBall() {
    const { balls, ctx } = this;
    if (!ctx) return;
    for (let i = 0, len = balls.length; i < len; i++) {
      balls[i].render(ctx);
    }
  }
}
