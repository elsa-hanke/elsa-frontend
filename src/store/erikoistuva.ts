import { Module } from 'vuex'
import * as api from '@/api/erikoistuva'

const erikoistuva: Module<any, any> = {
  namespaced: true,
  state: {
    status: '',
    koejakso: null,
    kouluttajat: null
  },
  mutations: {
    koejaksoRequest(state) {
      state.status = 'loading'
    },
    koejaksoSuccess(state, koejakso) {
      state.status = 'success'
      state.koejakso = koejakso
    },
    koejaksoError(state) {
      state.status = 'error'
    },
    formRequest(state) {
      state.status = 'loading'
    },
    formSuccess(state) {
      state.status = 'success'
    },
    formError(state) {
      state.status = 'error'
    },
    kouluttajatRequest(state) {
      state.status = 'loading'
    },
    kouluttajatSuccess(state, kouluttajat) {
      state.status = 'success'
      state.kouluttajat = kouluttajat
    },
    kouluttajatError(state) {
      state.status = 'error'
    }
  },
  actions: {
    async getKoejakso({ commit }) {
      commit('koejaksoRequest')
      try {
        const { data } = await api.getKoejakso()
        commit('koejaksoSuccess', data)
      } catch (err) {
        commit('koejaksoError')
      }
    },
    async postKoulutussopimus({ dispatch, commit }, koulutussopimusLomake) {
      commit('formRequest')
      return new Promise((resolve, reject) => {
        api
          .postKoulutussopimus(koulutussopimusLomake)
          .then((response) => {
            commit('formSuccess')
            dispatch('getKoejakso')
            resolve(response)
          })
          .catch((error) => {
            commit('formError')
            reject(error)
          })
      })
    },
    async putKoulutussopimus({ dispatch, commit }, koulutussopimusLomake) {
      commit('formRequest')
      return new Promise((resolve, reject) => {
        api
          .putKoulutussopimus(koulutussopimusLomake)
          .then((response) => {
            commit('formSuccess')
            dispatch('getKoejakso')
            resolve(response)
          })
          .catch((error) => {
            commit('formError')
            reject(error)
          })
      })
    },
    postAloituskeskustelu({ dispatch, commit }, aloituskeskusteluLomake) {
      commit('formRequest')
      return new Promise((resolve, reject) => {
        api
          .postAloituskeskustelu(aloituskeskusteluLomake)
          .then((response) => {
            commit('formSuccess')
            dispatch('getKoejakso')
            resolve(response)
          })
          .catch((error) => {
            commit('formError')
            reject(error)
          })
      })
    },
    async putAloituskeskustelu({ dispatch, commit }, aloituskeskusteluLomake) {
      commit('formRequest')
      return new Promise((resolve, reject) => {
        api
          .putAloituskeskustelu(aloituskeskusteluLomake)
          .then((response) => {
            commit('formSuccess')
            dispatch('getKoejakso')
            resolve(response)
          })
          .catch((error) => {
            commit('formError')
            reject(error)
          })
      })
    },
    postValiarviointi({ dispatch, commit }, valiarviointiLomake) {
      commit('formRequest')
      return new Promise((resolve, reject) => {
        api
          .postValiarviointi(valiarviointiLomake)
          .then((response) => {
            commit('formSuccess')
            dispatch('getKoejakso')
            resolve(response)
          })
          .catch((error) => {
            commit('formError')
            reject(error)
          })
      })
    },
    async putValiarviointi({ dispatch, commit }, valiarviointiLomake) {
      commit('formRequest')
      return new Promise((resolve, reject) => {
        api
          .putValiarviointi(valiarviointiLomake)
          .then((response) => {
            commit('formSuccess')
            dispatch('getKoejakso')
            resolve(response)
          })
          .catch((error) => {
            commit('formError')
            reject(error)
          })
      })
    },
    async getKouluttajat({ commit }) {
      commit('kouluttajatRequest')
      try {
        const { data } = await api.getKouluttajat()
        commit('kouluttajatSuccess', data)
      } catch (err) {
        commit('kouluttajatError')
      }
    }
  },
  getters: {
    status: (state) => state.status,
    koejakso: (state) => state.koejakso,
    kouluttajat: (state) => state.kouluttajat
  }
}

export default erikoistuva
