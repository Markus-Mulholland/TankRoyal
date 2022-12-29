//               <==> TankRoyal <==>
//                    <=>  <=>
//                     <>  <>

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
        // <==> DEBUG <==> //
        () => {
            let rel_loc = p5.Vector.sub(game().state().barrel.loc, game().state().tank.loc)

            push()
            translate(width / 2, height / 2)

            rotate(game().state().tank.rot)
            let rotated_rel_loc = p5.Vector.rotate(rel_loc, -game().state().tank.rot)

            strokeWeight(2)
            stroke(255, 0, 0)
            line(rotated_rel_loc.x, rotated_rel_loc.y, 0, 0)

            stroke(0, 255, 0)
            line(rotated_rel_loc.x, rotated_rel_loc.y, game().state().tank.w/2, game().state().tank.h/2)
            line(rotated_rel_loc.x, rotated_rel_loc.y, -game().state().tank.w/2, -game().state().tank.h/2)
            line(rotated_rel_loc.x, rotated_rel_loc.y, -game().state().tank.w/2, game().state().tank.h/2)
            line(rotated_rel_loc.x, rotated_rel_loc.y, game().state().tank.w/2, -game().state().tank.h/2)


            pop()
        }
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

