<template>
  <div class="omat-tiedot mb-4">
    <div v-if="!editing">
      <div class="d-block d-lg-none d-xl-none">
        <avatar
          :src="avatarSrc"
          :username="displayName"
          background-color="gray"
          color="white"
          :size="160"
        />
      </div>
      <div class="d-flex">
        <div class="d-none d-lg-block d-xl-block mr-3">
          <avatar
            :src="avatarSrc"
            :username="displayName"
            background-color="gray"
            color="white"
            :size="160"
          />
        </div>
        <div class="flex-fill">
          <elsa-form-group
            :label="title ? title : $t('nimi')"
            label-cols-md="4"
            label-cols-xl="4"
            label-cols="12"
            class="align-items-center mb-md-0"
          >
            <template>
              {{ displayName }}
            </template>
          </elsa-form-group>
          <div v-if="$isKouluttaja() || $isVastuuhenkilo()">
            <elsa-form-group
              :label="$t('nimike')"
              label-cols-md="4"
              label-cols-xl="4"
              label-cols="12"
              class="align-items-center mb-md-0"
            >
              <template>
                {{ form.nimike }}
              </template>
            </elsa-form-group>
            <elsa-form-group
              :label="$t('yliopisto-ja-erikoisalat')"
              label-cols-md="4"
              label-cols-xl="4"
              label-cols="12"
              class="align-items-center mb-md-0"
            >
              <template>
                <div
                  v-for="yliopistoErikoisalat in form.kayttajanYliopistotJaErikoisalat"
                  :key="yliopistoErikoisalat.yliopisto.id"
                >
                  <div v-for="erikoisala in yliopistoErikoisalat.erikoisalat" :key="erikoisala.id">
                    {{ $t(`yliopisto-nimi.${yliopistoErikoisalat.yliopisto.nimi}`) }}:
                    {{ erikoisala.nimi }}
                  </div>
                </div>
              </template>
            </elsa-form-group>
          </div>
          <div v-if="$isVirkailija()">
            <elsa-form-group
              :label="$t('yliopisto')"
              label-cols-md="4"
              label-cols-xl="4"
              label-cols="12"
              class="align-items-center mb-md-0"
            >
              <template>
                <div
                  v-for="yliopisto in kayttajaTiedot ? kayttajaTiedot.kayttajanYliopistot : []"
                  :key="yliopisto.id"
                >
                  {{ $t(`yliopisto-nimi.${yliopisto.nimi}`) }}
                </div>
              </template>
            </elsa-form-group>
          </div>
          <elsa-form-group
            v-if="account.email"
            :label="$t('sahkopostiosoite')"
            label-cols-md="4"
            label-cols-xl="4"
            label-cols="12"
            class="align-items-center mb-md-0"
          >
            <template>
              {{ account.email }}
            </template>
          </elsa-form-group>
          <elsa-form-group
            v-if="account.phoneNumber"
            :label="$t('puhelinnumero')"
            label-cols-md="4"
            label-cols-xl="4"
            label-cols="12"
            class="align-items-center mb-md-0"
          >
            <template>
              {{ account.phoneNumber }}
            </template>
          </elsa-form-group>
        </div>
      </div>
      <div class="text-right">
        <elsa-button variant="primary" @click="() => $emit('change', !editing)">
          {{ $t('muokkaa-tietoja') }}
        </elsa-button>
      </div>
    </div>
    <div v-else>
      <b-form @submit.stop.prevent="onSubmit">
        <elsa-form-group
          :label="title ? title : $t('nimi')"
          label-cols-md="4"
          label-cols-xl="4"
          label-cols="12"
          class="align-items-center mb-md-2"
        >
          <template>
            {{ displayName }}
          </template>
        </elsa-form-group>
        <div v-if="$isVastuuhenkilo()">
          <elsa-form-group
            :label="$t('yliopisto-ja-erikoisalat')"
            label-cols-md="4"
            label-cols-xl="4"
            label-cols="12"
            class="align-items-center mb-md-0"
          >
            <template>
              <div
                v-for="yliopistoErikoisalat in form.kayttajanYliopistotJaErikoisalat"
                :key="yliopistoErikoisalat.yliopisto.id"
              >
                <div v-for="erikoisala in yliopistoErikoisalat.erikoisalat" :key="erikoisala.id">
                  {{ $t(`yliopisto-nimi.${yliopistoErikoisalat.yliopisto.nimi}`) }}:
                  {{ erikoisala.nimi }}
                </div>
              </div>
            </template>
          </elsa-form-group>
          <hr />
        </div>
        <div v-if="$isVirkailija()">
          <elsa-form-group
            :label="$t('yliopisto')"
            label-cols-md="4"
            label-cols-xl="4"
            label-cols="12"
            class="align-items-center mb-md-0"
          >
            <template>
              <div
                v-for="yliopisto in kayttajaTiedot ? kayttajaTiedot.kayttajanYliopistot : []"
                :key="yliopisto.id"
              >
                {{ $t(`yliopisto-nimi.${yliopisto.nimi}`) }}
              </div>
            </template>
          </elsa-form-group>
          <hr />
        </div>
        <elsa-form-group v-if="$isKouluttaja() || $isVastuuhenkilo()" :label="$t('nimike')">
          <template v-slot="{ uid }">
            <b-form-input :id="uid" v-model="form.nimike"></b-form-input>
          </template>
        </elsa-form-group>
        <div v-if="$isKouluttaja()">
          <hr />
          <div
            v-for="(yliopistoErikoisalat, index) in form.kayttajanYliopistotJaErikoisalat"
            :key="yliopistoErikoisalat.yliopisto.id"
          >
            <hr v-if="index > 0" />
            <elsa-form-group :label="$t('yliopisto')">
              <template v-slot="{ uid }">
                <elsa-form-multiselect
                  :id="uid"
                  v-model="form.kayttajanYliopistotJaErikoisalat[index].yliopisto"
                  :options="
                    yliopistotOptions(form.kayttajanYliopistotJaErikoisalat[index].yliopisto)
                  "
                  :state="validateKayttajanYliopistoState(index)"
                  :customLabel="yliopistoLabel"
                ></elsa-form-multiselect>
                <b-form-invalid-feedback :state="validateKayttajanYliopistoState(index)">
                  {{ $t('pakollinen-tieto') }}
                </b-form-invalid-feedback>
              </template>
            </elsa-form-group>
            <elsa-form-group :label="$t('erikoisala')">
              <template v-slot="{ uid }">
                <elsa-form-multiselect
                  :id="uid"
                  v-model="form.kayttajanYliopistotJaErikoisalat[index].erikoisalat"
                  :options="kayttajaTiedot ? kayttajaTiedot.erikoisalat : []"
                  :multiple="true"
                  :state="validateKayttajanYliopistoErikoisalaState(index)"
                  label="nimi"
                  track-by="id"
                ></elsa-form-multiselect>
                <b-form-invalid-feedback :state="validateKayttajanYliopistoErikoisalaState(index)">
                  {{ $t('pakollinen-tieto') }}
                </b-form-invalid-feedback>
              </template>
            </elsa-form-group>
            <elsa-button
              v-if="index !== 0"
              @click="deleteYliopistoErikoisala(index)"
              variant="link"
              class="text-decoration-none shadow-none p-0"
            >
              <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="sm" />
              {{ $t('poista-yliopisto-ja-erikoisala') }}
            </elsa-button>
          </div>
          <elsa-button
            @click="addYliopistoErikoisala"
            variant="link"
            class="text-decoration-none shadow-none p-0"
          >
            <font-awesome-icon icon="plus" fixed-width size="sm" />
            {{ $t('lisaa-yliopisto-ja-erikoisala') }}
          </elsa-button>
          <hr />
        </div>
        <elsa-form-group :label="$t('sahkopostiosoite')" :required="true">
          <template v-slot="{ uid }">
            <b-form-input
              :id="uid"
              v-model="form.email"
              :state="validateState('email')"
              :aria-describedby="`${uid}-feedback`"
            ></b-form-input>
            <b-form-invalid-feedback :id="`${uid}-feedback`">
              {{ $t('pakollinen-tieto') }}
            </b-form-invalid-feedback>
          </template>
        </elsa-form-group>
        <elsa-form-group :label="$t('puhelinnumero')">
          <template v-slot="{ uid }">
            <b-form-input :id="uid" v-model="form.phoneNumber"></b-form-input>
          </template>
        </elsa-form-group>
        <elsa-form-group :label="$t('profiilikuva')">
          <template>
            <avatar
              :src="previewSrc"
              src-content-type="image/jpeg"
              :username="displayName"
              background-color="gray"
              color="white"
              :size="160"
            />
            <input
              ref="avatar-file-input"
              id="avatar-file-input"
              type="file"
              accept="image/jpeg,image/png"
              @change="avatarChange"
              hidden
            />
            <div class="d-flex flex-wrap">
              <div class="mt-2">
                <elsa-button variant="primary" class="mr-2" @click="selectAvatar">
                  {{ $t('valitse-profiilikuva') }}
                </elsa-button>
              </div>
              <div class="mt-2">
                <elsa-button variant="outline-danger" v-if="form.avatar" @click="removeAvatar">
                  <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="lg" />
                  {{ $t('poista-kuva') }}
                </elsa-button>
              </div>
            </div>
          </template>
        </elsa-form-group>
        <hr />
        <div class="text-right">
          <elsa-button variant="back" @click="onCancel">
            {{ $t('peruuta') }}
          </elsa-button>
          <elsa-button :loading="params.saving" type="submit" variant="primary" class="ml-2">
            {{ $t('tallenna') }}
          </elsa-button>
        </div>
        <div class="row">
          <elsa-form-error :active="$v.$anyError" />
        </div>
      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
  import axios, { AxiosError } from 'axios'
  import Avatar from 'vue-avatar'
  import { TranslateResult } from 'vue-i18n'
  import { Component, Vue, Prop, Mixins } from 'vue-property-decorator'
  import { Validation, validationMixin } from 'vuelidate'
  import { minLength, required } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormError from '@/components/form-error/form-error.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import store from '@/store'
  import {
    ElsaError,
    OmatTiedotLomake,
    Yliopisto,
    Kayttajatiedot,
    KayttajaYliopistoErikoisalat
  } from '@/types'
  import { confirmExit } from '@/utils/confirm'
  import { getTitleFromAuthorities } from '@/utils/functions'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      Avatar,
      ElsaButton,
      ElsaFormError,
      ElsaFormGroup,
      ElsaFormMultiselect
    }
  })
  export default class OmatTiedot extends Mixins(validationMixin) {
    @Prop({ required: false, default: false })
    editing!: boolean

    validations() {
      return {
        form: {
          email: {
            required
          },
          kayttajanYliopistotJaErikoisalat: {
            $each: {
              yliopisto: {
                id: {
                  required
                }
              },
              erikoisalat: {
                required,
                minLength: minLength(1)
              }
            }
          }
        }
      }
    }

    form: OmatTiedotLomake = {
      nimike: null,
      email: null,
      phoneNumber: null,
      avatar: null,
      avatarUpdated: false,
      kayttajanYliopistotJaErikoisalat: []
    }
    params = {
      saving: false
    }

    kayttajaTiedot: Kayttajatiedot | null = null
    valittuYliopisto: Yliopisto | null = null

    async mounted() {
      this.kayttajaTiedot = (await axios.get('/kayttaja-lisatiedot')).data
      this.form = this.initForm()
    }

    selectAvatar() {
      const inputEl = this.$refs['avatar-file-input'] as HTMLInputElement
      inputEl.click()
    }

    removeAvatar() {
      this.form.avatar = null
      this.form.avatarUpdated = true
      const inputEl = this.$refs['avatar-file-input'] as HTMLInputElement
      inputEl.value = ''
    }

    avatarChange(e: Event) {
      const inputElement = e.target as HTMLInputElement
      if (inputElement.files && inputElement.files?.length > 0) {
        const file = inputElement.files[0]
        this.form.avatar = file
        this.form.avatarUpdated = true
      }
    }

    initForm(): OmatTiedotLomake {
      return {
        email: this.account?.email || null,
        phoneNumber: this.account?.phoneNumber || null,
        avatar: this.account?.avatar || null,
        avatarUpdated: false,
        nimike: this.kayttajaTiedot?.nimike || null,
        kayttajanYliopistotJaErikoisalat:
          this.kayttajaTiedot?.kayttajanYliopistotJaErikoisalat || []
      }
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    validateKayttajanYliopistoState(index: number) {
      const { $dirty, $error } = this.$v.form?.kayttajanYliopistotJaErikoisalat?.$each[index]
        ?.yliopisto.id as Validation
      return $dirty ? ($error ? false : null) : null
    }

    validateKayttajanYliopistoErikoisalaState(index: number) {
      const { $dirty, $error } = this.$v.form?.kayttajanYliopistotJaErikoisalat?.$each[index]
        ?.erikoisalat as Validation
      return $dirty ? ($error ? false : null) : null
    }

    addYliopistoErikoisala() {
      this.form.kayttajanYliopistotJaErikoisalat.push({
        yliopisto: { nimi: '', erikoisalat: [] },
        erikoisalat: []
      })
    }

    deleteYliopistoErikoisala(index: number) {
      if (this.form.kayttajanYliopistotJaErikoisalat) {
        Vue.delete(this.form.kayttajanYliopistotJaErikoisalat, index)
      }
    }

    yliopistoLabel(yliopisto: Yliopisto): TranslateResult {
      return yliopisto.nimi === '' ? '' : this.$t(`yliopisto-nimi.${yliopisto.nimi}`)
    }

    onSelectYliopisto(event: any) {
      console.log(typeof event)
    }

    async onSubmit() {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return
      }

      try {
        this.params.saving = true
        await store.dispatch(
          'auth/putUser',
          // Ohitetaan olemassa olevan avatarin lähettäminen
          !this.form.avatar?.name
            ? {
                ...this.form,
                avatar: null
              }
            : this.form
        )
        toastSuccess(this, this.$t('omat-tiedot-paivitetty'))
        this.$v.form.$reset()
        this.kayttajaTiedot = (await axios.get('/kayttaja-lisatiedot')).data
        this.form = this.initForm()
        this.$emit('change', false)
      } catch (err) {
        const axiosError = err as AxiosError<ElsaError>
        const message = axiosError?.response?.data?.message
        toastFail(
          this,
          message
            ? `${this.$t('omien-tietojen-paivittaminen-epaonnistui')}: ${this.$t(message)}`
            : this.$t('omien-tietojen-paivittaminen-epaonnistui')
        )
      } finally {
        this.params.saving = false
      }
    }

    async onCancel() {
      if (await confirmExit(this)) {
        this.form = this.initForm()
        this.$v.form.$reset()
        this.$emit('change', false)
      }
    }

    get previewSrc() {
      if (this.form.avatar && this.form.avatar.name) {
        return URL.createObjectURL(this.form.avatar)
      } else if (this.form.avatar) {
        return `data:image/jpeg;base64,${this.account.avatar}`
      }
      return undefined
    }

    get account() {
      return store.getters['auth/account']
    }

    get displayName() {
      if (this.account) {
        return `${this.account.firstName} ${this.account.lastName}`
      }
      return ''
    }

    get avatarSrc() {
      if (this.account) {
        return `data:image/jpeg;base64,${this.account.avatar}`
      }
      return undefined
    }

    get authorities() {
      if (this.account) {
        return this.account.authorities
      }
      return []
    }

    get title() {
      return getTitleFromAuthorities(this, this.authorities)
    }

    get avatar() {
      if (this.account) {
        return this.account.avatar
      }
      return null
    }

    yliopistotOptions(yliopisto: Yliopisto) {
      return this.kayttajaTiedot?.yliopistot?.map((y: Yliopisto) => {
        if (
          this.form.kayttajanYliopistotJaErikoisalat
            .map((y2: KayttajaYliopistoErikoisalat) => y2.yliopisto.id)
            .includes(y.id)
        ) {
          return {
            ...y,
            $isDisabled: y.id !== yliopisto.id
          }
        }
        return y
      })
    }
  }
</script>
