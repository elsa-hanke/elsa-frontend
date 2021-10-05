import { Component, Vue } from 'vue-property-decorator'

import { confirmExit } from '@/utils/confirm'

Component.registerHooks(['beforeRouteLeave'])

@Component({})
export default class ConfirmRouteExit extends Vue {
  skipRouteExitConfirm = false

  created() {
    window.addEventListener('beforeunload', this.beforeWindowUnload)
  }

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.beforeWindowUnload)
  }

  beforeWindowUnload(e: BeforeUnloadEvent) {
    if (!this.skipRouteExitConfirm) {
      e.preventDefault()
      e.returnValue = ''
    }
  }

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
