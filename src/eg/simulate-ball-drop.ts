import Ball from '../shape/Ball'
import Line from '../shape/Line'
import { randomNum, randomColor, angle2Radian } from '../lib/utils'

interface ICanvasSize {
    w: number,
    h: number
}

let isStop = false

export function StopFrame(bool: boolean): void {
    isStop = bool
}

function lineHitEffect(ball: Ball, line: Line, bounce: number): void {
    let sin = Math.sin(line.rotation)
    let cos = Math.cos(line.rotation)

    let rx = ball.x - line.x
    let ry = ball.y - line.y

    let x_ = rx * cos + ry * sin
    let y_ = ry * cos - rx * sin

    let vx_ = ball.vx * cos + ball.vy * sin
    let vy_ = ball.vy * cos - ball.vx * sin

    if (x_ + ball.r > line.x1 && x_ - ball.r < line.x2) {
        if (y_ + ball.r > 0 && vy_ > y_) {
            y_ = -ball.r
            vy_ *= bounce
        }
        if (y_ - ball.r < 0 && vy_ < y_) {
            y_ = ball.r
            vy_ *= bounce
        }
    }

    rx = x_ * cos - y_ * sin
    ry = y_ * cos + x_ * sin

    ball.vx = vx_ * cos - vy_ * sin
    ball.vy = vy_ * cos + vx_ * sin

    ball.x = line.x + rx
    ball.y = line.y + ry
}

function ballHitEffect(b1: Ball, b2: Ball, spring: number): void {
    const dx = b2.x - b1.x
    const dy = b2.y - b1.y
    const dist = Math.sqrt(dx ** 2 + dy ** 2)
    const minDist = b1.r + b2.r
    if (dist < minDist) {
        const tx = b1.x + dx / dist * minDist
        const ty = b1.y + dy / dist * minDist
        const ax = (tx - b2.x) * spring
        const ay = (ty - b2.y) * spring
        b1.vx -= ax
        b1.vy -= ay
        b2.vx += ax
        b2.vy += ay
    }
}

function hitEffect(balls: Array<Ball>, lines: Array<Line>, bounce: number, spring: number): void {
    for (let i = 0, ballsLen = balls.length; i < ballsLen; i++) {
        const currentBall = balls[i]
        for (let j = 0, len = lines.length; j < len; j++) {
            lineHitEffect(currentBall, lines[j], bounce) 
        }
        for (let k = i + 1; k < ballsLen; k++) {
            ballHitEffect(currentBall, balls[k], spring)
        }
    }
}

function moveBall(
    balls: Array<Ball>, 
    xfriction: number, yfriction: number, 
    bounce: number, g: number, 
    canvasSize: ICanvasSize
): void {
    const { w, h } = canvasSize
    for (let i = 0, len = balls.length; i < len; i++) {
        //重力作用
        balls[i].vy += g

        //阻力作用
        if (balls[i].vy > 0 && balls[i].vy - yfriction > 0)      { balls[i].vy -= yfriction }
        else if (balls[i].vy < 0 && balls[i].vy + yfriction < 0) { balls[i].vy += yfriction }
        else                                                     { balls[i].vy = 0 }

        if (balls[i].vx > 0 && balls[i].vx - xfriction > 0)      { balls[i].vx -= xfriction }
        else if (balls[i].vx < 0 && balls[i].vx + xfriction < 0) { balls[i].vx += xfriction }
        else                                                     { balls[i].vx = 0 }

        //y方向速度作用&&落地处理
        balls[i].y += balls[i].vy
        if (balls[i].y + balls[i].r >= h) {
            balls[i].y = h - balls[i].r
            balls[i].vy *= -1
        }

        //x方向速度作用&&左右边界处理
        balls[i].x += balls[i].vx
        if (balls[i].x - balls[i].r <= 0) {
            balls[i].x = balls[i].r
            balls[i].vx *= bounce
        } else if (balls[i].x + balls[i].r >= w) {
            balls[i].x = w - balls[i].r
            balls[i].vx *= bounce
        }
    }
}

function renderLine(ctx: CanvasRenderingContext2D, lines: Array<Line>): void {
    for (let i = 0, len = lines.length; i < len; i++) {
        lines[i].render(ctx) 
    }
}

function renderBall(ctx: CanvasRenderingContext2D, balls: Array<Ball>): void {
    for (let i = 0, len = balls.length; i < len; i++) {
        balls[i].render(ctx)   
    }
}

export function SimulateBallDrop(canvas: HTMLCanvasElement): void {
    const W = canvas.width = 800
    const H = canvas.height = 600
    const canvasSize: ICanvasSize = {
        w: W,
        h: H
    }
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d')
    const g =  0.3
    const spring = 0.25
    const yfriction = 0.05
    const xfriction = 0.01
    const bounce = -0.5
    const balls: Array<Ball> = []
    const lines: Array<Line> = []

    lines.push(new Line({ x: 100, y: 400, x2: 290, rotation: angle2Radian(20), lineWidth: 5 }))
    lines.push(new Line({ x: 700, y: 400, x2: 290, rotation: angle2Radian(160), lineWidth: 5 }))
    for (let i = 0; i < 20; i++) {
        balls.push(
            new Ball({ 
                x: randomNum([0, W], false), 
                y: randomNum([0, H], false), 
                r: randomNum([3, 20], false),
                color: randomColor(),
            })
        )
    }

    const drawFrame = () => {
        if (isStop) return
        window.requestAnimationFrame(drawFrame)
        ctx.clearRect(0, 0, W, H)
        hitEffect(balls, lines, bounce, spring)
        moveBall(balls, xfriction, yfriction, bounce, g, canvasSize)
        renderBall(ctx, balls)
        renderLine(ctx, lines)
    }

    drawFrame()
}
