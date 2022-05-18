import { Component, Mixins } from 'vue-property-decorator'
import { validationMixin } from 'vuelidate'

import KayttajahallintaMixin from './kayttajahallinta'

import { activateKayttaja, passivateKayttaja } from '@/api/kayttajahallinta'
import { KayttajahallintaKayttaja } from '@/types'
import { KayttajatiliTila } from '@/utils/constants'
import { getTitleFromAuthorities } from '@/utils/functions'

@Component({})
export default class KayttajahallintaKayttajaMixin extends Mixins(
  validationMixin,
  KayttajahallintaMixin
) {
  loading = true
  kayttaja: KayttajahallintaKayttaja | null = null
  updatingTila = false
  updatingKayttaja = false
  editing = false
  skipRouteExitConfirm = true

  async onActivateKayttaja() {
    if (
      this.kayttaja?.kayttaja?.id &&
      (await this.$bvModal.msgBoxConfirm(this.$t('aktivoi-kayttaja-varmistus') as string, {
        title: this.$t('aktivoi-kayttaja') as string,
        okVariant: 'primary',
        okTitle: this.$t('aktivoi-kayttaja') as string,
        cancelTitle: this.$t('peruuta') as string,
        cancelVariant: 'back',
        hideHeaderClose: false,
        centered: true
      }))
    ) {
      this.updatingTila = true
      await activateKayttaja(this.kayttaja.kayttaja.id)
      this.kayttaja.kayttaja.tila = KayttajatiliTila.AKTIIVINEN
      this.updatingTila = false
    }
  }

  async onPassivateKayttaja() {
    if (
      this.kayttaja?.kayttaja?.id &&
      (await this.$bvModal.msgBoxConfirm(this.$t('passivoi-kayttaja-varmistus') as string, {
        title: this.$t('passivoi-kayttaja') as string,
        okVariant: 'primary',
        okTitle: this.$t('passivoi-kayttaja') as string,
        cancelTitle: this.$t('peruuta') as string,
        cancelVariant: 'back',
        hideHeaderClose: false,
        centered: true
      }))
    ) {
      this.updatingTila = true
      await passivateKayttaja(this.kayttaja.kayttaja.id)
      this.kayttaja.kayttaja.tila = KayttajatiliTila.PASSIIVINEN
      this.updatingTila = false
    }
  }

  validateForm(): boolean {
    this.$v.form.$touch()
    return !this.$v.$anyError
  }

  validateState(name: string) {
    const { $dirty, $error } = this.$v.form[name] as any
    return $dirty ? ($error ? false : null) : null
  }

  onEditUser() {
    this.editing = true
    window.scrollTo(0, 0)
  }

  get tilinTilaText() {
    return this.$t(`tilin-tila-${this.kayttaja?.kayttaja?.tila}`)
  }

  get tilaColor() {
    switch (this.kayttaja?.kayttaja?.tila) {
      case KayttajatiliTila.AKTIIVINEN:
        return 'text-success'
      case KayttajatiliTila.PASSIIVINEN:
        return 'text-danger'
      default:
        return ''
    }
  }

  get isAktiivinen() {
    return this.kayttaja?.kayttaja?.tila === KayttajatiliTila.AKTIIVINEN
  }

  get isPassiivinen() {
    return this.kayttaja?.kayttaja?.tila === KayttajatiliTila.PASSIIVINEN
  }

  get isKutsuttu() {
    return this.kayttaja?.kayttaja?.tila === KayttajatiliTila.KUTSUTTU
  }

  get rooli() {
    return getTitleFromAuthorities(this, this.kayttaja?.user?.authorities ?? [])
  }

  get etunimi() {
    return this.kayttaja?.kayttaja?.etunimi
  }

  get sukunimi() {
    return this.kayttaja?.kayttaja?.sukunimi
  }

  get sahkoposti() {
    return this.kayttaja?.user?.email
  }
}
