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
    FRICTION,
    MIN_SPEED
} from './constants'

const LEFT = 'LEFT'
const RIGHT = 'RIGHT'

const createSperm = (): Sperm => {
    project.currentStyle = {
        strokeColor: SPERM_COLOR,
        strokeWidth: STROKE,
        strokeCap: SPERM_COLOR
    }

    const center = view.center
    const size = TAIL_SEGMENT_COUNT
    const partLength = TAIL_PART_LENGTH
    const tailPath = new Path()
    for (let i = 0; i < size; i++) {
        tailPath.add(new Point(center.x - i * partLength, center.y))
    }

    const headPath = new Path.Ellipse({
        from: [0, 0],
        to: [HEAD_LENGTH, HEAD_WIDTH],
        fillColor: SPERM_COLOR,
        strokeColor: SPERM_COLOR
    })
    const head = new PlacedSymbol(new Symbol(headPath))
    const vector = new Point({
        angle: 0,
        length: 20
    })
    const friction = FRICTION
    let speed = MIN_SPEED
    let position = center
    let lastRotation = 0
    let count = 0
    let rotationCounter = 0
    let moveSide = LEFT
    const acc = 4
    let multiplier = -1
    const rotationSteps = 60

    const move = () => {
        moveSide = moveSide === LEFT ? RIGHT : LEFT
        multiplier = moveSide === LEFT ? -1 : 1
        rotationCounter = 0
        speed += acc
    }

    const draw = () => {
        if (rotationCounter < rotationSteps) {
            rotationCounter++
            vector.angle +=
                Math.sin((rotationCounter * 0.02 * speed * Math.PI) / 180) *
                (180 / Math.PI) *
                multiplier
        }
        const vec = vector.normalize(Math.abs(speed))
        speed = speed * friction
        position = addPoints(vec, position)
        let lastPoint = (tailPath.firstSegment.point = position)
        let lastVector = vec
        tailPath.segments.map((segment, i) => {
            const vector2 = substractPoints(lastPoint, segment.point)
            count += vec.length * 10
            const rotLength = Math.sin((count + i * 3) / 1200)
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
        tailPath.smooth()
        tailPath.strokeCap = 'round'
        constrain()
    }

    const constrain = () => {
        const bounds = tailPath.bounds
        const size = view.size
        if (!bounds.intersects(view.bounds)) {
            if (position.x < -bounds.width) position.x = size.width + bounds.width
            if (position.y < -bounds.height) position.y = size.height + bounds.height
            if (position.x > size.width + bounds.width) position.x = -bounds.width
            if (position.y > size.height + bounds.height) position.y = -bounds.height
            tailPath.position = position
        }
    }

    return {
        move: move,
        draw: draw,
        constrain: constrain
    }
}

export { createSperm }
