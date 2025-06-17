<template>
  <div v-if="kysymys !== null">
    <b-form-row v-if="kysymys.tyyppi === arviointityokaluKysymysTyyppit.TEKSTIKENTTAKYSYMYS">
      <div class="col-sm-12 col-md-12 mb-4">
        <h5>{{ kysymys.otsikko }}</h5>
        <p class="mt-1 mb-0">{{ selectedAnswer }}</p>
      </div>
    </b-form-row>
    <b-form-row v-else>
      <div class="col-sm-12 col-md-12 mb-4">
        <h5>{{ kysymys.otsikko }}</h5>
        <div class="mt-1">
          <div
            v-for="(vaihtoehto, index) in kysymys.vaihtoehdot"
            :key="index"
            class="d-flex align-items-center option-row mb-2"
          >
            <div class="icon-container">
              <font-awesome-icon
                v-if="selectedAnswer === vaihtoehto.id"
                :icon="['fas', 'check-circle']"
                fixed-width
                size="lg"
                class="text-darker-success"
              />
            </div>
            <p v-if="selectedAnswer === vaihtoehto.id" class="mb-0 font-weight-400">
              {{ vaihtoehto.teksti }}
            </p>
            <p v-else class="mb-0 font-weight-400 text-muted">{{ vaihtoehto.teksti }}</p>
          </div>
        </div>
      </div>
    </b-form-row>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import { Vue, Prop } from 'vue-property-decorator'

  import { ArviointityokaluKysymys, SuoritusarviointiArviointityokaluVastaus } from '@/types'
  import {
    ArviointityokaluKysymysTyyppi,
    ArviointityokaluKysymysVaihtoehtoTyyppi
  } from '@/utils/constants'

  @Component
  export default class ArviointityokaluKysymysVastausNaytto extends Vue {
    @Prop({ type: Object, required: true })
    kysymys!: ArviointityokaluKysymys

    @Prop({ type: Object, default: null })
    vastaus!: SuoritusarviointiArviointityokaluVastaus | null

    selectedAnswer: string | number | null = null
    tekstiVastaus: string | null = null

    mounted() {
      if (this.vastaus) {
        this.selectedAnswer = this.vastaus.valittuVaihtoehtoId || this.vastaus.tekstiVastaus || null
      }
      if (this.vastaus?.tekstiVastaus) {
        this.tekstiVastaus = this.vastaus.tekstiVastaus
      }
    }

    get arviointityokaluKysymysTyyppit() {
      return ArviointityokaluKysymysTyyppi
    }

    get arviointityokaluKysymysVaihtoehtoTyyppi() {
      return ArviointityokaluKysymysVaihtoehtoTyyppi
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/variables';
  @import '~bootstrap/scss/mixins/breakpoints';

  .option-row {
    display: flex;
    align-items: center;
  }

  .icon-container {
    width: 30px;
    display: flex;
    justify-content: left;
  }

  .text-darker-success {
    color: #03760e;
  }
</style>
