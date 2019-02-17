import { view, setup, KeyEvent, Tool, Key, ToolEvent } from 'paper'
import { Sperm, createSperm } from './elements/sperm'

const onFrame = (sperm: Sperm) => () => {
    sperm.draw()
}

const onKeyDown = (sperm: Sperm) => (event: KeyEvent) => {
    event.preventDefault()
    if (event.key === 'space') sperm.move()
}

const onMouseDown = (sperm: Sperm) => (event: ToolEvent) => {
    event.preventDefault()
    sperm.move()
}

const begin = () => {
    const canvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    setup(canvas)
    const sperm = createSperm()
    view.onFrame = onFrame(sperm)
    const tool = new Tool()
    tool.onKeyDown = onKeyDown(sperm)
    tool.onMouseDown = onMouseDown(sperm)
    tool.activate()
    view.draw()
}

window.onload = begin
