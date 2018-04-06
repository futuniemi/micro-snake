enum Dir {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3
}

interface Point {
    cx: number
    cy: number
}

let gameOn = false
let snakeArray: Point[] = []
let maxSnakeLength = 1
let direction: Dir = Dir.RIGHT
let currentFood: Point = null

const resetGame = () => {
    snakeArray = []
    maxSnakeLength = 1
    direction = Dir.RIGHT

    for (let gx = 0; gx < 5; gx = gx + 1) {
        for (let gy = 0; gy < 5; gy = gy + 1) {
            led.unplot(gx, gy)
        }
    }
}

input.onButtonPressed(Button.AB, () => {
    resetGame()
    gameOn = !gameOn
    gameOn && control.inBackground(() => doGame())
})

input.onButtonPressed(Button.B, () => {
    if (direction === Dir.UP) {
        direction = Dir.RIGHT
    } else if (direction === Dir.RIGHT) {
        direction = Dir.DOWN
    } else if (direction === Dir.DOWN) {
        direction = Dir.LEFT
    } else if (direction === Dir.LEFT) {
        direction = Dir.UP
    }
})

input.onButtonPressed(Button.A, () => {
    if (direction === Dir.UP) {
        direction = Dir.LEFT
    } else if (direction === Dir.RIGHT) {
        direction = Dir.UP
    } else if (direction === Dir.DOWN) {
        direction = Dir.RIGHT
    } else if (direction === Dir.LEFT) {
        direction = Dir.DOWN
    }
})

const doGame = () => {
    let x = 0
    let y = 0
    currentFood = getNextFood()
    led.plot(x, y)
    snakeArray.push({ cx: x, cy: y })
    led.plot(currentFood.cx, currentFood.cy)

    while (gameOn) {
        basic.pause(500)
        x = getNextX(x, direction)
        y = getNextY(y, direction)

        const newPoint: Point = { cx: x, cy: y }

        if (isCollision(newPoint, snakeArray)) {
            gameOn = false
            break
        }

        snakeArray.push(newPoint)
        led.plot(newPoint.cx, newPoint.cy)

        checkIfFoodJustEaten(newPoint)

        snakeArray = trimSnakeArray(snakeArray)
    }
}

const checkIfFoodJustEaten = (newPoint: Point) => {
    if (newPoint.cx === currentFood.cx && newPoint.cy === currentFood.cy) {
        maxSnakeLength = maxSnakeLength + 1
        currentFood = getNextFood()
        led.plot(currentFood.cx, currentFood.cy)
    }
}

function getNextFood(): Point {
    const newFood: Point = {
        cx: Math.random(4),
        cy: Math.random(4)
    }
    if (isCollision(newFood, snakeArray)) {
        return getNextFood()
    }
    return newFood
}

function isCollision(point: Point, points: Point[]) {
    for (let i = 0; i < points.length; i = i + 1) {
        if (point.cx === points[i].cx && point.cy === points[i].cy) {
            return true
        }
    }
    return false
}

const trimSnakeArray = (array: Point[]): Point[] => {
    if (array.length > maxSnakeLength) {
        const lastPoint = array.removeAt(0)
        led.unplot(lastPoint.cx, lastPoint.cy)
    }
    return array
}

const getNextX = (x: number, direction: Dir): number => {
    if (direction === Dir.LEFT) {
        return handleWalls(x - 1)
    } else if (direction === Dir.RIGHT) {
        return handleWalls(x + 1)
    }
    return x
}

const getNextY = (y: number, direction: Dir): number => {
    if (direction === Dir.UP) {
        return handleWalls(y - 1)
    } else if (direction === Dir.DOWN) {
        return handleWalls(y + 1)
    }
    return y
}

const handleWalls = (z: number): number => {
    if (z > 4) {
        return 0
    } else if (z < 0) {
        return 4
    }
    return z
}