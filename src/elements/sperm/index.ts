import { Path, Point, view, project, PlacedSymbol, Symbol } from 'paper'
import { addPoints, substractPoints } from '../../utils'
import { Sperm } from './interfaces'
import {
    SPERM_COLOR,
    STROKE,
    TAIL_SEGMENT_COUNT,
    TAIL_PART_LENGTH,
    HEAD_LENGTH,
    HEAD_WIDTH,
    MAX_STEER,
    FRICTION,
    STEERING,
    MAX_SPEED,
    MIN_SPEED
} from './constants'

const createSperm = (): Sperm => {
    project.currentStyle = {
        strokeColor: SPERM_COLOR,
        strokeWidth: STROKE,
        strokeCap: SPERM_COLOR
    }

    const center = view.center
    const size = TAIL_SEGMENT_COUNT
    const partLength = TAIL_PART_LENGTH
    const path = new Path()
    for (let i = 0; i < size; i++) {
        path.add(new Point(center.x - i * partLength, center.y))
    }

    const headPath = new Path.Ellipse({
        from: [0, 0],
        to: [HEAD_LENGTH, HEAD_WIDTH],
        fillColor: SPERM_COLOR,
        strokeColor: SPERM_COLOR
    })
    headPath.scale(1.3)
    const head = new PlacedSymbol(new Symbol(headPath))
    const vector = new Point({
        angle: 0,
        length: 20
    })
    const maxSteer = MAX_STEER
    const friction = FRICTION
    const steering = STEERING
    const maxSpeed = MAX_SPEED
    const minSpeed = MIN_SPEED
    let speed = minSpeed
    let position = center
    let lastRotation = 0
    let count = 0

    const reverse = () => {
        speed -= 0.3
        if (speed < minSpeed) speed = minSpeed
    }

    const left = () => {
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
    }

    const right = () => {
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
    }

    const forward = () => {
        speed += 0.3
        speed = Math.min(maxSpeed, speed)
    }

    const draw = () => {
        const vec = vector.normalize(Math.abs(speed))
        speed = speed * friction
        position = addPoints(vec, position)
        let lastPoint = (path.firstSegment.point = position)
        let lastVector = vec
        path.segments.map((segment, i) => {
            const vector2 = substractPoints(lastPoint, segment.point)
            count += vec.length * 10
            const rotLength = Math.sin((count + i * 3) / 600)
            const rotated = lastVector.rotate(90).normalize(rotLength)
            lastPoint = segment.point = addPoints(
                lastPoint,
                lastVector.normalize(-partLength - vec.length / 10)
            )
            segment.point = addPoints(segment.point, rotated)

            if (i == 1) {
                head.position = position
                const rotation = vector2.angle
                head.rotate(rotation - lastRotation)
                lastRotation = rotation
            }
            lastVector = vector2
        })
        path.smooth()
        constrain()
        // console.log(this)
    }

    const constrain = () => {
        const bounds = path.bounds
        const size = view.size
        if (!bounds.intersects(view.bounds)) {
            if (position.x < -bounds.width) position.x = size.width + bounds.width
            if (position.y < -bounds.height) position.y = size.height + bounds.height
            if (position.x > size.width + bounds.width) position.x = -bounds.width
            if (position.y > size.height + bounds.height) position.y = -bounds.height
            path.position = position
        }
    }

    return {
        move: () => {},
        left: left,
        right: right,
        forward: forward,
        reverse: reverse,
        draw: draw,
        constrain: constrain
    }
}

export { createSperm, Sperm }
