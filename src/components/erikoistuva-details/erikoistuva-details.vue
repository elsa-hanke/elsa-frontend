<template>
  <div class="table-responsive">
    <table
      class="table table-borderless border-0 table-sm erikoistuva-details-table"
      :summary="$t('henkilotiedot')"
    >
      <tr class="sr-only">
        <th scope="col">{{ $t('kentta') }}</th>
        <th scope="col">{{ $t('arvo') }}</th>
      </tr>
      <tr>
        <th scope="row" style="width: 12rem" class="align-middle font-weight-500">
          {{ $t('erikoistuva') }}
        </th>
        <td class="pl-6">
          <user-avatar
            :src-base64="avatar"
            src-content-type="image/jpeg"
            :display-name="displayName"
          >
            <template #display-name>
              {{ displayNameAndErikoisala }}
            </template>
          </user-avatar>
        </td>
      </tr>
      <tr v-if="opiskelijatunnus">
        <th scope="row" class="font-weight-500">
          {{ $t('opiskelijanumero') }}
        </th>
        <td class="pl-6">{{ opiskelijatunnus }}</td>
      </tr>
      <tr v-if="showBirthdate && syntymaaika">
        <th scope="row" class="font-weight-500">
          {{ $t('syntymaaika') }}
        </th>
        <td class="pl-6">{{ syntymaaika ? $date(syntymaaika) : '' }}</td>
      </tr>
      <tr>
        <th scope="row" class="font-weight-500">
          {{ $t('yliopisto') }}
        </th>
        <td class="pl-6">{{ $t(`yliopisto-nimi.${yliopisto}`) }}</td>
      </tr>
      <tr v-if="kehittamistoimenpiteet">
        <th scope="row" class="font-weight-500">
          {{ $t('kehittamistoimenpiteet-otsikko') }}
        </th>
        <td class="pl-6">{{ kehittamistoimenpiteet }}</td>
      </tr>
    </table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'

  import UserAvatar from '@/components/user-avatar/user-avatar.vue'

  @Component({
    components: {
      UserAvatar
    }
  })
  export default class ErikoistuvaDetails extends Vue {
    @Prop({ required: false, type: String })
    avatar!: string

    @Prop({ required: true, type: String })
    name!: string

    @Prop({ required: true, type: String })
    erikoisala!: string

    @Prop({ required: true, type: String })
    opiskelijatunnus!: string

    @Prop({ required: false, type: String })
    syntymaaika?: string

    @Prop({ required: true, type: String })
    yliopisto!: string

    @Prop({ required: false, type: String })
    kehittamistoimenpiteet?: string

    @Prop({ required: false, default: true })
    showBirthdate!: boolean

    get displayName() {
      return this.name
    }

    get displayNameAndErikoisala() {
      return this.erikoisala !== '' ? `${this.displayName}, ${this.erikoisala}` : this.displayName
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  ::v-deep {
    @include media-breakpoint-down(xs) {
      .erikoistuva-details-table {
        th {
          padding-left: 0;
        }
        tr {
          margin-top: 0.5rem !important;
        }
        tr,
        td {
          display: block;
          padding-left: 0 !important;
        }
      }
    }
  }
</style>
