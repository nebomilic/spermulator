import {
    Path,
    Point,
    view,
    setup,
    project,
    PlacedSymbol,
    Symbol,
    KeyEvent,
    Tool,
    Key
} from 'paper'

interface Sperm {
    left: Function
    right: Function
    forward: Function
    reverse: Function
    draw: Function
    constrain: Function
}

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

const createSperm = (): Sperm => {
    project.currentStyle = {
        strokeColor: 'black',
        strokeWidth: 4,
        strokeCap: 'round'
    }

    const center = view.center
    const size = 20
    const partLength = 5
    const path = new Path()
    for (let i = 0; i < size; i++) {
        path.add(new Point(center.x - i * partLength, center.y))
    }

    //path.strokeColor = 'black'

    const headPath = new Path.Ellipse({
        from: [0, 0],
        to: [13, 8],
        fillColor: 'black',
        strokeColor: 'black'
    })
    headPath.scale(1.3)
    const head = new PlacedSymbol(new Symbol(headPath))
    const vector = new Point({
        angle: 0,
        length: 20
    })
    const maxSteer = 4.5
    const friction = 0.98
    const steering = 1.5
    const maxSpeed = 10
    const minSpeed = 1
    let speed = 1
    let position = center
    let lastRotation = 0
    let count = 0
    return {
        left: () => {
            if (speed >= 0.01) {
                if (speed < 3 && speed >= 0) {
                    vector.angle -= speed * 2
                } else if (speed < 0) {
                    vector.angle -= speed / 2
                } else {
                    vector.angle -= maxSteer * steering
                }
                speed *= friction
            }
            // console.log(`angle ${vector.angle}`)
        },
        right: () => {
            if (speed >= 0.01) {
                if (speed < 3 && speed >= 0) {
                    vector.angle += speed * 2
                } else if (speed < 0) {
                    vector.angle += speed / 2
                } else {
                    vector.angle += maxSteer * steering
                }
                speed *= friction
            }
            // console.log(`angle ${vector.angle}`)
        },

        forward: () => {
            speed += 0.3
            speed = Math.min(maxSpeed, speed)
            // console.log(`angle ${vector.angle}`)
        },

        reverse: () => {
            speed -= 0.3
            if (speed < minSpeed) speed = minSpeed
            // console.log(`angle ${vector.angle}`)
        },

        draw: () => {
            var vec = vector.normalize(Math.abs(speed))
            speed = speed * friction
            position = addPoints(vec, position)
            var lastPoint = (path.firstSegment.point = position)
            var lastVector = vec
            var segments = path.segments
            for (var i = 1, l = segments.length; i < l; i++) {
                var segment = segments[i]
                var vector2 = substractPoints(lastPoint, segment.point)
                count += vec.length * 10
                var rotLength = Math.sin((count + i * 3) / 600)
                var rotated = lastVector.rotate(90).normalize(rotLength)
                lastPoint = segment.point = addPoints(
                    lastPoint,
                    lastVector.normalize(-partLength - vec.length / 10)
                )
                segment.point = addPoints(segment.point, rotated)

                if (i == 1) {
                    head.position = position
                    var rotation = vector2.angle
                    head.rotate(rotation - lastRotation)
                    lastRotation = rotation
                }
                lastVector = vector2
            }
            path.smooth()
            //console.log(`speed ${speed}`)
            console.log(position)
            //this.constrain()
        },

        constrain: () => {
            var bounds = path.bounds
            var size = view.size
            if (!bounds.intersects(view.bounds)) {
                if (position.x < -bounds.width) position.x = size.width + bounds.width
                if (position.y < -bounds.height) position.y = size.height + bounds.height
                if (position.x > size.width + bounds.width) position.x = -bounds.width
                if (position.y > size.height + bounds.height) position.y = -bounds.height
                path.position = position
            }
        }
    }
}

const addPoints = (p1: Point, p2: Point): Point => new Point(p1.x + p2.x, p1.y + p2.y)
const substractPoints = (p1: Point, p2: Point): Point => new Point(p1.x - p2.x, p1.y - p2.y)

const begin = () => {
    const canvas: HTMLCanvasElement = document.getElementById('myCanvas') as HTMLCanvasElement
    setup(canvas)
    const sperm = createSperm()
    // sperm()
    view.onFrame = onFrame(sperm)
    const tool1 = new Tool()
    tool1.onKeyDown = onKeyDown(sperm)
    tool1.activate()
    view.draw()
}

window.onload = begin
