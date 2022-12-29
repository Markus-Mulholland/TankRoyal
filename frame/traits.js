export const hasLocation = (x, y) => {
    return {
        loc: createVector(x, y)
    }
}

export const hasMovement = (acc_x=0, acc_y=0, vel_x=0, vel_y=0, loc_x=0, loc_y=0) => {
    return {
        loc: createVector(loc_x, loc_y),
        vel: createVector(vel_x, vel_y),
        acc: createVector(acc_x, acc_y),
    }
}

export const hasPhysics = (physics_jobs = []) => {
    return {
        recurring_physics: physics_jobs,
    }
}

export const renders = (render_jobs = []) => {
    return {
        recurring_rendering: render_jobs,
    }
}

export const hasKeyBindings = (bindings = {}) => {
    return {
        bindings: bindings,
    }
}
