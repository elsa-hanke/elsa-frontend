<template>
  <div class="omat-tiedot">
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
            :label="title ? $t(title) : $t('nimi')"
            label-cols-md="4"
            label-cols-xl="4"
            label-cols="12"
            class="align-items-center mb-md-0"
          >
            <template>{{ displayName }}</template>
          </elsa-form-group>
          <elsa-form-group
            v-if="account.email"
            :label="$t('sahkopostiosoite')"
            label-cols-md="4"
            label-cols-xl="4"
            label-cols="12"
            class="align-items-center mb-md-0"
          >
            <template>{{ account.email }}</template>
          </elsa-form-group>
          <elsa-form-group
            v-if="account.phoneNumber"
            :label="$t('puhelinnumero')"
            label-cols-md="4"
            label-cols-xl="4"
            label-cols="12"
            class="align-items-center mb-md-0"
          >
            <template>{{ account.phoneNumber }}</template>
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
          :label="title ? $t(title) : $t('nimi')"
          label-cols-md="4"
          label-cols-xl="4"
          label-cols="12"
          class="align-items-center mb-md-0"
        >
          <template>{{ displayName }}</template>
        </elsa-form-group>
        <hr />
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
      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
  import Avatar from 'vue-avatar'
  import { Component, Vue, Prop } from 'vue-property-decorator'
  import { required } from 'vuelidate/lib/validators'

  import ElsaButton from '@/components/button/button.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import store from '@/store'
  import { OmatTiedotLomake } from '@/types'
  import { confirmExit } from '@/utils/confirm'
  import { getTitleFromAuthorities } from '@/utils/functions'
  import { toastFail, toastSuccess } from '@/utils/toast'

  @Component({
    components: {
      Avatar,
      ElsaButton,
      ElsaFormGroup
    },
    validations: {
      form: {
        email: {
          required
        }
      }
    }
  })
  export default class OmatTiedot extends Vue {
    @Prop({ required: false, default: false })
    editing!: boolean

    form: OmatTiedotLomake = {
      email: null,
      phoneNumber: null,
      avatar: null,
      avatarUpdated: false
    }
    params = {
      saving: false
    }

    mounted() {
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
        avatarUpdated: false
      }
    }

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
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
        this.form = this.initForm()
        this.$emit('change', false)
      } catch (err) {
        toastFail(
          this,
          this.$t('omien-tietojen-paivittaminen-epaonnistui', {
            virhe: err.response.data.title
          })
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
      return getTitleFromAuthorities(this.authorities)
    }

    get avatar() {
      if (this.account) {
        return this.account.avatar
      }
      return null
    }
  }
</script>
