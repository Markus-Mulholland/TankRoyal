export const hasLocation = () => {
    return {
        loc: createVector(0, 0)
    }
}

export const hasMovement = (
    acc = createVector(0, 0),
    vel = createVector(0, 0),
    loc = createVector(0, 0)) => {
    return {
        loc: loc,
        vel: vel,
        acc: acc,
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
