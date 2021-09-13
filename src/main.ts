import 'mutationobserver-shim'
import '@/plugins/registerComponentHooks'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import '@/plugins/composition-api'
import '@/plugins/filters'
import '@/plugins/bootstrap-vue'
import '@/plugins/date'
import '@/plugins/apexcharts'
import i18n from '@/plugins/i18n'
import '@/plugins/fontawesome'
import '@/plugins/roles'
import App from '@/app.vue'
import router from '@/router'
import store from '@/store'
import VueScreen from 'vue-screen'

import '@/styles/app.scss'

Vue.use(Vuelidate)
Vue.use(VueScreen, {
  xs: 0,
  sm: 480,
  md: 768,
  mobile: (screen: any) => screen.xs && !screen.sm
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
