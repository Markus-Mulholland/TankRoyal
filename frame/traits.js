export const hasLocation = () => {
    return {
        loc: createVector(0, 0)
    }
}

export const hasMovement = () => {
    return {
        loc: createVector(0, 0),
        vel: createVector(0, 0),
        acc: createVector(0, 0),
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
