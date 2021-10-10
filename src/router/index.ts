import Vue from 'vue'
import Meta from 'vue-meta'
import VueRouter, { NavigationGuardNext, Route, RouteConfig } from 'vue-router'

import RoleSpecificRoute from '@/router/role-specific-route.vue'
import store from '@/store'
import { restoreRoute, storeRoute } from '@/utils/local-storage'
import { ELSA_ROLE } from '@/utils/roles'
import PageNotFound from '@/views/404/page-not-found.vue'
import Arvioinnit from '@/views/arvioinnit/arvioinnit.vue'
import Arviointi from '@/views/arvioinnit/arviointi.vue'
import ArviointipyyntoLahetetty from '@/views/arvioinnit/arviointipyynto-lahetetty.vue'
import Arviointipyynto from '@/views/arvioinnit/arviointipyynto.vue'
import ItsearviointiValmis from '@/views/arvioinnit/itsearviointi-valmis.vue'
import Itsearviointi from '@/views/arvioinnit/itsearviointi.vue'
import MuokkaaArviointia from '@/views/arvioinnit/muokkaa-arviointia.vue'
import Asiakirjat from '@/views/asiakirjat/asiakirjat.vue'
import Etusivu from '@/views/etusivu.vue'
import ErikoistuvaArviointilomakeAloituskeskustelu from '@/views/koejakso/erikoistuva/arviointilomake-aloituskeskustelu/arviointilomake-aloituskeskustelu.vue'
import ErikoistuvaArviointilomakeKehittamistoimenpiteet from '@/views/koejakso/erikoistuva/arviointilomake-kehittamistoimenpiteet/arviointilomake-kehittamistoimenpiteet.vue'
import ErikoistuvaArviointilomakeLoppukeskustelu from '@/views/koejakso/erikoistuva/arviointilomake-loppukeskustelu/arviointilomake-loppukeskustelu.vue'
import ErikoistuvaArviointilomakeValiarviointi from '@/views/koejakso/erikoistuva/arviointilomake-valiarviointi/arviointilomake-valiarviointi.vue'
import ErikoistuvaArviointilomakeVastuuhenkilonArvio from '@/views/koejakso/erikoistuva/arviointilomake-vastuuhenkilon-arvio/arviointilomake-vastuuhenkilon-arvio.vue'
import KoejaksoTavoitteet from '@/views/koejakso/erikoistuva/koejakso-tavoitteet.vue'
import ErikoistuvaKoulutussopimus from '@/views/koejakso/erikoistuva/koulutussopimus/koulutussopimus.vue'
import Koejakso from '@/views/koejakso/index.vue'
import KoejaksoContainer from '@/views/koejakso/koejakso-container.vue'
import Koulutussopimus from '@/views/koejakso/kouluttaja-vastuuhenkilo/koulutussopimus.vue'
import KouluttajaArviointilomakeAloituskeskustelu from '@/views/koejakso/kouluttaja/arviointilomake-aloituskeskustelu/kouluttaja-arviointilomake-aloituskeskustelu.vue'
import KouluttajaArviointilomakeKehittamistoimenpiteet from '@/views/koejakso/kouluttaja/arviointilomake-kehittamistoimenpiteet/kouluttaja-arviointilomake-kehittamistoimenpiteet.vue'
import KouluttajaArviointilomakeLoppukeskustelu from '@/views/koejakso/kouluttaja/arviointilomake-loppukeskustelu/kouluttaja-arviointilomake-loppukeskustelu.vue'
import KouluttajaArviointilomakeValiarviointi from '@/views/koejakso/kouluttaja/arviointilomake-valiarviointi/kouluttaja-arviointilomake-valiarviointi.vue'
import VastuuhenkilonArvioVastuuhenkilo from '@/views/koejakso/vastuuhenkilo/vastuuhenkilon-arvio-vastuuhenkilo.vue'
import Koulutukset from '@/views/koulutukset.vue'
import Koulutussuunnitelma from '@/views/koulutussuunnitelma/koulutussuunnitelma.vue'
import MuokkaaKoulutussuunnitelma from '@/views/koulutussuunnitelma/muokkaa-koulutussuunnitelma.vue'
import Kayttooikeus from '@/views/login/kayttooikeus.vue'
import LoginView from '@/views/login/login-view.vue'
import Login from '@/views/login/login.vue'
import MuokkaaPoissaoloa from '@/views/poissaolot/muokkaa-poissaoloa.vue'
import Poissaolo from '@/views/poissaolot/poissaolo.vue'
import UusiPoissaolo from '@/views/poissaolot/uusi-poissaolo.vue'
import Profiili from '@/views/profiili/profiili.vue'
import Root from '@/views/root.vue'
import MuokkaaSuoritemerkintaa from '@/views/suoritemerkinnat/muokkaa-suoritemerkintaa.vue'
import Suoritemerkinnat from '@/views/suoritemerkinnat/suoritemerkinnat.vue'
import Suoritemerkinta from '@/views/suoritemerkinnat/suoritemerkinta.vue'
import UusiSuoritemerkinta from '@/views/suoritemerkinnat/uusi-suoritemerkinta.vue'
import MuokkaaTyoskentelyjaksoa from '@/views/tyoskentelyjaksot/muokkaa-tyoskentelyjaksoa.vue'
import Tyoskentelyjakso from '@/views/tyoskentelyjaksot/tyoskentelyjakso.vue'
import Tyoskentelyjaksot from '@/views/tyoskentelyjaksot/tyoskentelyjaksot.vue'
import UusiTyoskentelyjakso from '@/views/tyoskentelyjaksot/uusi-tyoskentelyjakso.vue'
import Viestit from '@/views/viestit.vue'

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
    next('/kirjautuminen')
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
        component: RoleSpecificRoute,
        props: {
          routeComponent: Koulutussuunnitelma,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/koulutussuunnitelma/muokkaus',
        name: 'muokkaa-koulutussuunnitelma',
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaKoulutussuunnitelma,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/suoritemerkinnat',
        name: 'suoritemerkinnat',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Suoritemerkinnat,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/suoritemerkinnat/uusi',
        name: 'uusi-suoritemerkinta',
        component: RoleSpecificRoute,
        props: {
          routeComponent: UusiSuoritemerkinta,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/suoritemerkinnat/:suoritemerkintaId/muokkaus',
        name: 'muokkaa-suoritemerkintaa',
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaSuoritemerkintaa,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/suoritemerkinnat/:suoritemerkintaId',
        name: 'suoritemerkinta',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Suoritemerkinta,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/arvioinnit',
        name: 'arvioinnit',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Arvioinnit,
          allowedRoles: [
            ELSA_ROLE.ErikoistuvaLaakari,
            ELSA_ROLE.Kouluttaja,
            ELSA_ROLE.Vastuuhenkilo
          ]
        }
      },
      {
        path: '/arvioinnit/arviointipyynto',
        name: 'arviointipyynto',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Arviointipyynto,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/arvioinnit/arviointipyynto/:arviointiId',
        name: 'arviointipyynto-muokkaus',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Arviointipyynto,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/arvioinnit/arviointipyynto-lahetetty',
        name: 'arviointipyynto-lahetetty',
        component: RoleSpecificRoute,
        props: {
          routeComponent: ArviointipyyntoLahetetty,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/arvioinnit/:arviointiId/itsearviointi',
        name: 'itsearviointi',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Itsearviointi,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/arvioinnit/itsearviointi-valmis',
        name: 'itsearviointi-valmis',
        component: RoleSpecificRoute,
        props: {
          routeComponent: ItsearviointiValmis,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/arvioinnit/:arviointiId',
        name: 'arviointi',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Arviointi,
          allowedRoles: [
            ELSA_ROLE.ErikoistuvaLaakari,
            ELSA_ROLE.Kouluttaja,
            ELSA_ROLE.Vastuuhenkilo
          ]
        }
      },
      {
        path: '/arvioinnit/:arviointiId/muokkaa',
        name: 'muokkaa-arviointia',
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaArviointia,
          allowedRoles: [ELSA_ROLE.Kouluttaja, ELSA_ROLE.Vastuuhenkilo],
          confirmRouteExit: true
        }
      },
      {
        path: '/tyoskentelyjaksot',
        name: 'tyoskentelyjaksot',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Tyoskentelyjaksot,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/tyoskentelyjaksot/uusi',
        name: 'uusi-tyoskentelyjakso',
        component: RoleSpecificRoute,
        props: {
          routeComponent: UusiTyoskentelyjakso,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/tyoskentelyjaksot/:tyoskentelyjaksoId',
        name: 'tyoskentelyjakso',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Tyoskentelyjakso,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/tyoskentelyjaksot/:tyoskentelyjaksoId/muokkaus',
        name: 'muokkaa-tyoskentelyjaksoa',
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaTyoskentelyjaksoa,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/tyoskentelyjaksot/poissaolot/uusi',
        name: 'uusi-poissaolo',
        component: RoleSpecificRoute,
        props: {
          routeComponent: UusiPoissaolo,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/tyoskentelyjaksot/poissaolot/:poissaoloId',
        name: 'poissaolo',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Poissaolo,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/tyoskentelyjaksot/poissaolot/:poissaoloId/muokkaus',
        name: 'muokkaa-poissaoloa',
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaPoissaoloa,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/koulutukset',
        name: 'koulutukset',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Koulutukset,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/viestit',
        name: 'viestit',
        component: Viestit
      },
      {
        path: '/asiakirjat',
        name: 'asiakirjat',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Asiakirjat,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/koejakso',
        component: Koejakso,
        children: [
          {
            path: '',
            name: 'koejakso',
            component: RoleSpecificRoute,
            props: {
              routeComponent: KoejaksoContainer,
              allowedRoles: [
                ELSA_ROLE.ErikoistuvaLaakari,
                ELSA_ROLE.Kouluttaja,
                ELSA_ROLE.Vastuuhenkilo
              ]
            }
          },
          {
            path: 'koejakso-yleiset-tavoitteet',
            name: 'koejakso-yleiset-tavoitteet',
            component: RoleSpecificRoute,
            props: {
              routeComponent: KoejaksoTavoitteet,
              allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
            }
          },
          {
            path: 'koulutussopimus',
            name: 'koulutussopimus-erikoistuva',
            component: RoleSpecificRoute,
            props: {
              routeComponent: ErikoistuvaKoulutussopimus,
              allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
              confirmRouteExit: true
            }
          },
          {
            path: 'aloituskeskustelu',
            name: 'koejakson-aloituskeskustelu',
            component: RoleSpecificRoute,
            props: {
              routeComponent: ErikoistuvaArviointilomakeAloituskeskustelu,
              allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
              confirmRouteExit: true
            }
          },
          {
            path: 'valiarviointi',
            name: 'koejakson-valiarviointi',
            component: RoleSpecificRoute,
            props: {
              routeComponent: ErikoistuvaArviointilomakeValiarviointi,
              allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
            }
          },
          {
            path: 'kehittamistoimenpiteet',
            name: 'koejakson-kehittamistoimenpiteet',
            component: RoleSpecificRoute,
            props: {
              routeComponent: ErikoistuvaArviointilomakeKehittamistoimenpiteet,
              allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
            }
          },
          {
            path: 'loppukeskustelu',
            name: 'koejakson-loppukeskustelu',
            component: RoleSpecificRoute,
            props: {
              routeComponent: ErikoistuvaArviointilomakeLoppukeskustelu,
              allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
            }
          },
          {
            path: 'vastuuhenkilon-arvio',
            name: 'koejakson-vastuuhenkilon-arvio',
            component: RoleSpecificRoute,
            props: {
              routeComponent: ErikoistuvaArviointilomakeVastuuhenkilonArvio,
              allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
            }
          },
          {
            path: 'koulutussopimus/:id',
            name: 'koulutussopimus',
            component: RoleSpecificRoute,
            props: {
              routeComponent: Koulutussopimus,
              allowedRoles: [ELSA_ROLE.Kouluttaja, ELSA_ROLE.Vastuuhenkilo],
              confirmRouteExit: true
            }
          },
          {
            path: 'aloituskeskustelu/:id',
            name: 'aloituskeskustelu-kouluttaja',
            component: RoleSpecificRoute,
            props: {
              routeComponent: KouluttajaArviointilomakeAloituskeskustelu,
              allowedRoles: [ELSA_ROLE.Kouluttaja],
              confirmRouteExit: true
            }
          },
          {
            path: 'valiarviointi/:id',
            name: 'valiarviointi-kouluttaja',
            component: RoleSpecificRoute,
            props: {
              routeComponent: KouluttajaArviointilomakeValiarviointi,
              allowedRoles: [ELSA_ROLE.Kouluttaja]
            }
          },
          {
            path: 'kehittamistoimenpiteet/:id',
            name: 'kehittamistoimenpiteet-kouluttaja',
            component: RoleSpecificRoute,
            props: {
              routeComponent: KouluttajaArviointilomakeKehittamistoimenpiteet,
              allowedRoles: [ELSA_ROLE.Kouluttaja]
            }
          },
          {
            path: 'loppukeskustelu/:id',
            name: 'loppukeskustelu-kouluttaja',
            component: RoleSpecificRoute,
            props: {
              routeComponent: KouluttajaArviointilomakeLoppukeskustelu,
              allowedRoles: [ELSA_ROLE.Kouluttaja]
            }
          },
          {
            path: 'vastuuhenkilon-arvio/:id',
            name: 'vastuuhenkilon-arvio-vastuuhenkilo',
            component: RoleSpecificRoute,
            props: {
              routeComponent: VastuuhenkilonArvioVastuuhenkilo,
              allowedRoles: [ELSA_ROLE.Vastuuhenkilo]
            }
          }
        ]
      },
      {
        path: '/profiili',
        name: 'profiili',
        component: Profiili
      }
    ]
  },
  {
    path: '/kirjautuminen',
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
            next('/kirjautuminen')
          }
        }
      }
    ]
  },
  {
    path: 'sivua-ei-loytynyt',
    alias: '*',
    component: PageNotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
