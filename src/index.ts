import { SimulateBallDrop, StopFrame as SimulateBallDropStopFrame } from './eg/simulate-ball-drop'
import { Gravitation, StopFrame as GravitationStopFrame } from './eg/gravitation'

const options = [
    {
        id: 0,
        text: '模拟小球掉落',
        drawFn: SimulateBallDrop,
        stopFrameFn: SimulateBallDropStopFrame,
    },
    {
        id: 1,
        text: '粒子引力',
        drawFn: Gravitation,
        stopFrameFn: GravitationStopFrame,
        canvasBackground: '#000',
    }
]

let currentSelectedIndex = 0

const selectChange = (e: any) => {
    const selectedIndex = e.target.selectedIndex
    removeCanvas(currentSelectedIndex)
    const canvas = createCanvas(selectedIndex)
    options[selectedIndex].stopFrameFn && options[selectedIndex].stopFrameFn(false)
    options[selectedIndex].drawFn(canvas)
    currentSelectedIndex = selectedIndex
    options.map(o => {
        if (o.id !== selectedIndex) {
            options[o.id].stopFrameFn && options[o.id].stopFrameFn(true)
        }
    })
}

const createCanvas = (selectedIndex: number) => {  
    const canvas = <any>document.createElement('canvas')
    canvas.id = `canvas${selectedIndex}`
    if (options[selectedIndex].canvasBackground) {
        canvas.style = `background-color: ${options[selectedIndex].canvasBackground};`
    }
    const select = document.getElementById('select')
    document.body.insertBefore(canvas, select)
    return canvas
} 

const removeCanvas = (currentSelectedIndex: number) => {  
    const canvas = <any>document.getElementById(`canvas${currentSelectedIndex}`)
    document.body.removeChild(canvas)
} 

(() => {
    let select = document.createElement('select')
    select.id = 'select'
    select.onchange = selectChange
    for (let i = 0; i < options.length; i++) {
        select.options[i] = new Option(options[i].text, '')
    }
    document.body.appendChild(select)
    const canvas = createCanvas(currentSelectedIndex)
    options[currentSelectedIndex].drawFn(canvas)
})()
