import { Component, Mixins, Prop } from 'vue-property-decorator'

import KayttajahallintaMixin from './kayttajahallinta'

import {
  SortByEnum,
  Erikoisala,
  VastuuhenkiloTehtavatyyppi,
  KayttajahallintaRajaimet,
  KayttajahallintaKayttajaListItem,
  Page
} from '@/types'
import { ErikoistuvanSeurantaJarjestys } from '@/utils/constants'
import { sortByAsc } from '@/utils/sort'

@Component({})
export default class KayttajahallintaListMixin extends Mixins(KayttajahallintaMixin) {
  @Prop({ required: true, type: Object })
  rajaimet!: KayttajahallintaRajaimet

  sortFields: SortByEnum[] = [
    {
      name: this.$t('sukunimi-a-o'),
      value: ErikoistuvanSeurantaJarjestys.SUKUNIMI_ASC
    } as SortByEnum,
    {
      name: this.$t('sukunimi-o-a'),
      value: ErikoistuvanSeurantaJarjestys.SUKUNIMI_DESC
    } as SortByEnum
  ]
  sortBy = this.sortFields[0]

  loading = false
  currentPage = 1
  perPage = 20
  debounce?: number
  hakutermi = ''
  filtered: {
    nimi: string | null
    erikoisala: Erikoisala | null
    useaOpintooikeus: boolean
    vastuuhenkilonTehtavatyyppi: VastuuhenkiloTehtavatyyppi | null
    sortBy: string | null
  } = {
    nimi: null,
    erikoisala: null,
    useaOpintooikeus: false,
    vastuuhenkilonTehtavatyyppi: null,
    sortBy: null
  }

  kayttajat: Page<KayttajahallintaKayttajaListItem> | null = null

  get erikoisalatSorted() {
    return this.rajaimet?.erikoisalat.sort((a, b) => sortByAsc(a.nimi, b.nimi))
  }
}
