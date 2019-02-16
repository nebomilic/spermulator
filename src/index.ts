import { view, setup, KeyEvent, Tool, Key } from 'paper'
import { Sperm, createSperm } from './elements/sperm'

const onFrame = (sperm: Sperm) => () => {
    Key.isDown('left') && sperm.left()
    Key.isDown('right') && sperm.right()
    Key.isDown('up') && sperm.forward()
    Key.isDown('down') && sperm.reverse()

    sperm.draw()
    //sperm.constrain()
}

const onKeyDown = (sperm: Sperm) => (event: KeyEvent) => {
    event.preventDefault()
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
    tool.activate()
    view.draw()
}

window.onload = begin
