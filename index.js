import { game } from './frame/game.js'

window.preload = async () => {
    await game().init()
    game().registerRecurringPhysics([
        ...game().state().tank.recurring_physics
    ])

    game().registerRecurringRendering([
        () => background(200),
        ...game().state().tank.recurring_rendering,
        ...game().state().barrel.recurring_rendering
    ])

    game().registerKeyBindings({
        W: [
            ...game().state().bindings.W
        ],
        S: [

        ]
    })
}

window.setup = () => {
    createCanvas(800, 800)
    frameRate(60)
    angleMode(DEGREES)
}

window.draw = () => {
    game().loop()
}