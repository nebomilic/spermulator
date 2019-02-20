import { Path, Point, view } from 'paper'
import { SPERM_COLOR } from '../sperm/constants'
import { Egg } from './interfaces'
import { randomNumberWithBounds } from '../../utils'

const calcualteSpawnPosition = (): Point => {
    const size = view.size
    const x = randomNumberWithBounds(1, size.width - 100)
    const y = randomNumberWithBounds(1, size.height - 300)
    return new Point(x, y)
}

const createEgg = (): Egg => {
    const headPath = new Path.Ellipse({
        from: [0, 0],
        to: [80, 80],
        fillColor: SPERM_COLOR,
        strokeColor: SPERM_COLOR
    })

    headPath.position = calcualteSpawnPosition()

    const changePosiiton = () => (headPath.position = calcualteSpawnPosition())

    const check = (path: Path) => {
        headPath.intersects(path) && changePosiiton()
    }

    return {
        changePosition: changePosiiton,
        destroy: () => {},
        draw: () => {},
        check: check
    }
}

export { createEgg }
