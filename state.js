import {game} from "./frame/game";
import {hasMovement} from "./frame/traits";

let state_obj = {
    init() {
        return new Promise(async (resolve, reject) => {
            state().tank = {
                ...game().traits.hasMovement(),
                ...game().traits.hasPhysics([
                    () => { // Handle Movement Input
                        if (game().keylogger().pressed_keys.indexOf('W') > -1
                            && game().keylogger().pressed_keys.indexOf('S') < 0) {
                            game().state().tank.applyForce(p5.Vector.rotate(
                                p5.Vector.mult(game().state().tank.speed, -1),
                                game().state().tank.rot
                            ))
                        } else if (game().keylogger().pressed_keys.indexOf('S') > -1
                            && game().keylogger().pressed_keys.indexOf('W') < 0) {
                            game().state().tank.applyForce(p5.Vector.rotate(
                                game().state().tank.speed,
                                game().state().tank.rot)
                            )
                        }

                        if (game().keylogger().pressed_keys.indexOf('A') > -1
                            && game().keylogger().pressed_keys.indexOf('D') < 0) {
                            game().state().tank.turn(-game().state().tank.turn_speed)
                        } else if (game().keylogger().pressed_keys.indexOf('D') > -1
                            && game().keylogger().pressed_keys.indexOf('A') < 0) {
                            game().state().tank.turn(game().state().tank.turn_speed)
                        }
                    },
                    () => { // Move
                        game().state().tank.vel.add(game().state().tank.acc)
                        game().state().tank.loc.add(game().state().tank.vel)
                        game().state().tank.acc = createVector(0, 0)
                    },
                    () => { // Apply Drag to velocity
                        if (game().state().tank.vel.mag() > 0 && game().state().tank.vel.mag() < 0.1)
                            game().state().tank.vel.mult(0)
                        if (game().state().tank.vel.mag() === 0) return
                        game().state().tank.vel.mult(game().state().tank.drag)
                    },
                    () => { // Handle Turret Rotation
                        let mouse_loc = p5.Vector.sub(
                            createVector(0, 0),
                            createVector(mouseX - width / 2, mouseY - width / 2))
                        game().state().tank.turret.rot = mouse_loc.heading()
                    }
                ]),
                ...game().traits.renders([
                    () => {
                        noStroke()
                        fill(255)
                        rectMode(CENTER);

                        push()
                        translate(width / 2, width / 2)

                        rotate(game().state().tank.rot)
                        rect(0, 0, game().state().tank.w, game().state().tank.h)
                        fill(0)
                        rect(0, -50, 20, 10)
                        rect(-game().state().tank.w / 2 - 7, 0, 14, 80)
                        rect(game().state().tank.w / 2 + 7, 0, 14, 80)
                        pop()
                    },
                    () => {
                        push()
                        translate(width / 2, width / 2)
                        rotate(game().state().tank.turret.rot - 90)

                        fill(0)
                        ellipse(0, 0, 50, 50)
                        rect(0, -40, 10, 70)
                        pop()
                    }
                ]),
                w: 75,
                h: 100,
                rot: 0,
                drag: 0.1,
                speed: createVector(0, 2),
                turn_speed: 1.2,
                turret: {
                    rel_loc: createVector(0, 20),
                    rot: 0
                },
                applyForce: force => {
                    game().state().tank.acc.add(force)
                },
                turn: angle => {
                    game().state().tank.rot += angle
                },
                shoot: () => {}

            },

            state().projectiles = {
                arr: [],
                projectile: () => ({
                    ...game().traits.hasMovement(),
                    ...game().traits.hasPhysics([])
                })
            }

            state().barrel = {
                loc: createVector(100, 100),
                ...game().traits.renders([() => {
                    let rel_loc = p5.Vector.sub(game().state().barrel.loc, game().state().tank.loc)
                    ellipse(rel_loc.x, rel_loc.y, 50, 50)
                }])
            }

            console.log("%cState Initialized", "" +
                "color:pink;");
            resolve(state())
        })
    }
};

export const state = () => state_obj