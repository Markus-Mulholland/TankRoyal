import {game} from "./game";

let keylogger_obj = {
    init() {
        return new Promise(async (resolve, reject) => {
            keylogger().accepted_keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

            keylogger().pressed_keys = []

            keylogger().bindings = {
                W_D: [],
                S_D: [],
                A_D: [],
                D_D: [],
                J_D: [],
                M__D: []
            }

            keylogger().run = () => {
                keylogger().pressed_keys.forEach(key => {
                    key += "_D"
                    if (keylogger().bindings[key]) {
                        keylogger().bindings[key].forEach(func => func())
                    }
                })
            }

            keylogger().keyPressed = key => {
                let upper_key = key.toUpperCase();
                if (!keylogger().pressed_keys.includes(upper_key) && keylogger().accepted_keys.includes(upper_key)) {
                    keylogger().pressed_keys.push(upper_key);
                }
            }

            keylogger().keyReleased = key => {
                let upper_key = key.toUpperCase();
                if (keylogger().pressed_keys.includes(upper_key)) {
                    let pressed_key_index = keylogger().pressed_keys.indexOf(upper_key);
                    keylogger().pressed_keys.splice(pressed_key_index, 1);
                }
            }

            keylogger().mousePressed = () => {
                let mouse_binding_key = "M_"
                if (!keylogger().pressed_keys.includes(mouse_binding_key))
                    keylogger().pressed_keys.push(mouse_binding_key);
            }

            keylogger().mouseReleased = () => {
                let mouse_binding_key = "M_"
                let mouse_binding_key_index = keylogger().pressed_keys.indexOf(mouse_binding_key);
                keylogger().pressed_keys.splice(mouse_binding_key_index, 1);
            }


            window.keyPressed = () => {
                game().keylogger().keyPressed(key)
            }

            window.keyReleased = () => {
                game().keylogger().keyReleased(key)
            }

            window.mousePressed = () => {
                game().keylogger().mousePressed()
            }

            window.mouseReleased = () => {
                game().keylogger().mouseReleased()
            }

            console.log("%cKeylogger Initialized", "" + "color:cyan; ");
            resolve(keylogger())
        })
    }
}

export const keylogger = () => keylogger_obj