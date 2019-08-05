interface ILine {
    x?: number
    y?: number
    x1?: number
    y1?: number
    x2?: number
    y2?: number
    rotation?: number
    lineWidth?: number
    color?: string
    alpha?: number
}

export default class Line {
    public x = 0
    public y = 0
    public x1 = 0
    public y1 = 0
    public x2 = 0
    public y2 = 0
    public rotation = 0
    private lineWidth = 1
    private color = 'rgb(0, 0, 0)'
    private alpha = 1

    constructor(line: ILine) {
        (<any>Object).assign(this, line)
    }

    public render(ctx: CanvasRenderingContext2D): void {
        let { x, y, x1, y1, x2, y2, rotation, lineWidth, color, alpha } = this
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rotation)
        ctx.lineWidth = lineWidth
        ctx.strokeStyle = color
        ctx.globalAlpha = alpha
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        ctx.restore()
    }
}
