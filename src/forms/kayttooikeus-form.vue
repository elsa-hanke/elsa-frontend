<template>
  <b-form @submit.stop.prevent="onSubmit">
    <elsa-form-group :label="$t('valitse-oma-yliopistosi')" :required="true">
      <template v-slot="{ uid }">
        <elsa-form-multiselect
          :id="uid"
          v-model="value.yliopisto"
          :options="yliopistot"
          label="name"
          track-by="name"
        ></elsa-form-multiselect>
      </template>
    </elsa-form-group>
    <div class="text-right">
      <elsa-button variant="back" @click="logout()">{{ $t('kirjaudu-ulos') }}</elsa-button>
      <elsa-button type="submit" :disabled="!value.yliopisto" variant="primary" class="ml-2">
        {{ $t('jatka-eteenpain') }}
      </elsa-button>
    </div>
  </b-form>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import store from '@/store'
  import UserAvatar from '@/components/user-avatar/user-avatar.vue'
  import ElsaFormGroup from '@/components/form-group/form-group.vue'
  import ElsaFormMultiselect from '@/components/multiselect/multiselect.vue'
  import ElsaButton from '@/components/button/button.vue'
  import { yliopistot } from '@/utils/constants'

  @Component({
    components: {
      ElsaFormGroup,
      ElsaFormMultiselect,
      UserAvatar,
      ElsaButton
    }
  })
  export default class KayttooikeusForm extends Vue {
    value = {
      yliopisto: null
    } as any

    get yliopistot() {
      return yliopistot
    }

    async logout() {
      await store.dispatch('auth/logout')
    }

    onSubmit() {
      this.$emit('submit', {
        yliopisto: this.value.yliopisto?.value.toString()
      })
    }
  }
</script>
