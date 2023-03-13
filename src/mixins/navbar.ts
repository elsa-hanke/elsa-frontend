import { Component, Vue } from 'vue-property-decorator'

import { ELSA_API_LOCATION, vaihdaRooli } from '@/api'
import { patchOpintooikeusKaytossa, getErikoistuvaLaakari } from '@/api/erikoistuva'
import store from '@/store'
import { Opintooikeus } from '@/types'
import { sortByDateDesc } from '@/utils/date'
import { getTitleFromAuthorities } from '@/utils/functions'
import { ELSA_ROLE } from '@/utils/roles'

@Component({})
export default class NavbarMixin extends Vue {
  opintooikeusKaytossa?: null | Opintooikeus = null
  opintooikeudet: null | Opintooikeus[] = null

  async mounted() {
    if (this.isErikoistuvaLaakari) {
      const erikoistuvaLaakari = (await getErikoistuvaLaakari()).data
      this.opintooikeudet = erikoistuvaLaakari.opintooikeudet.sort(
        (a: Opintooikeus, b: Opintooikeus) =>
          sortByDateDesc(a.opintooikeudenMyontamispaiva, b.opintooikeudenMyontamispaiva)
      )
      this.opintooikeusKaytossa = this.getOpintooikeusKaytossa(
        erikoistuvaLaakari.opintooikeusKaytossaId
      )
    }
  }

  get isErikoistuvaLaakari() {
    return this.activeRole === ELSA_ROLE.ErikoistuvaLaakari
  }

  get currentLocale() {
    return this.$i18n.locale
  }

  get account() {
    return store.getters['auth/account']
  }

  get authorities() {
    if (this.account) {
      if (this.account.impersonated) {
        return this.account.originalUser.authorities
      }
      return this.account.authorities
    }
    return []
  }

  get activeRole(): string {
    if (this.account) {
      return this.account.activeAuthority
    }
    return ''
  }

  get erikoisalaNimi() {
    return this.opintooikeusKaytossa?.erikoisalaNimi
  }

  get avatar() {
    if (this.account) {
      if (this.account.impersonated) {
        return this.account.originalUser.avatar
      }
      return this.account.avatar
    }
    return undefined
  }

  get locales() {
    return Object.keys(this.$i18n.messages)
  }

  get logoutUrl() {
    return ELSA_API_LOCATION + '/api/logout'
  }

  get displayName() {
    if (this.account) {
      if (this.account.impersonated) {
        return `${this.account.originalUser.firstName} ${this.account.originalUser.lastName}`
      }
      return `${this.account.firstName} ${this.account.lastName}`
    }
    return ''
  }

  get title() {
    if (this.isErikoistuvaLaakari) {
      return this.erikoisalaNimi
    }
    return getTitleFromAuthorities(this, this.activeRole)
  }

  getOpintooikeusKaytossa(id: number) {
    return this.opintooikeudet?.find((o) => o.id === id)
  }

  changeLocale(lang: string) {
    this.$i18n.locale = lang
  }

  async logout() {
    await store.dispatch('auth/logout')

    if (store.getters['auth/sloEnabled'] === true) {
      const logoutForm = this.$refs.logoutForm as HTMLFormElement
      logoutForm.submit()
    }
  }

  async changeOpintooikeus(opintooikeus: Opintooikeus) {
    if (this.opintooikeusKaytossa === opintooikeus) return
    this.opintooikeusKaytossa = opintooikeus
    await patchOpintooikeusKaytossa(opintooikeus.id)
    this.$router.go(0)
  }

  async changeToErikoistuja() {
    await vaihdaRooli(ELSA_ROLE.ErikoistuvaLaakari)
    this.$router.go(0)
  }

  async changeToKouluttaja() {
    await vaihdaRooli(ELSA_ROLE.Kouluttaja)
    this.$router.go(0)
  }
}
