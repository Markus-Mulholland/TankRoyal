import {game} from "./frame/game";
import {hasMovement} from "./frame/traits";

let state_obj = {
    init() {
        return new Promise(async (resolve, reject) => {
            state().tank = {
                ...game().traits.hasMovement(),
                ...game().traits.hasPhysics([
                    () => { // Move
                        state().tank.vel.add(state().tank.acc)
                        state().tank.loc.add(state().tank.vel)
                        state().tank.acc = createVector(0, 0)
                    },
                    () => { // Apply Drag to velocity
                        if (state().tank.vel.mag() > 0 && state().tank.vel.mag() < 0.1)
                            state().tank.vel.mult(0)
                        if (state().tank.vel.mag() === 0) return
                        state().tank.vel.mult(state().tank.drag)
                    },
                    () => { // Handle Turret Rotation
                        let mouse_loc = p5.Vector.sub(
                            createVector(0, 0),
                            createVector(mouseX - width / 2, mouseY - width / 2))
                        state().tank.turret.rot = mouse_loc.heading()
                    }
                ]),
                ...game().traits.renders([
                    () => {
                        noStroke()
                        fill(255)
                        rectMode(CENTER);

                        push()
                        translate(width / 2, height / 2)
                        rotate(state().tank.rot)
                        rect(0, 0, state().tank.w, state().tank.h)

                        fill(0)
                        rect(0, -50, 20, 10)
                        rect(-state().tank.w / 2 - 7, 0, 14, 80)
                        rect(state().tank.w / 2 + 7, 0, 14, 80)
                        pop()
                    },
                    () => {
                        push()
                        translate(width / 2, width / 2)
                        rotate(state().tank.turret.rot - 90)

                        fill(0)
                        ellipse(0, 0, 50, 50)
                        rect(0, -state().tank.turret.barrel_h/2, 10, state().tank.turret.barrel_h)
                        pop()
                    }
                ]),
                ...game().traits.hasKeyBindings({
                    W_D: [
                        () => {
                            if (game().keylogger().pressed_keys.indexOf('W') > -1
                                && game().keylogger().pressed_keys.indexOf('S') < 0) {
                                state().tank.applyForce(p5.Vector.rotate(
                                    p5.Vector.mult(state().tank.speed, -1),
                                    state().tank.rot
                                ))
                            }
                        }
                    ],
                    S_D: [
                        () => {
                            if (game().keylogger().pressed_keys.indexOf('S') > -1
                                && game().keylogger().pressed_keys.indexOf('W') < 0) {
                                state().tank.applyForce(p5.Vector.rotate(
                                    state().tank.speed,
                                    state().tank.rot)
                                )
                            }
                        }
                    ],
                    A_D: [
                        () => {
                            if (game().keylogger().pressed_keys.indexOf('A') > -1
                                && game().keylogger().pressed_keys.indexOf('D') < 0) {
                                state().tank.turn(-state().tank.turn_speed)
                            }
                        }
                    ],
                    D_D: [
                        () => {
                            if (game().keylogger().pressed_keys.indexOf('D') > -1
                                && game().keylogger().pressed_keys.indexOf('A') < 0) {
                                state().tank.turn(state().tank.turn_speed)
                            }
                        }
                    ],
                    M__D: [
                        () => {
                            state().tank.fire()
                        }
                    ]
                }),
                w: 75,
                h: 100,
                rot: 0,
                drag: 0.1,
                speed: createVector(0, 2),
                turn_speed: 1.2,
                turret: {
                    rel_loc: createVector(0, 20),
                    rot: 0,
                    barrel_h: 40
                },
                fire_rate: 10,
                frame_when_last_fired: 0,
                applyForce: force => {
                    state().tank.acc.add(force)
                },
                turn: angle => {
                    state().tank.rot += angle
                },
                fire: () => {
                    if (frameCount - state().tank.frame_when_last_fired > state().tank.fire_rate) {
                        let projectile = state().projectiles.types.STANDARD()
                        projectile.loc = state().tank.loc.copy()
                        projectile.vel = state().tank.vel.copy()
                        projectile.acc = p5.Vector.rotate(projectile.speed, state().tank.turret.rot + 90)

                        state().projectiles.register_projectile(projectile)
                        state().tank.frame_when_last_fired = frameCount
                    }
                }
            }

            state().HUD = {
                ...game().traits.renders([
                    () => {
                        push()
                        translate(width / 2, width / 2)
                        rotate(state().tank.rot)
                        push()
                        translate(0, state().HUD.fire_cool_down_indicator.y_offset)

                        fill(0)
                        rect(
                            0,
                            0,
                            state().HUD.fire_cool_down_indicator.w,
                            state().HUD.fire_cool_down_indicator.h
                        )

                        fill(255)
                        rectMode(CORNER)
                        rect(
                            -state().HUD.fire_cool_down_indicator.w / 2,
                            -state().HUD.fire_cool_down_indicator.h / 2,
                            map(
                                frameCount - state().tank.frame_when_last_fired,
                                0,
                                state().tank.fire_rate,
                                0,
                                state().HUD.fire_cool_down_indicator.w,
                                true
                            ),
                            state().HUD.fire_cool_down_indicator.h
                        )

                        pop()
                        pop()
                    }
                ]),
                fire_cool_down_indicator: {
                    y_offset: state().tank.h / 2 + 20,
                    w: 50,
                    h: 5,
                }
            }

            state().projectiles = {
                ...game().traits.hasPhysics([
                    () => {
                        state().projectiles.fired.forEach((projectile, i, arr) => {
                            arr[i].vel.add(arr[i].acc)
                            arr[i].loc.add(arr[i].vel)
                            arr[i].acc = createVector(0, 0)
                        })
                    },
                    () => {
                        let i = state().projectiles.fired.length
                        while (i--) {
                            if (
                                (frameCount - state().projectiles.fired[i].frame_created) * state().projectiles.fired[i].speed.mag()
                                    > state().projectiles.fired[i].range) {
                                state().projectiles.fired.splice(i, 1)
                            }
                        }
                    }
                ]),
                ...game().traits.renders([
                    () => {
                        state().projectiles.fired.forEach(projectile => {
                            fill(255, 0, 0)
                            push()
                            translate(width / 2, height / 2)
                            let rel_loc = p5.Vector.sub(projectile.loc, state().tank.loc)
                            ellipse(rel_loc.x, rel_loc.y, 10, 10)
                            pop()
                        })
                    }
                ]),
                types: {
                    STANDARD: () => ({
                        ...game().traits.hasMovement(),
                        speed: createVector(0, 10),
                        rot: 0,
                        range: 300,
                        frame_created: frameCount
                    })
                },
                fired: [],
                register_projectile: projectile => {
                    state().projectiles.fired.push(projectile)
                }
            }

            state().barrel = {
                loc: createVector(50, 50),
                ...game().traits.renders([
                    () => {
                        let rel_loc = p5.Vector.sub(state().barrel.loc, state().tank.loc)
                        ellipse(rel_loc.x, rel_loc.y, 50, 50)
                    }
                ])
            }

            state().debugger = {
                ...game().traits.hasKeyBindings({
                    J_D: [
                        () => {
                            console.log(state())
                        }
                    ],
                })
            }

            console.log("%cState Initialized", "" +
                "color:pink;");
            resolve(state())
        })
    }
};

export const state = () => state_obj