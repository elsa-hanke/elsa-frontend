<template>
  <div class="lisaa-suoritemerkinta">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("lisaa-suoritemerkinta") }}</h1>
          <hr />
          <suoritemerkinta-form
            v-if="!loading"
            @submit="onSubmit"
            :tyoskentelyjaksot="tyoskentelyjaksot"
            :oppimistavoitteen-kategoriat="oppimistavoitteenKategoriat"
          />
          <div class="text-center" v-else>
            <b-spinner variant="primary" :label="$t('ladataan')"></b-spinner>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Mixins } from "vue-property-decorator";
import ConfirmRouteExit from "@/mixins/confirm-route-exit";
import SuoritemerkintaForm from "@/forms/suoritemerkinta-form.vue";
import { SuoritemerkintaLomake } from "@/types";
import { toastFail, toastSuccess } from "@/utils/toast";

@Component({
  components: {
    SuoritemerkintaForm
  }
})
export default class UusiSuoritemerkinta extends Mixins(ConfirmRouteExit) {
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("suoritemerkinnat"),
      to: { name: "suoritemerkinnat" }
    },
    {
      text: this.$t("lisaa-suoritemerkinta"),
      active: true
    }
  ];
  suoritemerkintaLomake: null | SuoritemerkintaLomake = null;
  suoritemerkinta: any = null;
  loading = true;

  async mounted() {
    await this.fetchLomake();
    this.loading = false;
  }

  async fetchLomake() {
    try {
      this.suoritemerkintaLomake = (
        await axios.get(`erikoistuva-laakari/suoritemerkinta-lomake`)
      ).data;
    } catch (err) {
      toastFail(
        this,
        this.$t("suoritemerkinnan-lomakkeen-hakeminen-epaonnistui")
      );
    }
  }

  async onSubmit(value: any) {
    try {
      this.suoritemerkinta = (
        await axios.post("erikoistuva-laakari/suoritemerkinnat", value)
      ).data;
      toastSuccess(this, this.$t("suoritusmerkinta-lisatty-onnistuneesti"));
      this.skipRouteExitConfirm = true;
      this.$router.push({
        name: "suoritemerkinta",
        params: {
          suoritemerkintaId: `${this.suoritemerkinta.id}`
        }
      });
    } catch (err) {
      toastFail(this, this.$t("uuden-suoritemerkinnan-lisaaminen-epaonnistui"));
    }
  }

  get tyoskentelyjaksot() {
    if (this.suoritemerkintaLomake) {
      return this.suoritemerkintaLomake.tyoskentelyjaksot;
    } else {
      return [];
    }
  }

  get oppimistavoitteenKategoriat() {
    if (this.suoritemerkintaLomake) {
      return this.suoritemerkintaLomake.oppimistavoitteenKategoriat;
    } else {
      return [];
    }
  }
}
</script>

<style lang="scss" scoped>
.lisaa-suoritemerkinta {
  max-width: 970px;
}
</style>