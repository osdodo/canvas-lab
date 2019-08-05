interface IPoint {
    x: number
    y: number
}

export function randomNum(arr: Array<number>, isInt: boolean): number {  
    const max = Math.max(...arr)
    const min = Math.min(...arr)
    const num = Math.random() * (max - min) + min
    return isInt ? Math.round(num) : num
}

export function randomColor(): string {
    return `rgb(${randomNum([0, 255], true)}, ${randomNum([0, 255], true)}, ${randomNum([0, 255], true)})`
}

export function getDist(p1: IPoint, p2: IPoint): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
}

export function getPosition(element: HTMLElement): IPoint {
    const mouse = {
        x: 0,
        y: 0
    }
    element.addEventListener('mousemove', ({ pageX, pageY, target }) => {
        const { left, top } = (target as Element).getBoundingClientRect()
        mouse.x = pageX - left
        mouse.y = pageY - top 
    })
    return mouse
}

export function angle2Radian(angle: number): number {
    return angle * Math.PI / 180
}

export function radian2Angle(radian: number): number {
    return radian * 180 / Math.PI
}
