const state = {
  isRacing: false
}

const mutations = {
  SET_IS_RACING(state, isRacing) {
    state.isRacing = isRacing
  }
}

const actions = {
  setRacingStatus({ commit }, isRacing) {
    commit('SET_IS_RACING', isRacing)
  }
}

const getters = {
  isGameRacing: state => state.isRacing
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}