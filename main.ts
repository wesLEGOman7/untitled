let leftY = 1
let rightY = 1
let ballX = 2
let ballY = 2
let ballDX = 1
let ballDY = 1
let leftScore = 0
let rightScore = 0
let speed = 200

function clamp(value: number, min: number, max: number): number {
    if (value < min) return min
    if (value > max) return max
    return value
}

function drawBoard() {
    basic.clearScreen()

    // left paddle (2 LEDs tall)
    led.plot(0, leftY)
    led.plot(0, leftY + 1)

    // right paddle (2 LEDs tall)
    led.plot(4, rightY)
    led.plot(4, rightY + 1)

    // ball
    led.plot(ballX, ballY)
}

function resetBall(direction: number) {
    ballX = 2
    ballY = 2
    ballDX = direction
    ballDY = Math.randomRange(-1, 1)
    if (ballDY == 0) {
        ballDY = 1
    }
    speed = 200
}

function showScore() {
    basic.showString("" + leftScore + "-" + rightScore)
    basic.pause(350)
    basic.clearScreen()
}

input.onButtonPressed(Button.A, function () {
    leftY = clamp(leftY - 1, 0, 3)
    drawBoard()
})

input.onButtonPressed(Button.B, function () {
    leftY = clamp(leftY + 1, 0, 3)
    drawBoard()
})

input.onButtonPressed(Button.AB, function () {
    leftScore = 0
    rightScore = 0
    leftY = 1
    rightY = 1
    resetBall(Math.randomRange(0, 1) == 0 ? -1 : 1)
    showScore()
})

basic.forever(function () {
    // left paddle movement using press state
    if (input.buttonA.isPressed() && !input.buttonB.isPressed()) {
        leftY = clamp(leftY - 1, 0, 3)
    }
    if (input.buttonB.isPressed() && !input.buttonA.isPressed()) {
        leftY = clamp(leftY + 1, 0, 3)
    }

    // simple AI for right paddle
    if (ballY < rightY) {
        rightY = clamp(rightY - 1, 0, 3)
    } else if (ballY > rightY + 1) {
        rightY = clamp(rightY + 1, 0, 3)
    }

    // move the ball
    ballX += ballDX
    ballY += ballDY

    // top and bottom wall bounce
    if (ballY <= 0 || ballY >= 4) {
        ballDY = -ballDY
        if (ballY < 0) ballY = 0
        if (ballY > 4) ballY = 4
    }

    // left paddle collision
    if (ballX <= 0 && ballY >= leftY && ballY <= leftY + 1) {
        ballX = 0
        ballDX = 1
        if (ballY == leftY) {
            ballDY = -1
        } else if (ballY == leftY + 1) {
            ballDY = 1
        } else {
            ballDY = 0
        }
        speed = Math.max(80, speed - 10)
    }

    // right paddle collision
    if (ballX >= 4 && ballY >= rightY && ballY <= rightY + 1) {
        ballX = 4
        ballDX = -1
        if (ballY == rightY) {
            ballDY = -1
        } else if (ballY == rightY + 1) {
            ballDY = 1
        } else {
            ballDY = 0
        }
        speed = Math.max(80, speed - 10)
    }

    // player scores
    if (ballX < 0) {
        rightScore += 1
        showScore()
        resetBall(1)
    }

    // computer scores
    if (ballX > 4) {
        leftScore += 1
        showScore()
        resetBall(-1)
    }

    drawBoard()
    basic.pause(speed)
})

resetBall(1)
drawBoard()