//               <==> TankRoyal <==>
//                    <=>  <=>
//                     <>  <>

import {game} from './frame/game.js'
import {circ_rec} from "./frame/collision.js";
import {v} from "./frame/utils.js";

window.preload = async () => {
    await game().init()
    game().registerRecurringPhysics([
        ...game().state().tank.recurring_physics,
        ...game().state().projectiles.recurring_physics,
    ])

    game().registerRecurringRendering([
        () => background(200),
        // <==> DEBUG <==> //
        () => {
            // This represents the vector from the tank to the barrel with the tank being positioned at 0,0
            let rel_loc = p5.Vector.sub(game().state().barrel.loc, game().state().tank.loc)

            // console.log(circ_rec(
            //     game().state().barrel.loc,
            //     game().state().barrel.r,
            //     game().state().tank.loc,
            //     game().state().tank.w,
            //     game().state().tank.h,
            //     game().state().tank.rot,
            // ))

            //Draws line representing above vector
            // stroke(50)
            // strokeWeight(10)
            // line(rel_loc.x, rel_loc.y, 0, 0)

            // Translate to the middle of the canvas
            push()
            translate(width / 2, height / 2)

            let map_a = p5.Vector.sub(v(-10, -10), game().state().tank.loc)
            // line(map_a.x, map_a.y, map_b.x, map_b.y)
            // line(map_a.x, map_a.y, map_c.x, map_c.y)
            // line(map_d.x, map_d.y, map_b.x, map_b.y)
            // line(map_d.x, map_d.y, map_c.x, map_c.y)

            strokeWeight(2)
            stroke(255, 0, 0)
            // line(rel_loc.x, rel_loc.y, 0, 0)

            rotate(game().state().tank.rot)
            let barrel_rotated_rel_loc = p5.Vector.rotate(rel_loc, -game().state().tank.rot)

            stroke(0, 255, 0)
            // line(barrel_rotated_rel_loc.x, barrel_rotated_rel_loc.y, game().state().tank.w/2, game().state().tank.h/2)
            // line(barrel_rotated_rel_loc.x, barrel_rotated_rel_loc.y, -game().state().tank.w/2, -game().state().tank.h/2)
            // line(barrel_rotated_rel_loc.x, barrel_rotated_rel_loc.y, -game().state().tank.w/2, game().state().tank.h/2)
            // line(barrel_rotated_rel_loc.x, barrel_rotated_rel_loc.y, game().state().tank.w/2, -game().state().tank.h/2)

            pop()
        },
        ...game().state().tank.recurring_rendering,
        ...game().state().barrel.recurring_rendering,
        ...game().state().HUD.recurring_rendering,
        ...game().state().projectiles.recurring_rendering
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

    game().collision().registerCollider(game().state().tank, "RECT", ()=>{console.log('hit')})
    game().collision().registerCollider(game().state().barrel, "CIRC", ()=>{console.log('hit c')})
}

window.setup = () => {
    createCanvas(windowWidth-100, windowHeight-100)
    frameRate(60)
    angleMode(DEGREES)
}

window.draw = () => {
    game().loop()
}

