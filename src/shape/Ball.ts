interface IBall {
    x: number
    y: number
    r: number
    m?: number
    vx?: number
    vy?: number
    scaleX?: number
    scaleY?: number
    strokeStyle?: string
    color?: string
    alpha?: number
}

export default class Ball {
    public x = 0
    public y = 0
    public r = 20
    public m = 0
    public vx = 0
    public vy = 0
    private scaleX = 1
    private scaleY = 1
    private strokeStyle = 'rgba(0, 0, 0, 0)'
    private color = 'rgb(0, 0, 0)'
    private alpha = 1

    constructor(ball: IBall) {
        (<any>Object).assign(this, ball)
    }

    public render(ctx: CanvasRenderingContext2D): void {
        const { x, y, r, scaleX, scaleY, color, strokeStyle, alpha } = this
        ctx.save()
        ctx.translate(x, y)
        ctx.scale(scaleX, scaleY)
        ctx.strokeStyle = strokeStyle
        ctx.fillStyle = color
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
    }

    public isPoint(pos: { x: number, y: number }): boolean {
        const { x, y } = pos
        return this.r >= Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2)
    }
}
