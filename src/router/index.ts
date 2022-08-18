import Vue from 'vue'
import Meta from 'vue-meta'
import VueRouter, { NavigationGuardNext, RawLocation, Route, RouteConfig } from 'vue-router'
import { ErrorHandler } from 'vue-router/types/router'

import VueI18n from '@/plugins/i18n'
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
import Etusivu from '@/views/etusivu/etusivu.vue'
import KaytonAloitus from '@/views/kayton-aloitus/kayton-aloitus.vue'
import ErikoistuvaLaakari from '@/views/kayttajahallinta/erikoistuva-laakari.vue'
import Kayttajahallinta from '@/views/kayttajahallinta/kayttajahallinta.vue'
import Kouluttaja from '@/views/kayttajahallinta/kouluttaja.vue'
import Paakayttaja from '@/views/kayttajahallinta/paakayttaja.vue'
import UusiKayttaja from '@/views/kayttajahallinta/uusi-kayttaja.vue'
import Vastuuhenkilo from '@/views/kayttajahallinta/vastuuhenkilo.vue'
import Virkailija from '@/views/kayttajahallinta/virkailija.vue'
import ErikoistuvaArviointilomakeAloituskeskustelu from '@/views/koejakso/erikoistuva/arviointilomake-aloituskeskustelu/erikoistuva-arviointilomake-aloituskeskustelu.vue'
import ErikoistuvaArviointilomakeKehittamistoimenpiteet from '@/views/koejakso/erikoistuva/arviointilomake-kehittamistoimenpiteet/erikoistuva-arviointilomake-kehittamistoimenpiteet.vue'
import ErikoistuvaArviointilomakeLoppukeskustelu from '@/views/koejakso/erikoistuva/arviointilomake-loppukeskustelu/erikoistuva-arviointilomake-loppukeskustelu.vue'
import ErikoistuvaArviointilomakeValiarviointi from '@/views/koejakso/erikoistuva/arviointilomake-valiarviointi/erikoistuva-arviointilomake-valiarviointi.vue'
import ErikoistuvaArviointilomakeVastuuhenkilonArvio from '@/views/koejakso/erikoistuva/arviointilomake-vastuuhenkilon-arvio/erikoistuva-arviointilomake-vastuuhenkilon-arvio.vue'
import KoejaksoTavoitteet from '@/views/koejakso/erikoistuva/koejakso-tavoitteet.vue'
import ErikoistuvaKoulutussopimus from '@/views/koejakso/erikoistuva/koulutussopimus/erikoistuva-koulutussopimus.vue'
import Koejakso from '@/views/koejakso/index.vue'
import KoejaksoContainer from '@/views/koejakso/koejakso-container.vue'
import ArviointilomakeAloituskeskustelu from '@/views/koejakso/kouluttaja-vastuuhenkilo/arviointilomake-aloituskeskustelu/arviointilomake-aloituskeskustelu.vue'
import ArviointilomakeKehittamistoimenpiteet from '@/views/koejakso/kouluttaja-vastuuhenkilo/arviointilomake-kehittamistoimenpiteet/arviointilomake-kehittamistoimenpiteet.vue'
import ArviointilomakeLoppukeskustelu from '@/views/koejakso/kouluttaja-vastuuhenkilo/arviointilomake-loppukeskustelu/arviointilomake-loppukeskustelu.vue'
import ArviointilomakeValiarviointi from '@/views/koejakso/kouluttaja-vastuuhenkilo/arviointilomake-valiarviointi/arviointilomake-valiarviointi.vue'
import Koulutussopimus from '@/views/koejakso/kouluttaja-vastuuhenkilo/koulutussopimus/koulutussopimus.vue'
import VastuuhenkilonArvioVastuuhenkilo from '@/views/koejakso/vastuuhenkilo/vastuuhenkilon-arvio-vastuuhenkilo.vue'
import VirkailijanTarkistus from '@/views/koejakso/virkailija/virkailijan-tarkistus.vue'
import Koulutusjakso from '@/views/koulutussuunnitelma/koulutusjakso/koulutusjakso.vue'
import MuokkaaKoulutusjaksoa from '@/views/koulutussuunnitelma/koulutusjakso/muokkaa-koulutusjaksoa.vue'
import UusiKoulutusjakso from '@/views/koulutussuunnitelma/koulutusjakso/uusi-koulutusjakso.vue'
import Koulutussuunnitelma from '@/views/koulutussuunnitelma/koulutussuunnitelma.vue'
import MuokkaaKoulutussuunnitelma from '@/views/koulutussuunnitelma/muokkaa-koulutussuunnitelma.vue'
import HakaYliopisto from '@/views/login/haka-yliopisto.vue'
import LoginView from '@/views/login/login-view.vue'
import Login from '@/views/login/login.vue'
import Logout from '@/views/logout.vue'
import ArvioitavaKokonaisuus from '@/views/opetussuunnitelmat/arvioitava-kokonaisuus/arvioitava-kokonaisuus.vue'
import ArvioitavanKokonaisuudenKategoria from '@/views/opetussuunnitelmat/arvioitava-kokonaisuus/arvioitavan-kokonaisuuden-kategoria.vue'
import KorvaaArvioitavaKokonaisuus from '@/views/opetussuunnitelmat/arvioitava-kokonaisuus/korvaa-arvioitava-kokonaisuus.vue'
import LisaaArvioitavaKokonaisuus from '@/views/opetussuunnitelmat/arvioitava-kokonaisuus/lisaa-arvioitava-kokonaisuus.vue'
import LisaaArvioitavanKokonaisuudenKategoria from '@/views/opetussuunnitelmat/arvioitava-kokonaisuus/lisaa-arvioitavan-kokonaisuuden-kategoria.vue'
import MuokkaaArvioitavaaKokonaisuutta from '@/views/opetussuunnitelmat/arvioitava-kokonaisuus/muokkaa-arvioitavaa-kokonaisuutta.vue'
import MuokkaaArvioitavanKokonaisuudenKategoriaa from '@/views/opetussuunnitelmat/arvioitava-kokonaisuus/muokkaa-arvioitavan-kokonaisuuden-kategoriaa.vue'
import Erikoisala from '@/views/opetussuunnitelmat/erikoisala.vue'
import Opetussuunnitelmat from '@/views/opetussuunnitelmat/opetussuunnitelmat.vue'
import LisaaOpintoopas from '@/views/opetussuunnitelmat/opintoopas/lisaa-opintoopas.vue'
import MuokkaaOpintoopasta from '@/views/opetussuunnitelmat/opintoopas/muokkaa-opintoopasta.vue'
import Opintoopas from '@/views/opetussuunnitelmat/opintoopas/opintoopas.vue'
import KorvaaSuorite from '@/views/opetussuunnitelmat/suorite/korvaa-suorite.vue'
import LisaaSuorite from '@/views/opetussuunnitelmat/suorite/lisaa-suorite.vue'
import LisaaSuoritteenKategoria from '@/views/opetussuunnitelmat/suorite/lisaa-suoritteen-kategoria.vue'
import MuokkaaSuoritetta from '@/views/opetussuunnitelmat/suorite/muokkaa-suoritetta.vue'
import MuokkaaSuoritteenKategoriaa from '@/views/opetussuunnitelmat/suorite/muokkaa-suoritteen-kategoriaa.vue'
import Suorite from '@/views/opetussuunnitelmat/suorite/suorite.vue'
import SuoritteenKategoria from '@/views/opetussuunnitelmat/suorite/suoritteen-kategoria.vue'
import Opintosuoritukset from '@/views/opintosuoritukset/opintosuoritukset.vue'
import MuokkaaPaivittaistaMerkintaa from '@/views/paivittaiset-merkinnat/muokkaa-paivittaista-merkintaa.vue'
import PaivittainenMerkinta from '@/views/paivittaiset-merkinnat/paivittainen-merkinta.vue'
import PaivittaisetMerkinnat from '@/views/paivittaiset-merkinnat/paivittaiset-merkinnat.vue'
import UusiPaivittainenMerkinta from '@/views/paivittaiset-merkinnat/uusi-paivittainen-merkinta.vue'
import MuokkaaPoissaoloa from '@/views/poissaolot/muokkaa-poissaoloa.vue'
import PoissaoloView from '@/views/poissaolot/poissaolo-view.vue'
import UusiPoissaolo from '@/views/poissaolot/uusi-poissaolo.vue'
import Profiili from '@/views/profiili/profiili.vue'
import Root from '@/views/root.vue'
import UusiSeurantajakso from '@/views/seurantakeskustelut/erikoistuva/lisaa-seurantajakso.vue'
import MuokkaaSeurantajaksoa from '@/views/seurantakeskustelut/muokkaa-seurantajaksoa-container.vue'
import Seurantajakso from '@/views/seurantakeskustelut/seurantajakso-container.vue'
import Seurantakeskustelut from '@/views/seurantakeskustelut/seurantakeskustelut-container.vue'
import MuokkaaSuoritemerkintaa from '@/views/suoritemerkinnat/muokkaa-suoritemerkintaa.vue'
import Suoritemerkinnat from '@/views/suoritemerkinnat/suoritemerkinnat.vue'
import Suoritemerkinta from '@/views/suoritemerkinnat/suoritemerkinta.vue'
import UusiSuoritemerkinta from '@/views/suoritemerkinnat/uusi-suoritemerkinta.vue'
import MuokkaaTeoriakoulutusta from '@/views/teoriakoulutukset/muokkaa-teoriakoulutusta.vue'
import Teoriakoulutukset from '@/views/teoriakoulutukset/teoriakoulutukset.vue'
import TeoriakoulutusTallennettu from '@/views/teoriakoulutukset/teoriakoulutus-tallennettu.vue'
import TeoriakoulutusView from '@/views/teoriakoulutukset/teoriakoulutus.vue'
import UusiTeoriakoulutus from '@/views/teoriakoulutukset/uusi-teoriakoulutus.vue'
import TietosuojaselosteView from '@/views/tietosuojaseloste/tietosuojaseloste.vue'
import MuokkaaTyoskentelyjaksoa from '@/views/tyoskentelyjaksot/muokkaa-tyoskentelyjaksoa.vue'
import Tyoskentelyjakso from '@/views/tyoskentelyjaksot/tyoskentelyjakso.vue'
import Tyoskentelyjaksot from '@/views/tyoskentelyjaksot/tyoskentelyjaksot.vue'
import UusiTyoskentelyjakso from '@/views/tyoskentelyjaksot/uusi-tyoskentelyjakso.vue'
// import Viestit from '@/views/viestit.vue'

