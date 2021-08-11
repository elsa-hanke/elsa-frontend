<template>
  <div class="arviointi">
    <b-breadcrumb :items="items" class="mb-0" />
    <b-container fluid>
      <b-row lg>
        <b-col>
          <h1>{{ $t('arviointi') }}</h1>
          <hr />
          <div v-if="value">
            <arviointi-form :value="value" :editing="false" @submit="onSubmit" />
            <hr />
            <h4>{{ $t('kommentit') }}</h4>
            <p>{{ $t('kommentit-kuvaus') }}</p>
            <div class="border-bottom mb-3">
              <div v-if="kommentit && kommentit.length > 0" class="d-flex flex-column">
                <kommentti-card
                  v-for="(kommentti, index) in kommentit"
                  :key="index"
                  :value="kommentti"
                />
              </div>
              <div v-else>
                <b-alert variant="dark" show>
                  <font-awesome-icon icon="info-circle" fixed-width class="text-muted" />
                  {{ $t('suoritusarviointia-ei-ole-kommentoitu') }}
                </b-alert>
              </div>
            </div>
            <b-form @submit.stop.prevent="onKommenttiSubmit">
              <div class="uusi-kommentti mb-3">
                <elsa-form-group :label="$t('uusi-kommentti')">
                  <template v-slot="{ uid }">
                    <b-form-textarea
                      :id="uid"
                      v-model="kommentti.teksti"
                      :placeholder="$t('kirjoita-kommenttisi-tahan')"
                      rows="5"
                    ></b-form-textarea>
                  </template>
                </elsa-form-group>
                <div class="text-right">
                  <elsa-button
                    :disabled="!kommentti.teksti || saving"
                    :loading="saving"
                    type="submit"
                    variant="primary"
                  >
                    {{ $t('lisaa-kommentti') }}
                  </elsa-button>
                </div>
              </div>
            </b-form>
          </div>
          <div v-else class="text-center">
            <b-spinner variant="primary" :label="$t('ladataan')" />
          </div>
        </b-col>
        <b-col class="pl-3 pr-0" lg="2"></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
  import axios from 'axios'
  import compareAsc from 'date-fns/compareAsc'
  import { Component, Vue } from 'vue-property-decorator'
  import { parseISO } from 'date-fns'
  import store from '@/store'
  import ArviointiForm from '@/forms/arviointi-form.vue'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import KommenttiCard from '@/components/kommentti-card/kommentti-card.vue'
  import ElsaButton from '@/components/button/button.vue'
  import { toastFail } from '@/utils/toast'

  @Component({
    components: {
      ArviointiForm,
      UserAvatar,
      ElsaFormGroup,
      KommenttiCard,
      ElsaButton
    }
  })
  export default class Arviointi extends Vue {
    value: any = null
    items = [
      {
        text: this.$t('etusivu'),
        to: { name: 'etusivu' }
      },
      {
        text: this.$t('arvioinnit'),
        to: { name: 'arvioinnit' }
      },
      {
        text: this.$t('arviointi'),
        active: true
      }
    ]
    kommentti = {
      teksti: null
    }
    saving = false

    async mounted() {
      const arviointiId = this.$route?.params?.arviointiId
      if (arviointiId) {
        try {
          this.value = (Vue.prototype.$isErikoistuva()
            ? await axios.get(`erikoistuva-laakari/suoritusarvioinnit/${arviointiId}`)
            : await axios.get(`kouluttaja/suoritusarvioinnit/${arviointiId}`)
          ).data
        } catch (err) {
          this.$router.replace({ name: 'arvioinnit' })
        }
      }
    }

    onSubmit(form: any) {
      console.log(form)
    }

    async onKommenttiSubmit() {
      this.saving = true
      try {
        const kommentti = (
          await axios.post(
            `erikoistuva-laakari/suoritusarvioinnit/${this.value.id}/kommentti`,
            this.kommentti
          )
        ).data
        this.value.kommentit.push(kommentti)
        this.kommentti = {
          teksti: null
        }
      } catch (err) {
        toastFail(this, this.$t('uuden-kommentin-lisaaminen-epaonnistui'))
      }
      this.saving = false
    }

    get kommentit() {
      if (this.value) {
        return this.value.kommentit
          .sort((a: any, b: any) =>
            compareAsc(parseISO(a.luontiaika as string), parseISO(b.luontiaika as string))
          )
          .map((k: any) => {
            return {
              kommentti: k,
              self: k.kommentoija?.id === this.account?.erikoistuvaLaakari?.kayttajaId
            }
          })
      } else {
        return []
      }
    }

    get account() {
      return store.getters['auth/account']
    }
  }
</script>

<style lang="scss" scoped>
  .arviointi {
    max-width: 970px;
  }
</style>
