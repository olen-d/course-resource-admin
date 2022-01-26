import { createStore } from 'vuex'

export default createStore({
  state: {
    accessPublicKey: '',
    accessToken: '',
    refreshToken: ''
  },
  mutations: {
    changeAccessPublicKey (state, accessPublicKey) {
      state.accessPublicKey = accessPublicKey
    },
    changeAccessToken (state, accessToken) {
      state.accessToken = accessToken
    },
    changeRefreshToken (state, refreshToken) {
      state.refreshToken = refreshToken
    }
  },
  actions: {
  },
  getters: {
    accessPublicKey: state => state.accessPublicKey,
    accessToken: state => state.accessToken,
    refreshToken: state => state.refreshToken
  },
  modules: {
  }
})
