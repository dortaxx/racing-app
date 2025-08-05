import { generateAllHorses } from '../utils.js'

const state = {
  horses: []
}

const mutations = {
  SET_HORSES(state, horses) {
    state.horses = horses
  }
}

const actions = {
  generateHorses({ commit }) {
    const horses = generateAllHorses()
    commit('SET_HORSES', horses)
  }
}

const getters = {
  allHorses: state => state.horses
}

export default {
  namespaced: false,
  state,
  mutations,
  actions,
  getters
}