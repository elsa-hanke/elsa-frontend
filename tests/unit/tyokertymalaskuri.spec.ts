import { TyokertymaLaskuriTyoskentelyjakso } from '@/types'
import { KaytannonKoulutusTyyppi, PoissaolonSyyTyyppi } from '@/utils/constants'
import { getVahennettavatPaivat } from '@/views/tyokertymalaskuri/tyoskentelyjakson-pituus-counter'

describe('Tyokertymalaskuri', () => {
  it('pitaisi palauttaa oikea maara vahennettavia paivia', () => {
    const tyoskentelyjaksot: TyokertymaLaskuriTyoskentelyjakso[] = [
      {
        id: 1,
        tyoskentelypaikka: { nimi: 'testipaikka', tyyppi: null, muuTyyppi: null },
        alkamispaiva: '2020-01-09',
        paattymispaiva: '2021-12-29',
        kaytannonKoulutus: KaytannonKoulutusTyyppi.MUU_ERIKOISALA,
        osaaikaprosentti: 100,
        kahdenvuodenosaaikaprosentti: 100,
        poissaolot: [
          {
            alkamispaiva: '2020-11-02',
            paattymispaiva: '2021-06-19',
            tyoskentelyjakso: {
              id: -1,
              osaaikaprosentti: 100,
              kahdenvuodenosaaikaprosentti: 100,
              paattymispaiva: '2021-12-29'
            },
            poissaolonSyyId: 0,
            poissaolonSyy: {
              id: 4,
              nimi: 'Äitiysloma, isyysloma, vanhempainvapaa (palkallinen/palkaton), lapsi 1',
              vahennystyyppi: PoissaolonSyyTyyppi.VAHENNETAAN_YLIMENEVA_AIKA_PER_VUOSI,
              vahennetaanKerran: true,
              voimassaolonAlkamispaiva: '2020-08-01',
              voimassaolonPaattymispaiva: null
            },
            tyoskentelyjaksoId: 0,
            kokoTyoajanPoissaolo: true,
            poissaoloprosentti: 100
          },
          {
            alkamispaiva: '2021-07-26',
            paattymispaiva: '2021-09-14',
            tyoskentelyjakso: {
              id: -1,
              osaaikaprosentti: 100,
              kahdenvuodenosaaikaprosentti: 100,
              paattymispaiva: '2021-12-29'
            },
            poissaolonSyyId: 0,
            poissaolonSyy: {
              id: 4,
              nimi: 'Äitiysloma, isyysloma, vanhempainvapaa (palkallinen/palkaton), lapsi 1',
              vahennystyyppi: PoissaolonSyyTyyppi.VAHENNETAAN_YLIMENEVA_AIKA_PER_VUOSI,
              vahennetaanKerran: true,
              voimassaolonAlkamispaiva: '2020-08-01',
              voimassaolonPaattymispaiva: null
            },
            tyoskentelyjaksoId: 0,
            kokoTyoajanPoissaolo: true,
            poissaoloprosentti: 100
          }
        ]
      }
    ]
    const vahennettavat: Map<number, number> = getVahennettavatPaivat(tyoskentelyjaksot)
    expect(vahennettavat.get(1)).toBe(251)
  })
})
