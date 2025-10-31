import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCar, faBolt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import { faSearch, faCalendarCheck, faClipboardCheck, faCarSide } from '@fortawesome/free-solid-svg-icons'

library.add(faSearch, faCalendarCheck, faClipboardCheck, faCarSide)
library.add(faCar, faBolt, faMoneyBillWave)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(router)
app.mount('#app')