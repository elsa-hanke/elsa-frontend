import Vue from 'vue'
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from 'vue-router'
import Meta from 'vue-meta'

import LoginView from '@/views/login/login-view.vue'
import Login from '@/views/login/login.vue'
import Kayttooikeus from '@/views/login/kayttooikeus.vue'
import Arvioinnit from '../views/arvioinnit/arvioinnit.vue'
import Arviointi from '../views/arvioinnit/arviointi.vue'
import Arviointipyynto from '../views/arvioinnit/arviointipyynto.vue'
import ArviointipyyntoLahetetty from '../views/arvioinnit/arviointipyynto-lahetetty.vue'
import Asiakirjat from '../views/asiakirjat/asiakirjat.vue'
import Etusivu from '../views/etusivu.vue'
import Itsearviointi from '../views/arvioinnit/itsearviointi.vue'
import ItsearviointiValmis from '../views/arvioinnit/itsearviointi-valmis.vue'
import Koulutukset from '../views/koulutukset.vue'
import Koulutussuunnitelma from '../views/koulutussuunnitelma.vue'
import MuokkaaArviointia from '../views/arvioinnit/muokkaa-arviointia.vue'
import MuokkaaPoissaoloa from '../views/poissaolot/muokkaa-poissaoloa.vue'
import MuokkaaSuoritemerkintaa from '../views/suoritemerkinnat/muokkaa-suoritemerkintaa.vue'
import MuokkaaTyoskentelyjaksoa from '../views/tyoskentelyjaksot/muokkaa-tyoskentelyjaksoa.vue'
import PageNotFound from '../views/page-not-found.vue'
import Poissaolo from '../views/poissaolot/poissaolo.vue'
import Root from '../views/root.vue'
import Suoritemerkinnat from '../views/suoritemerkinnat/suoritemerkinnat.vue'
import Suoritemerkinta from '../views/suoritemerkinnat/suoritemerkinta.vue'
import Tyoskentelyjakso from '../views/tyoskentelyjaksot/tyoskentelyjakso.vue'
import Tyoskentelyjaksot from '../views/tyoskentelyjaksot/tyoskentelyjaksot.vue'
import UusiPoissaolo from '../views/poissaolot/uusi-poissaolo.vue'
import UusiSuoritemerkinta from '../views/suoritemerkinnat/uusi-suoritemerkinta.vue'
import UusiTyoskentelyjakso from '../views/tyoskentelyjaksot/uusi-tyoskentelyjakso.vue'
import Viestit from '../views/viestit.vue'
import Koejakso from '../views/koejakso/index.vue'
import KoejaksoContainer from '@/views/koejakso/koejakso-container.vue'
import KoejaksoTavoitteet from '../views/koejakso/erikoistuva/koejakso-tavoitteet.vue'
import ErikoistuvaKoulutussopimus from '../views/koejakso/erikoistuva/koulutussopimus/koulutussopimus.vue'
import ErikoistuvaArviointilomakeAloituskeskustelu from '@/views/koejakso/erikoistuva/arviointilomake-aloituskeskustelu/arviointilomake-aloituskeskustelu.vue'
import Koulutussopimus from '../views/koejakso/kouluttaja-vastuuhenkilo/koulutussopimus.vue'
import KouluttajaArviointilomakeAloituskeskustelu from '@/views/koejakso/kouluttaja/arviointilomake-aloituskeskustelu/kouluttaja-arviointilomake-aloituskeskustelu.vue'
import KouluttajaArviointilomakeValiarviointi from '@/views/koejakso/kouluttaja/arviointilomake-valiarviointi/kouluttaja-arviointilomake-valiarviointi.vue'
import KouluttajaArviointilomakeKehittamistoimenpiteet from '@/views/koejakso/kouluttaja/arviointilomake-kehittamistoimenpiteet/kouluttaja-arviointilomake-kehittamistoimenpiteet.vue'
import ErikoistuvaArviointilomakeValiarviointi from '@/views/koejakso/erikoistuva/arviointilomake-valiarviointi/arviointilomake-valiarviointi.vue'
import ErikoistuvaArviointilomakeKehittamistoimenpiteet from '@/views/koejakso/erikoistuva/arviointilomake-kehittamistoimenpiteet/arviointilomake-kehittamistoimenpiteet.vue'
import ErikoistuvaArviointilomakeLoppukeskustelu from '@/views/koejakso/erikoistuva/arviointilomake-loppukeskustelu/arviointilomake-loppukeskustelu.vue'
import KouluttajaArviointilomakeLoppukeskustelu from '@/views/koejakso/kouluttaja/arviointilomake-loppukeskustelu/kouluttaja-arviointilomake-loppukeskustelu.vue'
import store from '@/store'
import { restoreRoute, storeRoute } from '@/utils/local-storage'

