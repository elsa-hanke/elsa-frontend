<template>
  <div class="koejakso-view">
    <b-breadcrumb :items="items" class="mb-0 px-0"></b-breadcrumb>
    <b-container fluid>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("koejakso") }}</h1>
          <p>
            {{ $t("koejakso-kuvaus") }}
            <b-link :to="{ name: 'koejakso-yleiset-tavoitteet' }">{{
              $t("koejakso-tavoitteet-linkki")
            }}</b-link>
          </p>
        </b-col>
      </b-row>
      <b-row lg>
        <b-col class="px-0">
          <div
            class="d-flex justify-content-center border rounded pt-3 pb-3 mb-4"
          >
            <div class="container-fluid">
              <h2>{{ $t("koejakson-suorituspaikka") }}</h2>
              <p>{{ $t("koejakson-suorituspaikka-kuvaus") }}</p>
              <b-row>
                <b-col cols="9">
                  <b-row>
                    <b-col>{{ $t("tyoskentelyjakso") }}</b-col>
                    <b-col align="end">
                      <p>
                        <font-awesome-icon
                          icon="info-circle"
                          fixed-width
                          class="text-muted"
                        />
                        <b-link> {{ $t("lisaa-tyoskentelyjakso") }}</b-link>
                        {{ $t("jos-et-loyda-alta") }}
                      </p>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="9">
                  <elsa-form-multiselect
                    v-model="selected.tyoskentelyjakso"
                    :options="tyoskentelyjaksotFormatted"
                    label="label"
                    track-by="id"
                    @select="onTyoskentelyjaksoSelect"
                  />
                </b-col>
                <b-col>
                  <elsa-button
                    variant="primary"
                    :to="{ name: 'liita-koejaksoon' }"
                    class="align-self-end"
                  >
                    {{ $t("liita-koejaksoon") }}
                  </elsa-button>
                </b-col>
              </b-row>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row lg>
        <b-col class="px-0">
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>{{ $t("koulutussopimus") }}</h2>
              <p>{{ $t("koulutussopimus-kuvaus") }}</p>
              <elsa-button variant="primary" class="mb-4">
                {{ $t("täytä-koulutussopimus") }}
              </elsa-button>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row lg>
        <b-col class="px-0">
          <h1>{{ $t("koejakson-arviointi") }}</h1>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>
                <span class="form-order">A </span>
                {{ $t("aloituskeskustelu-otsikko") }}
              </h2>
              <p>{{ $t("lomake-ei-täytetty") }}</p>
              <elsa-button
                variant="primary"
                :to="{ name: 'arviointipyynto' }"
                class="mb-4"
              >
                {{ $t("täytä-aloituskeskustelu") }}
              </elsa-button>
            </div>
          </div>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>
                <span class="form-order">B </span>
                {{ $t("väliarviointi-otsikko") }}
              </h2>
              <p>{{ $t("lomake-ei-täytetty") }}</p>
              <elsa-button
                variant="primary"
                :to="{ name: 'arviointipyynto' }"
                class="mb-4"
              >
                {{ $t("pyyda-arviointia") }}
              </elsa-button>
            </div>
          </div>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>
                <span class="form-order">C </span>
                {{ $t("kehittämistoimenpiteet-otsikko") }}
              </h2>
              <p>{{ $t("lomake-ei-täytetty") }}</p>
              <elsa-button
                variant="primary"
                :to="{ name: 'arviointipyynto' }"
                class="mb-4"
              >
                {{ $t("pyyda-arviointia") }}
              </elsa-button>
            </div>
          </div>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>
                <span class="form-order">D </span>
                {{ $t("loppukeskustelu-otsikko") }}
              </h2>
              <p>{{ $t("lomake-ei-täytetty") }}</p>
              <elsa-button
                variant="primary"
                :to="{ name: 'arviointipyynto' }"
                class="mb-4"
              >
                {{ $t("pyyda-arviointia") }}
              </elsa-button>
            </div>
          </div>
          <div class="d-flex justify-content-center border rounded pt-3 mb-4">
            <div class="container-fluid">
              <h2>
                <span class="form-order">E </span>
                {{ $t("koejakson-arvio-otsikko") }}
              </h2>
              <p>{{ $t("lomake-ei-täytetty") }}</p>
              <elsa-button
                variant="primary"
                :to="{ name: 'arviointipyynto' }"
                class="mb-4"
              >
                {{ $t("pyyda-arviointia") }}
              </elsa-button>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import ElsaButton from "@/components/button/button.vue";
import ElsaPopover from "@/components/popover/popover.vue";
import ElsaLuottamuksenTaso from "@/components/luottamuksen-taso/luottamuksen-taso.vue";
import { tyoskentelyjaksoLabel } from "@/utils/tyoskentelyjakso";
import ElsaFormGroup from "@/components/form-group/form-group.vue";
import ElsaFormMultiselect from "@/components/multiselect/multiselect.vue";

@Component({
  components: {
    ElsaButton,
    ElsaPopover,
    ElsaLuottamuksenTaso,
    ElsaFormGroup,
    ElsaFormMultiselect
  }
})
export default class Koejakso extends Vue {
  selected = {
    tyoskentelyjakso: null,
    epaOsaamisalue: null,
    kouluttaja: null
  } as any;
  options = {
    tyoskentelyjaksot: [],
    epaOsaamisalueet: [],
    kouluttajat: []
  } as any;
  items = [
    {
      text: this.$t("etusivu"),
      to: { name: "etusivu" }
    },
    {
      text: this.$t("koejakso"),
      active: true
    }
  ];

  async mounted() {
    console.log("mounted()...");
    const oppimistavoitteet = (
      await axios.get("erikoistuva-laakari/oppimistavoitteet-taulukko")
    ).data;
    console.log(oppimistavoitteet.toString());
  }

  get tyoskentelyjaksotFormatted() {
    console.log("tyoskentelyjaksotFormatted()...");
    return this.options.tyoskentelyjaksot.map((tj: any) => ({
      ...tj,
      label: tyoskentelyjaksoLabel(this, tj)
    }));
  }

  async onTyoskentelyjaksoSelect(selected: any) {
    console.log("onTyoskentelyjaksoSelect()...");
    this.selected.tyoskentelyjakso = selected;
    await this.fetch();
  }

  async fetch(options: any = {}) {
    try {
      const res = (
        await axios.get("erikoistuva-laakari/suoritusarvioinnit", {
          params: {
            ...options,
            sort: "tapahtumanAjankohta,desc",
            "tyoskentelyjaksoId.equals": this.selected.tyoskentelyjakso?.id,
            "arvioitavaOsaalueId.equals": this.selected.epaOsaamisalue?.id,
            "arvioinninAntajaId.equals": this.selected.kouluttaja?.id
          }
        })
      ).data;
      console.log("xxx:" + res.toString());
      //this.kategoriat = this.solveKategoriat();
    } catch (err) {
      //this.omat = [];
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";

.koejakso-view {
  max-width: 1024px;
}

.form-order {
  font-weight: bold;
}
</style>
