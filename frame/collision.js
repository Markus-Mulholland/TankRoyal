import {getAbsoluteVec, v} from "./utils.js"

let collision_engine = {
    init() {
        return new Promise(async (resolve, reject) => {
            collision().colliders = []

            collision().bounding_collision_pairs = {
                "CIRC_RECT": circ_rec,
            }

            collision().registerCollider = (object, bounding, collision_callback) => {
                collision().colliders.push(collision().collider(object, bounding, collision_callback))
            }

            collision().collider = (object, bounding, collision_callback) => {
                return {
                    object: object,
                    bounding: bounding,
                    collision_callback: collision_callback
                }
            }

            collision().setCollisionObject = (collider) => {
                collision()[collider.bounding.toLowerCase()] = collider
            }

            collision().clearCollisionObjects = () => {
                collision().circ = undefined
                collision().rect = undefined
            }

            collision().run = () => {
                collision().colliders.forEach(a => {
                    collision().setCollisionObject(a)
                    collision().colliders.forEach(b => {
                        debugger
                        if (a !== b) {
                            collision().setCollisionObject(b)
                            let bounding_collision_pair = [a.bounding, b.bounding].sort().join("_")
                            let collision_algorithm = collision().bounding_collision_pairs[bounding_collision_pair]
                            if(collision_algorithm()){
                                a.collision_callback()
                                b.collision_callback()
                            }
                        }
                    })
                })
            }

            console.log("%cCollision Initialized", "" +
                "color:green; " +
                "font-weight: bold;");
            resolve(collision())
        })
    }
}

export const circ_rec = () => {
    let circ = collision().circ
    let rect = collision().rect
    // This gives us a vector from the center of rect to the center of circ
    let circ_rel_loc = p5.Vector.sub(circ.object.loc, rect.object.loc)

    // Rotate the vector retrieved above by the angular offset of the rect so that calculations below
    // can presume the rect is axis aligned
    let circ_axis_aligned_rel_loc = p5.Vector.rotate(circ_rel_loc, -rect.object.rot)

    // Get absolute distance measurements so that functionality below can work with one quadrant
    // of the rect
    circ_axis_aligned_rel_loc = getAbsoluteVec(circ_axis_aligned_rel_loc)

    // The below 2 if statements check is the circ is far enough on either axis that it can not
    // collide with the rect
    if(circ_axis_aligned_rel_loc.x > (rect.object.w/2+circ.object.r)) return false
    if(circ_axis_aligned_rel_loc.y > (rect.object.h/2+circ.object.r)) return false

    // Given the failure of the above 2 if statements, we expect the circ to be near the rect.
    // Check if the circ is close enough on either axis that it must collide
    if(circ_axis_aligned_rel_loc.x <= (rect.object.w/2)) return true
    if(circ_axis_aligned_rel_loc.y <= (rect.object.h/2)) return true

    // Handle the collision between the circ and the corner of the rect
    let val = p5.Vector.sub(v(rect.object.w/2, rect.object.h/2), circ_axis_aligned_rel_loc).mag()
    return  val <= circ.object.r

    // Reference: https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
}
// export const circ_rec = (c_loc, c_r, r_loc, r_w, r_h, r_rot = 0) => {
//     // This gives us a vector from the center of rect to the center of circ
//     let circ_rel_loc = p5.Vector.sub(c_loc, r_loc)
//
//     // Rotate the vector retrieved above by the angular offset of the rect so that calculations below
//     // can presume the rect is axis aligned
//     let circ_axis_aligned_rel_loc = p5.Vector.rotate(circ_rel_loc, -r_rot)
//
//     // Get absolute distance measurements so that functionality below can work with one quadrant
//     // of the rect
//     circ_axis_aligned_rel_loc = getAbsoluteVec(circ_axis_aligned_rel_loc)
//
//     // The below 2 if statements check is the circ is far enough on either axis that it can not
//     // collide with the rect
//     if(circ_axis_aligned_rel_loc.x > (r_w/2+c_r)) return false
//     if(circ_axis_aligned_rel_loc.y > (r_h/2+c_r)) return false
//
//     // Given the failure of the above 2 if statements, we expect the circ to be near the rect.
//     // Check if the circ is close enough on either axis that it must collide
//     if(circ_axis_aligned_rel_loc.x <= (r_w/2)) return true
//     if(circ_axis_aligned_rel_loc.y <= (r_h/2)) return true
//
//     // Handle the collision between the circ and the corner of the rect
//     let val = p5.Vector.sub(v(r_w/2, r_h/2), circ_axis_aligned_rel_loc).mag()
//     return  val <= c_r
//
//     // Reference: https://stackoverflow.com/questions/401847/circle-rectangle-collision-detection-intersection
// }

export const circ_polygon = (c_loc, c_r, r_a_loc, r_b_loc, r_c_loc, r_d_loc) => {
    // Check if the circ is within the polygon using: https://en.wikipedia.org/wiki/Point_in_polygon
    // Check if any of the polygon's vertices lie within the circ using: https://stackoverflow.com/questions/481144/equation-for-testing-if-a-point-is-inside-a-circle
}

export const collision = () => collision_engine