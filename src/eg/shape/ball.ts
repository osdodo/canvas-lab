export default class Ball {
  x = 0;
  y = 0;
  r = 20;
  m = 0;
  vx = 0;
  vy = 0;
  scaleX = 1;
  scaleY = 1;
  strokeStyle = 'rgba(0, 0, 0, 0)';
  color = 'rgb(0, 0, 0)';
  alpha = 1;

  constructor(
    args: Partial<{
      x: number;
      y: number;
      r: number;
      m: number;
      vx: number;
      vy: number;
      scaleX: number;
      scaleY: number;
      strokeStyle: string;
      color: string;
      alpha: number;
    }>,
  ) {
    Object.assign(this, args);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX, this.scaleY);
    ctx.strokeStyle = this.strokeStyle;
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(0, 0, this.r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  isPoint({ x, y }: { x: number; y: number }) {
    return this.r >= Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
  }
}
