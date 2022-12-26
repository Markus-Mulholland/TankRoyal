import {game} from './frame/game.js'

window.preload = async () => {
    await game().init()
    game().registerRecurringPhysics([
        ...game().state().tank.recurring_physics,
        ...game().state().projectiles.recurring_physics,
    ])

    game().registerRecurringRendering([
        () => background(200),
        ...game().state().tank.recurring_rendering,
        ...game().state().barrel.recurring_rendering,
        ...game().state().HUD.recurring_rendering,
        ...game().state().projectiles.recurring_rendering,
    ])

    game().registerKeyBindings({
        W_D: [
            ...game().state().tank.bindings.W_D
        ],
        S_D: [
            ...game().state().tank.bindings.S_D
        ],
        A_D: [
            ...game().state().tank.bindings.A_D
        ],
        D_D: [
            ...game().state().tank.bindings.D_D
        ],
        J_D: [
            ...game().state().debugger.bindings.J_D
        ],
        M__D: [
            ...game().state().tank.bindings.M__D
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

