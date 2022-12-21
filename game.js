var game_obj = {
    init() {
        game().hasPhysics = function() {
            return {
                loc: createVector(0, 0),
                vel: createVector(0, 0),
                acc: createVector(0, 0)
            }
        }
        game().physics = {
            physics_job_buffer: [],
            constant_physics: [],
            physicsJob: job => ({job: job, run: false}),
            registerConstantPhysics: () => {
                game().physics.constant_physics = [
                    ...game().state.tank.constant_physics.map(physics => game().physics.physicsJob(physics)),
                ]
            },
            dispatchConstantPhysics: () => {
                game().physics.physics_job_buffer =
                    game().physics.physics_job_buffer.concat(game().physics.constant_physics)
            },
            dispatchPhysicsJob: (func, shift = false) => {
                let job = game().physics.physicsJob(func)

                if (shift) game().physics.physics_job_buffer.unshift(job)
                else game().physics.physics_job_buffer.push(job)
            },
            tick: () => {
                //debugger
                game().physics.dispatchConstantPhysics()
                game().physics.physics_job_buffer.forEach(job => {
                    job.job();
                    job.run = true
                })
                game().physics.physics_job_buffer =
                    game().physics.physics_job_buffer.filter(job => !job.run)
            }
        }
        game().keylogger = {
            pressed_keys: [],
            keyPressed: key => {
                let upper_key = key.toUpperCase();
                if (!game().keylogger.pressed_keys.includes(upper_key)
                    && (upper_key === "W" ||
                        upper_key === "S" ||
                        upper_key === "A" ||
                        upper_key === "D")) {
                    game().keylogger.pressed_keys.push(upper_key);
                }
            },
            keyReleased: key => {
                let upper_key = key.toUpperCase();
                if (game().keylogger.pressed_keys.includes(upper_key)) {
                    let pressed_key_index = game().keylogger.pressed_keys.indexOf(upper_key);
                    game().keylogger.pressed_keys.splice(pressed_key_index, 1);
                }
            }
        }
        // TODO: Game must be imported before state
        game().state = {
            tank: {
                ...game().hasPhysics(),
                w: 75,
                h: 100,
                rot: 0,
                drag: 0.1,
                speed: createVector(0, 2),
                turn_speed: 1.5,
                turret: {
                    rel_loc: createVector(0, 20),
                    rot: 0
                },
                constant_physics: [
                    () => { // Handle Movement Input
                        if (game().keylogger.pressed_keys.indexOf('W') > -1
                            && game().keylogger.pressed_keys.indexOf('S') < 0) {
                            game().state.tank.applyForce(p5.Vector.rotate(
                                p5.Vector.mult(game().state.tank.speed, -1),
                                game().state.tank.rot
                            ))
                        } else if (game().keylogger.pressed_keys.indexOf('S') > -1
                            && game().keylogger.pressed_keys.indexOf('W') < 0) {
                            game().state.tank.applyForce(p5.Vector.rotate(
                                game().state.tank.speed,
                                game().state.tank.rot)
                            )
                        }

                        if (game().keylogger.pressed_keys.indexOf('A') > -1
                            && game().keylogger.pressed_keys.indexOf('D') < 0) {
                            game().state.tank.turn(-game().state.tank.turn_speed)
                        } else if (game().keylogger.pressed_keys.indexOf('D') > -1
                            && game().keylogger.pressed_keys.indexOf('A') < 0) {
                            game().state.tank.turn(game().state.tank.turn_speed)
                        }
                    },
                    () => { // Move
                        game().state.tank.vel.add(game().state.tank.acc)
                        game().state.tank.loc.add(game().state.tank.vel)
                        game().state.tank.acc = createVector(0, 0)
                    },
                    () => { // Apply Drag to velocity
                        if (game().state.tank.vel.mag() > 0 && game().state.tank.vel.mag() < 0.1)
                            game().state.tank.vel.mult(0)
                        if (game().state.tank.vel.mag() === 0) return
                        game().state.tank.vel.mult(game().state.tank.drag)
                    },
                    () => { // Handle Turret Rotation
                        let mouse_loc = p5.Vector.sub(
                            createVector(0, 0),
                            createVector(mouseX - width / 2, mouseY - width / 2))
                        game().state.tank.turret.rot = mouse_loc.heading()
                    }
                ],
                render: () => {
                    noStroke()
                    fill(255)
                    rectMode(CENTER);

                    push()
                        translate(width / 2, width / 2)

                        rotate(game().state.tank.rot)
                        rect(0, 0, game().state.tank.w, game().state.tank.h)
                        fill(0)
                        rect(0, -50, 20, 10)
                        rect(-game().state.tank.w/2 - 7, 0, 14, 80)
                        rect(game().state.tank.w/2 + 7, 0, 14, 80)
                    pop()

                    push()
                        translate(width / 2, width / 2)
                        rotate(game().state.tank.turret.rot-90)

                        fill(0)
                        ellipse(0, 0, 50, 50)
                        rect(0, -40, 10, 70)
                    pop()
                },
                applyForce: (force) => {
                    game().state.tank.acc.add(force)
                },
                turn: angle => {
                    game().state.tank.rot += angle
                },
            },

            barrel: {
                loc: createVector(100, 100),
                render: () => {
                    let rel_loc = p5.Vector.sub(game().state.barrel.loc, game().state.tank.loc)
                    ellipse(rel_loc.x, rel_loc.y, 50, 50)
                }
            },

            barrelTwo: {
                loc: createVector(400, 200),
                rel_loc: createVector(0, 0),
                render: () => {
                    let rel_loc = p5.Vector.sub(game().state.barrelTwo.loc, game().state.tank.loc)
                    ellipse(rel_loc.x, rel_loc.y, 50, 50)
                }
            }
        }

        game().render = () => {
            background(220)
            fill(0)
            game().state.barrel.render()
            game().state.barrelTwo.render()
            game().state.tank.render()
        }
        game().tick = () => game().physics.tick()
        game().loop = () => {
            game().tick()
            game().render()
        }

        game().physics.registerConstantPhysics()
    }
}

export const game = () => game_obj