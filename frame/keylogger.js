import {frame_queue, registerRecurringJobs} from './frame_queue.js'

let keylogger_obj = {
    init() {
        return new Promise(async (resolve, reject) => {
            keylogger().pressed_keys = []

            keylogger().bindings = {
                W: frame_queue(),
                S: frame_queue(),
                A: frame_queue(),
                D: frame_queue(),
                M_U: frame_queue(),
                M_D: frame_queue()
            }

            keylogger().updated = key => {
                keylogger().bindings[key]?.run()
                // if (keylogger().bindings[key])
            }

            keylogger().keyPressed = key => {
                let upper_key = key.toUpperCase();
                if (!keylogger().pressed_keys.includes(upper_key) && (upper_key === "W" || upper_key === "S" || upper_key === "A" || upper_key === "D")) {
                    keylogger().pressed_keys.push(upper_key);
                }

                keylogger().updated(key)
            }

            keylogger().keyReleased = key => {
                let upper_key = key.toUpperCase();
                if (keylogger().pressed_keys.includes(upper_key)) {
                    let pressed_key_index = keylogger().pressed_keys.indexOf(upper_key);
                    keylogger().pressed_keys.splice(pressed_key_index, 1);
                }

                keylogger().updated(key)
            }

            window.keyPressed = () => {
                keylogger().keyPressed(key)
            }

            window.keyReleased = () => {
                keylogger().keyReleased(key)
            }

            window.mousePressed = () => {
                keylogger().mousePressed()
            }

            window.mouseReleased = () => {
                keylogger().mouseReleased()
            }

            console.log("%cKeylogger Initialized", "" + "color:cyan; ");
            resolve(keylogger())
        })
    }
}

export const keylogger = () => keylogger_obj