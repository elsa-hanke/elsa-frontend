<template>
  <div class="omat-tiedot">
    <div v-if="!editing">
      <div class="d-flex align-items-center">
        <div class="d-none d-lg-block d-xl-block mr-3">
          <avatar
            :username="displayName"
            background-color="gray"
            color="white"
            :size="160"
          ></avatar>
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
            :label="$t('sahkopostiosoite')"
            label-cols-md="4"
            label-cols-xl="4"
            label-cols="12"
            class="align-items-center mb-md-0"
          >
            <template>{{ account.email }}</template>
          </elsa-form-group>
          <elsa-form-group
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
              :username="displayName"
              background-color="gray"
              color="white"
              :size="160"
            ></avatar>
            <div class="mt-2">
              <elsa-button variant="primary" class="mr-2">
                {{ $t('valitse-profiilikuva') }}
              </elsa-button>
              <elsa-button variant="outline-danger" v-if="true">
                <font-awesome-icon :icon="['far', 'trash-alt']" fixed-width size="lg" />
                {{ $t('poista-kuva') }}
              </elsa-button>
            </div>
          </template>
        </elsa-form-group>
        <hr />
        <div class="text-right">
          <elsa-button variant="back" @click="onCancel">
            {{ $t('peruuta') }}
          </elsa-button>
          <elsa-button type="submit" variant="primary" class="ml-2">
            {{ $t('tallenna') }}
          </elsa-button>
        </div>
      </b-form>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { Prop } from 'vue-property-decorator'
  import Avatar from 'vue-avatar'
  import { required } from 'vuelidate/lib/validators'
  import ElsaButton from '@/components/button/button.vue'
  import store from '@/store'
  import { confirmExit } from '@/utils/confirm'
  import { getTitleFromAuthorities } from '@/utils/functions'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'

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

    form = {
      email: null,
      phoneNumber: null
    } as any

    validateState(name: string) {
      const { $dirty, $error } = this.$v.form[name] as any
      return $dirty ? ($error ? false : null) : null
    }

    async onCancel() {
      if (await confirmExit(this)) {
        this.form = {
          email: null,
          phoneNumber: null
        }
        this.$emit('change', !this.editing)
      }
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

    get authorities() {
      if (this.account) {
        return this.account.authorities
      }
      return []
    }

    get title() {
      return getTitleFromAuthorities(this.authorities)
    }
  }
</script>
