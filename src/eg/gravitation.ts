import Ball from '../shape/Ball'
import Line from '../shape/Line'
import { randomNum, randomColor } from '../lib/utils'

interface ICanvasSize {
    w: number,
    h: number
}

let isStop = false

export function StopFrame(bool: boolean): void {
    isStop = bool
}

function init(canvasSize: ICanvasSize): Array<Ball> {
    const n = canvasSize.w * canvasSize.h / 5000
    const particles = []
    for (let i = 0; i < n; i++) {
        const size = randomNum([5, 15], false)
        particles.push(new Ball({
            x: randomNum([0, canvasSize.w], false),
            y: randomNum([0, canvasSize.h], false),
            r: size,
            m: size,
            vx: randomNum([-2, 2], false),
            vy: randomNum([-2, 2], false),
            color: randomColor(),
        }))
    }
    return particles
}

function drawConnectingLine(ctx: CanvasRenderingContext2D, b1: Ball, b2: Ball, dist: number, minDist: number): void {
    const line = new Line({
        x1: b1.x,
        y1: b1.y,
        x2: b2.x,
        y2: b2.y,
        color: '#ddd',
        lineWidth: 2 * Math.max(0, (1 - dist / minDist)),
        alpha: Math.max(0, (1 - dist / minDist)),
    })
    line.render(ctx)
}


function springEffect(ctx: CanvasRenderingContext2D, b1: Ball, b2: Ball, spring: number, canvasSize: ICanvasSize): void {
    const { w, h } = canvasSize
    let dx = b2.x - b1.x
    let dy = b2.y - b1.y
    let dist = Math.sqrt(dx ** 2 + dy ** 2)
    let minDist = w > h ? w / 10 : h / 5
    if (dist < minDist) {
        drawConnectingLine(ctx, b1, b2, dist, minDist)
        let ax = dx * spring
        let ay = dy * spring
        b1.vx += ax / b1.m
        b1.vy += ay / b1.m
        b2.vx -= ax / b2.m
        b2.vy -= ay / b2.m
    }
}

function ballHitEffect(b1: Ball, b2: Ball): void {
    let dx = b2.x - b1.x
    let dy = b2.y - b1.y
    let dist = Math.sqrt(dx ** 2 + dy ** 2)
    if (dist < b1.r + b2.r) {
        let angle = Math.atan2(dy, dx)
        let sin = Math.sin(angle)
        let cos = Math.cos(angle)

        let x1 = 0
        let y1 = 0
        let x2 = dx * cos + dy * sin
        let y2 = dy * cos - dx * sin

        let vx1 = b1.vx * cos + b1.vy * sin
        let vy1 = b1.vy * cos - b1.vx * sin
        let vx2 = b2.vx * cos + b2.vy * sin
        let vy2 = b2.vy * cos - b2.vx * sin

        let vx1Final = ((b1.m - b2.m) * vx1 + 2 * b2.m * vx2) / (b1.m + b2.m)
        let vx2Final = ((b2.m - b1.m) * vx2 + 2 * b1.m * vx1) / (b1.m + b2.m)

        let lep = (b1.r + b2.r) - Math.abs(x2 - x1)

        x1 = x1 + (vx1Final < 0 ? -lep / 2 : lep / 2)
        x2 = x2 + (vx2Final < 0 ? -lep / 2 : lep / 2)

        b2.x = b1.x + (x2 * cos - y2 * sin)
        b2.y = b1.y + (y2 * cos + x2 * sin)
        b1.x = b1.x + (x1 * cos - y1 * sin)
        b1.y = b1.y + (y1 * cos + x1 * sin)

        b1.vx = vx1Final * cos - vy1 * sin
        b1.vy = vy1 * cos + vx1Final * sin
        b2.vx = vx2Final * cos - vy2 * sin
        b2.vy = vy2 * cos + vx2Final * sin
    }
}

function moveParticle(ctx: CanvasRenderingContext2D, particles: Array<Ball>, spring: number, canvasSize: ICanvasSize): void {
    const { w, h } = canvasSize
    for (let i = 0, len = particles.length; i < len; i++) {
        const b1 = particles[i]
        b1.x += b1.vx
        b1.y += b1.vy
        
        for (let j = i + 1; j < len; j++) {
            const b2 = particles[j]
            springEffect(ctx, b1, b2, spring, canvasSize)
            ballHitEffect(b1, b2)
        }

        if (b1.x - b1.r > w)  { b1.x = -b1.r }
        else if (b1.x + b1.r < 0) { b1.x = w + b1.r }

        if (b1.y - b1.r > h) { b1.y = -b1.r }
        else if (b1.y + b1.r < 0) { b1.y = h + b1.r }
    }
}

function renderParticle(ctx: any, particles: Array<Ball>): void {
    for (let i = 0, len = particles.length; i < len; i++) {
        particles[i].render(ctx)
    }
}

export function Gravitation(canvas: HTMLCanvasElement): void {
    const ctx = <CanvasRenderingContext2D>canvas.getContext('2d')
    const spring = 0.0001
    let particles: Array<Ball> = []
    let canvasSize: ICanvasSize = {
        w: 0,
        h: 0
    }
    window.onresize = () => {
        canvasSize.w = canvas.width = window.innerWidth
        canvasSize.h = canvas.height = window.innerHeight
        particles = init(canvasSize)
    }
    (<any>window).onresize()

    const requestAnimFrame: (callback: () => void) => void = (() => {
        return window.requestAnimationFrame 
            || (<any>window).webkitRequestAnimationFrame 
            || (<any>window).mozRequestAnimationFrame 
            || (<any>window).oRequestAnimationFrame 
            || (<any>window).msRequestAnimationFrame
    })()

    const drawFrame = () => {
        if (isStop) return
        requestAnimFrame(drawFrame)
        ctx.clearRect(0, 0, canvasSize.w, canvasSize.h)
        moveParticle(ctx, particles, spring, canvasSize)
        renderParticle(ctx, particles)
    }

    drawFrame()
}
