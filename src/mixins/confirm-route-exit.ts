import { Component, Vue } from 'vue-property-decorator'

import { confirmExit } from '@/utils/confirm'

Component.registerHooks(['beforeRouteLeave'])

@Component({})
export default class ConfirmRouteExit extends Vue {
  skipRouteExitConfirm = false
  async beforeRouteLeave(to: any, from: any, next: any) {
    try {
      if (this.skipRouteExitConfirm || (await confirmExit(this))) {
        next()
      } else {
        next(false)
      }
    } catch (err) {
      next(false)
    }
  }
}
