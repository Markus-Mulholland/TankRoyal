export const getAbsoluteVec = (v) => {
    v.x = abs(v.x)
    v.y = abs(v.y)
    return v
}

export const v = (x, y) => createVector(x, y)