Vue.use(VueRouter)
Vue.use(Meta)

const guard = async (to: Route, from: Route, next: NavigationGuardNext) => {
  await store.dispatch('auth/authorize')

  if (store.getters['auth/isLoggedIn']) {
    const account = store.getters['auth/account']
    if (
      account.authorities.includes(ELSA_ROLE.ErikoistuvaLaakari) &&
      !account.email &&
      to.name !== 'kaytonaloitus'
    ) {
      next({
        name: 'kaytonaloitus',
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

const etusivuGuard = async (to: Route, from: Route, next: NavigationGuardNext) => {
  // Tekniselle pääkäyttäjälle voisi olla myös oma etusivunsa
  if (store.getters['auth/account'].authorities.includes(ELSA_ROLE.TekninenPaakayttaja)) {
    next({
      name: 'kayttajahallinta',
      replace: true
    })
  } else {
    next()
  }
}

const impersonatedErikoistuvaGuard = async (to: Route, from: Route, next: NavigationGuardNext) => {
  const account = store.getters['auth/account']
  if (account.impersonated) {
    next({
      name: 'page-not-found',
      replace: true
    })
  } else {
    next()
  }
}

const impersonatedErikoistuvaVirkailijaGuard = async (
  to: Route,
  from: Route,
  next: NavigationGuardNext
) => {
  const account = store.getters['auth/account']
  if (
    account.impersonated &&
    account.originalUser.authorities.includes(ELSA_ROLE.OpintohallinnonVirkailija)
  ) {
    next({
      name: 'page-not-found',
      replace: true
    })
  } else {
    next()
  }
}

const languageGuard = async (to: Route, from: Route, next: NavigationGuardNext) => {
  if ('lang' in to.query) {
    const lang = to.query['lang'] as string
    if (Object.keys(VueI18n.messages).includes(lang)) {
      VueI18n.locale = lang
    }
  }
  next()
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
        component: Etusivu,
        beforeEnter: etusivuGuard
      },
      {
        path: '/koulutussuunnitelma',
        name: 'koulutussuunnitelma',
        component: RoleSpecificRoute,
        beforeEnter: impersonatedErikoistuvaVirkailijaGuard,
        props: {
          routeComponent: Koulutussuunnitelma,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/koulutussuunnitelma/muokkaus',
        name: 'muokkaa-koulutussuunnitelma',
        component: RoleSpecificRoute,
        beforeEnter: impersonatedErikoistuvaGuard,
        props: {
          routeComponent: MuokkaaKoulutussuunnitelma,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/koulutussuunnitelma/koulutusjaksot/uusi',
        name: 'uusi-koulutusjakso',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: UusiKoulutusjakso,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/koulutussuunnitelma/koulutusjaksot/:koulutusjaksoId/muokkaus',
        name: 'muokkaa-koulutusjaksoa',
        component: RoleSpecificRoute,
        beforeEnter: impersonatedErikoistuvaGuard,
        props: {
          routeComponent: MuokkaaKoulutusjaksoa,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/koulutussuunnitelma/koulutusjaksot/:koulutusjaksoId',
        name: 'koulutusjakso',
        component: RoleSpecificRoute,
        beforeEnter: impersonatedErikoistuvaVirkailijaGuard,
        props: {
          routeComponent: Koulutusjakso,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/suoritemerkinnat',
        name: 'suoritemerkinnat',
        component: RoleSpecificRoute,
        beforeEnter: impersonatedErikoistuvaVirkailijaGuard,
        props: {
          routeComponent: Suoritemerkinnat,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/suoritemerkinnat/uusi',
        name: 'uusi-suoritemerkinta',
        beforeEnter: impersonatedErikoistuvaGuard,
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
        beforeEnter: impersonatedErikoistuvaGuard,
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
        beforeEnter: impersonatedErikoistuvaVirkailijaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: Suoritemerkinta,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/arvioinnit',
        name: 'arvioinnit',
        beforeEnter: impersonatedErikoistuvaVirkailijaGuard,
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
        beforeEnter: impersonatedErikoistuvaGuard,
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
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: Arviointipyynto,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/arvioinnit/arviointipyynto-lahetetty',
        name: 'arviointipyynto-lahetetty',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: ArviointipyyntoLahetetty,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/arvioinnit/:arviointiId/itsearviointi',
        name: 'itsearviointi',
        beforeEnter: impersonatedErikoistuvaGuard,
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
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: ItsearviointiValmis,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/arvioinnit/:arviointiId',
        name: 'arviointi',
        beforeEnter: impersonatedErikoistuvaVirkailijaGuard,
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
        beforeEnter: impersonatedErikoistuvaGuard,
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
        beforeEnter: impersonatedErikoistuvaGuard,
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
        beforeEnter: impersonatedErikoistuvaGuard,
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
        beforeEnter: impersonatedErikoistuvaGuard,
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
          routeComponent: PoissaoloView,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/tyoskentelyjaksot/poissaolot/:poissaoloId/muokkaus',
        name: 'muokkaa-poissaoloa',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaPoissaoloa,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/teoriakoulutukset',
        name: 'teoriakoulutukset',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Teoriakoulutukset,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/teoriakoulutukset/uusi',
        name: 'uusi-teoriakoulutus',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: UusiTeoriakoulutus,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/teoriakoulutukset/teoriakoulutus-tallennettu',
        name: 'teoriakoulutus-tallennettu',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: TeoriakoulutusTallennettu,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/teoriakoulutukset/:teoriakoulutusId',
        name: 'teoriakoulutus',
        component: RoleSpecificRoute,
        props: {
          routeComponent: TeoriakoulutusView,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/teoriakoulutukset/:teoriakoulutusId/muokkaus',
        name: 'muokkaa-teoriakoulutusta',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaTeoriakoulutusta,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/paivittaiset-merkinnat',
        name: 'paivittaiset-merkinnat',
        beforeEnter: impersonatedErikoistuvaVirkailijaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: PaivittaisetMerkinnat,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/paivittaiset-merkinnat/uusi',
        name: 'uusi-paivittainen-merkinta',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: UusiPaivittainenMerkinta,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/paivittaiset-merkinnat/:paivakirjamerkintaId',
        name: 'paivittainen-merkinta',
        beforeEnter: impersonatedErikoistuvaVirkailijaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: PaivittainenMerkinta,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/paivittaiset-merkinnat/:paivakirjamerkintaId/muokkaus',
        name: 'muokkaa-paivittaista-merkintaa',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaPaivittaistaMerkintaa,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      /*{
        path: '/viestit',
        name: 'viestit',
        component: Viestit
      },*/
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
                ELSA_ROLE.Vastuuhenkilo,
                ELSA_ROLE.OpintohallinnonVirkailija
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
              routeComponent: ArviointilomakeAloituskeskustelu,
              allowedRoles: [ELSA_ROLE.Kouluttaja, ELSA_ROLE.Vastuuhenkilo],
              confirmRouteExit: true
            }
          },
          {
            path: 'valiarviointi/:id',
            name: 'valiarviointi-kouluttaja',
            component: RoleSpecificRoute,
            props: {
              routeComponent: ArviointilomakeValiarviointi,
              allowedRoles: [ELSA_ROLE.Kouluttaja, ELSA_ROLE.Vastuuhenkilo]
            }
          },
          {
            path: 'kehittamistoimenpiteet/:id',
            name: 'kehittamistoimenpiteet-kouluttaja',
            component: RoleSpecificRoute,
            props: {
              routeComponent: ArviointilomakeKehittamistoimenpiteet,
              allowedRoles: [ELSA_ROLE.Kouluttaja, ELSA_ROLE.Vastuuhenkilo]
            }
          },
          {
            path: 'loppukeskustelu/:id',
            name: 'loppukeskustelu-kouluttaja',
            component: RoleSpecificRoute,
            props: {
              routeComponent: ArviointilomakeLoppukeskustelu,
              allowedRoles: [ELSA_ROLE.Kouluttaja, ELSA_ROLE.Vastuuhenkilo]
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
          },
          {
            path: 'virkailijan-tarkistus/:id',
            name: 'virkailijan-tarkistus',
            component: RoleSpecificRoute,
            props: {
              routeComponent: VirkailijanTarkistus,
              allowedRoles: [ELSA_ROLE.OpintohallinnonVirkailija]
            }
          }
        ]
      },
      {
        path: '/profiili',
        name: 'profiili',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: Profiili
      },
      {
        path: '/kayttajahallinta',
        name: 'kayttajahallinta',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Kayttajahallinta,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja, ELSA_ROLE.OpintohallinnonVirkailija]
        }
      },
      {
        path: '/kayttajahallinta/kayttaja/uusi',
        name: 'uusi-kayttaja',
        component: RoleSpecificRoute,
        props: {
          routeComponent: UusiKayttaja,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja, ELSA_ROLE.OpintohallinnonVirkailija],
          confirmRouteExit: true
        }
      },
      {
        path: '/kayttajahallinta/erikoistuvat-laakarit/:kayttajaId',
        name: 'erikoistuva-laakari',
        component: RoleSpecificRoute,
        props: {
          routeComponent: ErikoistuvaLaakari,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja, ELSA_ROLE.OpintohallinnonVirkailija]
        }
      },
      {
        path: '/kayttajahallinta/vastuuhenkilot/:kayttajaId',
        name: 'vastuuhenkilo',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Vastuuhenkilo,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja, ELSA_ROLE.OpintohallinnonVirkailija]
        }
      },
      {
        path: '/kayttajahallinta/kouluttajat/:kayttajaId',
        name: 'kouluttaja',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Kouluttaja,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja, ELSA_ROLE.OpintohallinnonVirkailija]
        }
      },
      {
        path: '/kayttajahallinta/virkailijat/:kayttajaId',
        name: 'virkailija',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Virkailija,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja, ELSA_ROLE.OpintohallinnonVirkailija]
        }
      },
      {
        path: '/kayttajahallinta/paakayttajat/:kayttajaId',
        name: 'paakayttaja',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Paakayttaja,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat',
        name: 'opetussuunnitelmat',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Opetussuunnitelmat,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId',
        name: 'erikoisala',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Erikoisala,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/opintoopas/lisaa',
        name: 'lisaa-opintoopas',
        component: RoleSpecificRoute,
        props: {
          routeComponent: LisaaOpintoopas,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/opintoopas/:opintoopasId',
        name: 'opintoopas',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Opintoopas,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/opintoopas/:opintoopasId/muokkaa',
        name: 'muokkaa-opintoopasta',
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaOpintoopasta,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/arvioitavankokonaisuudenkategoria/lisaa',
        name: 'lisaa-arvioitavan-kokonaisuuden-kategoria',
        component: RoleSpecificRoute,
        props: {
          routeComponent: LisaaArvioitavanKokonaisuudenKategoria,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/arvioitavankokonaisuudenkategoria/:kategoriaId',
        name: 'arvioitavan-kokonaisuuden-kategoria',
        component: RoleSpecificRoute,
        props: {
          routeComponent: ArvioitavanKokonaisuudenKategoria,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/arvioitavankokonaisuudenkategoria/:kategoriaId/muokkaa',
        name: 'muokkaa-arvioitavan-kokonaisuuden-kategoriaa',
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaArvioitavanKokonaisuudenKategoriaa,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/arvioitavakokonaisuus/lisaa',
        name: 'lisaa-arvioitava-kokonaisuus',
        component: RoleSpecificRoute,
        props: {
          routeComponent: LisaaArvioitavaKokonaisuus,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/arvioitavakokonaisuus/:kokonaisuusId',
        name: 'arvioitava-kokonaisuus',
        component: RoleSpecificRoute,
        props: {
          routeComponent: ArvioitavaKokonaisuus,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/arvioitavakokonaisuus/:kokonaisuusId/muokkaa',
        name: 'muokkaa-arvioitavaa-kokonaisuutta',
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaArvioitavaaKokonaisuutta,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/arvioitavakokonaisuus/:kokonaisuusId/korvaa',
        name: 'korvaa-arvioitava-kokonaisuus',
        component: RoleSpecificRoute,
        props: {
          routeComponent: KorvaaArvioitavaKokonaisuus,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/suoritteenkategoria/lisaa',
        name: 'lisaa-suoritteen-kategoria',
        component: RoleSpecificRoute,
        props: {
          routeComponent: LisaaSuoritteenKategoria,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/suoritteenkategoria/:kategoriaId',
        name: 'suoritteen-kategoria',
        component: RoleSpecificRoute,
        props: {
          routeComponent: SuoritteenKategoria,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/suoritteenkategoria/:kategoriaId/muokkaa',
        name: 'muokkaa-suoritteen-kategoriaa',
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaSuoritteenKategoriaa,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/suorite/lisaa',
        name: 'lisaa-suorite',
        component: RoleSpecificRoute,
        props: {
          routeComponent: LisaaSuorite,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/suorite/:suoriteId',
        name: 'suorite',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Suorite,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/suorite/:suoriteId/muokkaa',
        name: 'muokkaa-suoritetta',
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaSuoritetta,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opetussuunnitelmat/erikoisala/:erikoisalaId/suorite/:suoriteId/korvaa',
        name: 'korvaa-suorite',
        component: RoleSpecificRoute,
        props: {
          routeComponent: KorvaaSuorite,
          allowedRoles: [ELSA_ROLE.TekninenPaakayttaja]
        }
      },
      {
        path: '/opintosuoritukset',
        name: 'opintosuoritukset',
        component: RoleSpecificRoute,
        props: {
          routeComponent: Opintosuoritukset,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari]
        }
      },
      {
        path: '/seurantakeskustelut',
        name: 'seurantakeskustelut',
        beforeEnter: impersonatedErikoistuvaVirkailijaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: Seurantakeskustelut,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari, ELSA_ROLE.Kouluttaja]
        }
      },
      {
        path: '/seurantakeskustelut/seurantajakso/uusi',
        name: 'lisaa-seurantajakso',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: UusiSeurantajakso,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari],
          confirmRouteExit: true
        }
      },
      {
        path: '/seurantakeskustelut/seurantajakso/:seurantajaksoId',
        name: 'seurantajakso',
        beforeEnter: impersonatedErikoistuvaVirkailijaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: Seurantajakso,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari, ELSA_ROLE.Kouluttaja]
        }
      },
      {
        path: '/seurantakeskustelut/seurantajakso/:seurantajaksoId/muokkaa',
        name: 'muokkaa-seurantajaksoa',
        beforeEnter: impersonatedErikoistuvaGuard,
        component: RoleSpecificRoute,
        props: {
          routeComponent: MuokkaaSeurantajaksoa,
          allowedRoles: [ELSA_ROLE.ErikoistuvaLaakari, ELSA_ROLE.Kouluttaja],
          confirmRouteExit: true
        }
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
            const account = store.getters['auth/account']
            if (
              account.authorities.includes(ELSA_ROLE.ErikoistuvaLaakari) &&
              !account.email &&
              to.name !== 'kaytonaloitus'
            ) {
              next({
                name: 'kaytonaloitus',
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
        path: '/kayton-aloitus',
        name: 'kaytonaloitus',
        component: KaytonAloitus,
        beforeEnter: async (to, from, next) => {
          await store.dispatch('auth/authorize')

          if (store.getters['auth/isLoggedIn']) {
            if (store.getters['auth/account'].email) {
              next('/etusivu')
            } else {
              next()
            }
          } else {
            next('/kirjautuminen')
          }
        }
      },
      {
        path: '/haka-yliopisto',
        name: 'haka-yliopisto',
        component: HakaYliopisto,
        beforeEnter: async (to, from, next) => {
          await store.dispatch('auth/authorize')

          if (store.getters['auth/isLoggedIn']) {
            if (store.getters['auth/account'].authorities.length > 0) {
              next('/etusivu')
            } else {
              next()
            }
          } else {
            next()
          }
        }
      }
    ]
  },
  {
    path: '/uloskirjaus',
    name: 'logout',
    component: Logout,
    beforeEnter: async (to, from, next) => {
      await store.dispatch('auth/authorize')

      if (store.getters['auth/isLoggedIn']) {
        next('/etusivu')
      } else {
        next()
      }
    }
  },
  {
    path: '/sivua-ei-loytynyt',
    name: 'page-not-found',
    alias: '*',
    component: PageNotFound
  },
  {
    path: '/tietosuojaseloste',
    beforeEnter: languageGuard,
    component: TietosuojaselosteView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const originalPush = router.push
router.push = function push(
  location: RawLocation,
  // eslint-disable-next-line @typescript-eslint/ban-types
  onComplete?: Function,
  onAbort?: ErrorHandler
): Promise<Route> {
  if (onComplete || onAbort) {
    return originalPush.call(this, location, onComplete, onAbort) as any as Promise<Route>
  }

  return (originalPush.call(this, location) as any as Promise<Route>).catch((err) => {
    // Sallitaan uudelleenohjaukset
    if (VueRouter.isNavigationFailure(err, VueRouter.NavigationFailureType.redirected)) {
      return Promise.resolve() as any
    }

    return Promise.reject(err)
  })
}

export default router
