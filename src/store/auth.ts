import * as api from '@/api'
import axios, { AxiosError } from 'axios'
import { Module } from 'vuex'

const auth: Module<any, any> = {
  namespaced: true,
  state: {
    status: '',
    account: null,
    loggedIn: false
  },
  mutations: {
    authRequest(state) {
      state.status = 'loading'
    },
    authSuccess(state, account) {
      state.status = 'success'
      state.account = account
      state.loggedIn = true
    },
    authUnauthorized(state) {
      state.status = 'unauthorized'
      state.loggedIn = false
    },
    authError(state) {
      state.status = 'error'
      state.loggedIn = false
    },
    logoutRequest(state) {
      state.status = 'loading'
      state.loggedIn = false
    },
    logoutSuccess(state) {
      state.status = 'success'
    },
    logoutError(state) {
      state.status = 'error'
    },
    formRequest(state) {
      state.status = 'loading'
    },
    formSuccess(state, account) {
      state.status = 'success'
      state.account = account
    },
    formError(state) {
      state.status = 'error'
    }
  },
  actions: {
    async authorize({ commit }) {
      commit('authRequest')
      try {
        const { data } = await api.getKayttaja()
        if (data.authorities.includes('ROLE_ERIKOISTUVA_LAAKARI')) {
          data.erikoistuvaLaakari = (await axios.get('erikoistuva-laakari')).data
        }
        commit('authSuccess', data)
      } catch (err) {
        if ((err as AxiosError<unknown>).response?.status === 401) {
          commit('authUnauthorized')
        } else {
          commit('authError')
        }
      }
    },
    async logout({ commit }) {
      commit('logoutRequest')
      try {
        await axios.post('logout', {})
        commit('logoutSuccess')
        window.location.href = `${window.location.origin}/`
      } catch (err) {
        commit('logoutError')
        window.location.reload()
      }
    },
    async putUser({ commit }, userDetails) {
      commit('formRequest')
      try {
        const { data } = await api.putKayttaja(userDetails)
        commit('formSuccess', data)
      } catch (err) {
        commit('formError')
        throw err
      }
    }
  },
  getters: {
    status: (state) => state.status,
    account: (state) => state.account,
    isLoggedIn: (state) => state.loggedIn
  }
}

export default auth
