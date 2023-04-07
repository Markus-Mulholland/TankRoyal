import {state} from '../state.js'
import {frame_queue, registerRecurringJobs} from './frame_queue.js'
import {keylogger} from './keylogger.js'
import * as traits from './traits.js'
import {collision} from "./collision.js";

let game_obj = {
    async bootstrap() {
        game().physics = frame_queue()
        game().renderer = frame_queue()
        game().traits = traits
        game().collision = () => collision()
        game().keylogger = () => keylogger()
        game().state = () => state()

        console.log("%cGame Bootstrapped", "" +
            "color:white; " +
            "font-weight: bold;");
    },
    async init() {
        await game().bootstrap()
        await game().state().init()
        await game().collision().init()
        await game().keylogger().init()
        console.log(game().state())

        game().loop = () => {
            game().keylogger().run()
            game().physics.run()
            game().renderer.run()
            game().collision().run()
        }

        game().registerRecurringPhysics = phys => {
            registerRecurringJobs(game().physics, [
                ...phys
            ])
        }

        game().registerRecurringRendering = rend => {
            registerRecurringJobs(game().renderer, [
                ...rend
            ])
        }

        game().registerKeyBindings = bindings => {
            for (const key in bindings) {
                game().keylogger().bindings[key] =
                    game().keylogger().bindings[key].concat(bindings[key])
            }
        }

        console.log("%cGame Initialized", "" +
            "color:white; " +
            "font-weight: bold;");
    }
}

export const game = () => game_obj