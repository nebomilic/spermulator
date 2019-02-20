import { Point, view } from 'paper'

const addPoints = (p1: Point, p2: Point): Point => new Point(p1.x + p2.x, p1.y + p2.y)
const substractPoints = (p1: Point, p2: Point): Point => new Point(p1.x - p2.x, p1.y - p2.y)
const randomNumberWithBounds = (min: number, max: number) =>
    Math.floor(Math.random() * max + min)

export { addPoints, substractPoints, randomNumberWithBounds }
