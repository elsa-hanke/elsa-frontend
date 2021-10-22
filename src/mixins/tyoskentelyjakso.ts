import axios, { AxiosError } from 'axios'
import { Component, Vue, Prop } from 'vue-property-decorator'

import { ElsaError } from '@/types'
import { ErrorKeys } from '@/utils/constants'
import { dateBetween } from '@/utils/date'
import { toastSuccess, toastFail } from '@/utils/toast'
import { tyoskentelyjaksoLabel } from '@/utils/tyoskentelyjakso'

@Component({})
export default class TyoskentelyjaksoMixin extends Vue {
  @Prop({ required: false, default: () => [] })
  tyoskentelyjaksot!: any[]

  form = {
    tyoskentelyjakso: null,
    tapahtumanAjankohta: null
  } as any

  onTyoskentelyjaksoSelect(value: any) {
    if (!dateBetween(this.form.tapahtumanAjankohta, value.alkamispaiva, value.paattymispaiva)) {
      this.form.tapahtumanAjankohta = null
    }
  }

  async onTyoskentelyjaksoSubmit(value: any, params: any, modal: any) {
    params.saving = true
    try {
      const formData = new FormData()
      formData.append('tyoskentelyjaksoJson', JSON.stringify(value.tyoskentelyjakso))
      value.addedFiles.forEach((file: File) => formData.append('files', file, file.name))

      const tyoskentelyjakso = (
        await axios.post('erikoistuva-laakari/tyoskentelyjaksot', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 120000
        })
      ).data

      this.tyoskentelyjaksot.push(tyoskentelyjakso)
      tyoskentelyjakso.label = tyoskentelyjaksoLabel(this, tyoskentelyjakso)
      this.form.tyoskentelyjakso = tyoskentelyjakso
      this.onTyoskentelyjaksoSelect(tyoskentelyjakso)
      modal.hide('confirm')
      toastSuccess(this, this.$t('uusi-tyoskentelyjakso-lisatty'))
    } catch (err) {
      const axiosError = err as AxiosError<ElsaError>
      if (axiosError?.response?.data?.errorKey === ErrorKeys.TYOSKENTELYAIKA) {
        toastFail(
          this,
          `${this.$t('uuden-tyoskentelyjakson-lisaaminen-epaonnistui')}: ${this.$t(
            'tyoskentelyjaksojen-yhteenlaskettu-aika-ylittyy'
          )}`
        )
      } else {
        toastFail(this, this.$t('uuden-tyoskentelyjakson-lisaaminen-epaonnistui'))
      }
    }
    params.saving = false
  }

  get tyoskentelyjaksotFormatted() {
    return this.tyoskentelyjaksot
      .filter((tj) => !tj.hyvaksyttyAiempaanErikoisalaan)
      .map((tj) => ({
        ...tj,
        label: tyoskentelyjaksoLabel(this, tj)
      }))
  }

  get tyoskentelyjaksonAlkamispaiva() {
    return this.form.tyoskentelyjakso?.alkamispaiva
  }

  get tyoskentelyjaksonPaattymispaiva() {
    return this.form.tyoskentelyjakso?.paattymispaiva
  }
}
