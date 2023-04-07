import {game} from "./frame/game.js";
import {hasLocation, hasMovement} from "./frame/traits.js";

let state_obj = {
    init() {
        return new Promise(async (resolve, reject) => {
            state().projectiles = {
                ...game().traits.hasPhysics([
                    () => {
                        let i = state().projectiles.fired.length
                        while (i--) {
                            if (
                                (frameCount - state().projectiles.fired[i].frame_when_fired) * state().projectiles.fired[i].speed.mag()
                                > state().projectiles.fired[i].range
                            ) {
                                state().projectiles.fired.splice(i, 1)
                                continue
                            }

                            state().projectiles.fired[i].vel.add(state().projectiles.fired[i].acc)
                            state().projectiles.fired[i].loc.add(state().projectiles.fired[i].vel)
                            state().projectiles.fired[i].acc = createVector(0, 0)
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
                    STANDARD: {
                        speed: createVector(0, 10),
                        range: 600,
                        frame_limit_per_shot: 20,
                        damage: 10,
                        create: () => {
                            const {speed, range, frame_limit_per_shot} = state().projectiles.types.STANDARD
                            return {
                                ...game().traits.hasMovement(),
                                frame_when_fired: frameCount,
                                rot: 0,
                                speed,
                                range,
                                frame_limit_per_shot
                            }
                        }
                    }
                },
                fired: [],
                register_projectile: projectile => {
                    state().projectiles.fired.push(projectile)
                }
            }

            // NOTE: Projectiles have to be initialized before the tank so that the projectile types are available when initializing the tank. Not sure I like this.
            state().tank = {
                ...game().traits.hasMovement(0, 0, 0, 0, 150, 150),
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
                            createVector(mouseX - width / 2, mouseY - height / 2))
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
                        pop()
                    },
                    () => {
                        push()
                        translate(width / 2, height / 2)
                        rotate(state().tank.turret.rot - 90)

                        fill(0)
                        ellipse(0, 0, 50, 50)
                        rect(0, -state().tank.turret.barrel.h / 2, 10, state().tank.turret.barrel.h)
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
                                debugger
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
                turret: {
                    rel_loc: createVector(0, 20),
                    rot: 0,
                    barrel: {
                        h: 40,
                        getEnd: () => {
                            return createVector(0, state().tank.turret.barrel.h)
                        }
                    }
                },
                inventory: {
                    magazine: {
                        primary_projectile: state().projectiles.types.STANDARD
                    }
                },
                w: 75,
                h: 100,
                rot: 0,
                drag: 0.1,
                speed: createVector(0, 2),
                turn_speed: 1.2,
                frame_when_last_fired: 0,
                applyForce: force => {
                    state().tank.acc.add(force)
                },
                turn: angle => {
                    state().tank.rot += angle
                },
                fire: () => {
                    if (frameCount - state().tank.frame_when_last_fired > state().tank.inventory.magazine.primary_projectile.frame_limit_per_shot) {
                        let projectile = state().tank.inventory.magazine.primary_projectile.create()
                        projectile.loc = p5.Vector.add(state().tank.loc.copy(), p5.Vector.rotate(state().tank.turret.barrel.getEnd(), state().tank.turret.rot+90))
                        projectile.vel = state().tank.vel.copy()
                        projectile.acc = p5.Vector.rotate(
                            projectile.speed,
                            state().tank.turret.rot + 90)

                        state().projectiles.register_projectile(projectile)
                        state().tank.frame_when_last_fired = frameCount
                    }
                },
                // This will be passed to a projectile object when the tank fires one. This ensures the logic for handling bullet collision is contained within the bullet
                impactCallback: () => {

                }
            }

            state().HUD = {
                ...game().traits.renders([
                    () => {
                        push()
                        translate(width / 2, height / 2)

                        let remaining_frames_mapped = map(
                            frameCount - state().tank.frame_when_last_fired,
                            0,
                            state().tank.inventory.magazine.primary_projectile.frame_limit_per_shot,
                            0,
                            255,
                            true
                        )

                        let below_c = color(255, 100, 0)
                        fill(below_c)
                        rect(
                            state().HUD.fire_cool_down_indicator.x_offset,
                            state().HUD.fire_cool_down_indicator.y_offset,
                            state().HUD.fire_cool_down_indicator.w,
                            state().HUD.fire_cool_down_indicator.h
                        )

                        let above_c = color(100, 255, 0)
                        above_c.setAlpha(remaining_frames_mapped)
                        fill(above_c)
                        rect(
                            state().HUD.fire_cool_down_indicator.x_offset,
                            state().HUD.fire_cool_down_indicator.y_offset,
                            state().HUD.fire_cool_down_indicator.w,
                            state().HUD.fire_cool_down_indicator.h
                        )

                        fill(200)
                        rectMode(CORNER)
                        rect(
                            state().HUD.fire_cool_down_indicator.x_offset-state().HUD.fire_cool_down_indicator.w / 2,
                            state().HUD.fire_cool_down_indicator.y_offset-state().HUD.fire_cool_down_indicator.h / 2,
                            state().HUD.fire_cool_down_indicator.w,
                            map(
                                frameCount - state().tank.frame_when_last_fired,
                                0,
                                state().tank.inventory.magazine.primary_projectile.frame_limit_per_shot,
                                0,
                                state().HUD.fire_cool_down_indicator.h,
                                true
                            )
                        )

                        pop()
                    }
                ]),
                fire_cool_down_indicator: {
                    x_offset: -width/2+30,
                    y_offset: (height/2)-50-20,
                    w: 20,
                    h: 100,
                }
            }

            state().barrel = {
                ...game().traits.hasLocation(50, 50),
                ...game().traits.renders([
                    () => {
                        push()
                        let rel_loc = p5.Vector.sub(state().barrel.loc, state().tank.loc)
                        translate(width / 2, height / 2)
                        fill(100)
                        ellipse(rel_loc.x, rel_loc.y, state().barrel.r*2, state().barrel.r*2)
                        pop()
                    }
                ]),
                r: 25
            }

            state().debugger = {
                ...game().traits.hasKeyBindings({
                    J_D: [
                        () => {
                            console.log(state())
                            debugger
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