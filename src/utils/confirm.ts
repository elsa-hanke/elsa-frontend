import { Vue } from 'vue-property-decorator'

export async function confirmExit(vue: Vue) {
  return vue.$bvModal.msgBoxConfirm(vue.$t('tallentamattomia-tietoja-vahvistus') as string, {
    title: vue.$t('vahvista-poistuminen-tallentamatta') as string,
    okVariant: 'outline-danger',
    okTitle: vue.$t('poistu-tallentamatta') as string,
    cancelTitle: vue.$t('peruuta') as string,
    cancelVariant: 'back',
    hideHeaderClose: false,
    centered: true
  })
}

export async function confirmDelete(vue: Vue, title: string, name: string) {
  return vue.$bvModal.msgBoxConfirm(vue.$t('haluatko-varmasti-poistaa', { name }) as string, {
    title,
    okVariant: 'outline-danger',
    okTitle: vue.$t('poista') as string,
    cancelTitle: vue.$t('peruuta') as string,
    cancelVariant: 'back',
    hideHeaderClose: false,
    centered: true
  })
}