Vue.use(VueRouter)
Vue.use(Meta)

const guard = async (to: Route, from: Route, next: NavigationGuardNext) => {
  await store.dispatch('auth/authorize')

  if (store.getters['auth/isLoggedIn']) {
    // Ohjataan rooliton käyttäjä roolien lisäämisen näkymään kirjautumisen jälkeen
    if (store.getters['auth/account'].authorities.length === 0 && to.name !== 'kayttooikeus') {
      next({
        name: 'kayttooikeus',
        replace: true
      })
    } else {
      restoreRoute(next)
    }
  } else {
    storeRoute(to)
    next('/login')
  }
}

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'root',
    component: Root,
    beforeEnter: guard,
    redirect: {
      name: 'etusivu'
    },
    children: [
      {
        path: '/etusivu',
        name: 'etusivu',
        meta: {
          grayBackdrop: true
        },
        component: Etusivu
      },
      {
        path: '/koulutussuunnitelma',
        name: 'koulutussuunnitelma',
        component: Koulutussuunnitelma
      },
      {
        path: '/suoritemerkinnat',
        name: 'suoritemerkinnat',
        component: Suoritemerkinnat
      },
      {
        path: '/suoritemerkinnat/uusi',
        name: 'uusi-suoritemerkinta',
        component: UusiSuoritemerkinta
      },
      {
        path: '/suoritemerkinnat/:suoritemerkintaId/muokkaus',
        name: 'muokkaa-suoritemerkintaa',
        component: MuokkaaSuoritemerkintaa
      },
      {
        path: '/suoritemerkinnat/:suoritemerkintaId',
        name: 'suoritemerkinta',
        component: Suoritemerkinta
      },
      {
        path: '/arvioinnit',
        name: 'arvioinnit',
        component: Arvioinnit
      },
      {
        path: '/arvioinnit/arviointipyynto',
        name: 'arviointipyynto',
        component: Arviointipyynto
      },
      {
        path: '/arvioinnit/arviointipyynto/:arviointiId',
        name: 'arviointipyynto-muokkaus',
        component: Arviointipyynto
      },
      {
        path: '/arvioinnit/arviointipyynto-lahetetty',
        name: 'arviointipyynto-lahetetty',
        component: ArviointipyyntoLahetetty
      },
      {
        path: '/arvioinnit/:arviointiId/itsearviointi',
        name: 'itsearviointi',
        component: Itsearviointi
      },
      {
        path: '/arvioinnit/itsearviointi-valmis',
        name: 'itsearviointi-valmis',
        component: ItsearviointiValmis
      },
      {
        path: '/arvioinnit/:arviointiId',
        name: 'arviointi',
        component: Arviointi
      },
      {
        path: '/arvioinnit/:arviointiId/muokkaa',
        name: 'muokkaa-arviointia',
        component: MuokkaaArviointia
      },
      {
        path: '/tyoskentelyjaksot',
        name: 'tyoskentelyjaksot',
        component: Tyoskentelyjaksot
      },
      {
        path: '/tyoskentelyjaksot/uusi',
        name: 'uusi-tyoskentelyjakso',
        component: UusiTyoskentelyjakso
      },
      {
        path: '/tyoskentelyjaksot/:tyoskentelyjaksoId',
        name: 'tyoskentelyjakso',
        component: Tyoskentelyjakso
      },
      {
        path: '/tyoskentelyjaksot/:tyoskentelyjaksoId/muokkaus',
        name: 'muokkaa-tyoskentelyjaksoa',
        component: MuokkaaTyoskentelyjaksoa
      },
      {
        path: '/tyoskentelyjaksot/poissaolot/uusi',
        name: 'uusi-poissaolo',
        component: UusiPoissaolo
      },
      {
        path: '/tyoskentelyjaksot/poissaolot/:poissaoloId',
        name: 'poissaolo',
        component: Poissaolo
      },
      {
        path: '/tyoskentelyjaksot/poissaolot/:poissaoloId/muokkaus',
        name: 'muokkaa-poissaoloa',
        component: MuokkaaPoissaoloa
      },
      {
        path: '/koulutukset',
        name: 'koulutukset',
        component: Koulutukset
      },
      {
        path: '/viestit',
        name: 'viestit',
        component: Viestit
      },
      {
        path: '/asiakirjat',
        name: 'asiakirjat',
        component: Asiakirjat
      },
      {
        path: '/koejakso',
        component: Koejakso,
        children: [
          {
            path: '',
            name: 'koejakso',
            component: KoejaksoContainer
          },
          {
            path: 'koejakso-yleiset-tavoitteet',
            name: 'koejakso-yleiset-tavoitteet',
            component: KoejaksoTavoitteet,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isErikoistuva()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'koulutussopimus',
            name: 'koulutussopimus-erikoistuva',
            component: ErikoistuvaKoulutussopimus,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isErikoistuva()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'aloituskeskustelu',
            name: 'koejakson-aloituskeskustelu',
            component: ErikoistuvaArviointilomakeAloituskeskustelu,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isErikoistuva()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'valiarviointi',
            name: 'koejakson-valiarviointi',
            component: ErikoistuvaArviointilomakeValiarviointi,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isErikoistuva()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'kehittamistoimenpiteet',
            name: 'koejakson-kehittamistoimenpiteet',
            component: ErikoistuvaArviointilomakeKehittamistoimenpiteet,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isErikoistuva()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'loppukeskustelu',
            name: 'koejakson-loppukeskustelu',
            component: ErikoistuvaArviointilomakeLoppukeskustelu,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isErikoistuva()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'koulutussopimus/:id',
            name: 'koulutussopimus',
            component: Koulutussopimus,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isKouluttaja() || Vue.prototype.$isVastuuhenkilo()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'aloituskeskustelu/:id',
            name: 'aloituskeskustelu-kouluttaja',
            component: KouluttajaArviointilomakeAloituskeskustelu,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isKouluttaja()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'valiarviointi/:id',
            name: 'valiarviointi-kouluttaja',
            component: KouluttajaArviointilomakeValiarviointi,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isKouluttaja()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'kehittamistoimenpiteet/:id',
            name: 'kehittamistoimenpiteet-kouluttaja',
            component: KouluttajaArviointilomakeKehittamistoimenpiteet,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isKouluttaja()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          },
          {
            path: 'loppukeskustelu/:id',
            name: 'loppukeskustelu-kouluttaja',
            component: KouluttajaArviointilomakeLoppukeskustelu,
            beforeEnter: (to, from, next) => {
              if (Vue.prototype.$isKouluttaja()) {
                next()
              } else {
                next(from.fullPath)
              }
            }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: LoginView,
    children: [
      {
        path: '',
        name: 'login',
        component: Login,
        beforeEnter: async (to, from, next) => {
          await store.dispatch('auth/authorize')

          if (store.getters['auth/isLoggedIn']) {
            // Ohjataan rooliton käyttäjä roolien lisäämisen näkymään kirjautumisen jälkeen
            if (
              store.getters['auth/account'].authorities.length === 0 &&
              to.name !== 'kayttooikeus'
            ) {
              next({
                name: 'kayttooikeus',
                replace: true
              })
            } else {
              next('/etusivu')
            }
          } else {
            next()
          }
        }
      },
      {
        path: '/kayttooikeus',
        name: 'kayttooikeus',
        component: Kayttooikeus,
        beforeEnter: async (to, from, next) => {
          await store.dispatch('auth/authorize')

          if (store.getters['auth/isLoggedIn']) {
            if (store.getters['auth/account'].authorities.length > 0) {
              next('/etusivu')
            } else {
              next()
            }
          } else {
            next('/login')
          }
        }
      }
    ]
  },
  {
    path: '*',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
