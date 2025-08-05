import { createStore } from 'vuex'
import horses from './modules/horses.js'
import races from './modules/races.js'
import ui from './modules/ui.js'

export default createStore({
  modules: {
    horses,
    races,
    ui
  }
})