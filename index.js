import { game } from './game.js'

window.preload = () => {
    game().init()
}

window.setup = () => {
    createCanvas(800, 800)
    frameRate(60)
    angleMode(DEGREES)
}

window.draw = () => {
    game().loop()
}

window.keyPressed = () => {
    game().keylogger.keyPressed(key)
}

window.keyReleased = () => {
    game().keylogger.keyReleased(key)
}