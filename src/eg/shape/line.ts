export default class Line {
  x = 0;
  y = 0;
  x1 = 0;
  y1 = 0;
  x2 = 0;
  y2 = 0;
  rotation = 0;
  lineWidth = 1;
  color = 'rgb(0, 0, 0)';
  alpha = 1;

  constructor(
    args: Partial<{
      x: number;
      y: number;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      rotation: number;
      lineWidth: number;
      color: string;
      alpha: number;
    }>,
  ) {
    Object.assign(this, args);
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(this.x2, this.y2);
    ctx.stroke();
    ctx.restore();
  }
}
