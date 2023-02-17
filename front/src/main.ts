import { createApp } from 'vue'
import { createPinia } from 'pinia'
import BaseButton from './components/base/BaseButton.vue'
import BaseIcon from './components/base/BaseIcon.vue'
import BaseInput from './components/base/BaseInput.vue'
import BaseTitle from './components/base/BaseTitle.vue'
import BaseTable from "@/components/base/BaseTable.vue"
import BaseTableWithFilter from "@/components/base/BaseTableWithFilter.vue"
import BaseTableStatut from "@/components/base/BaseTableStatut.vue"
import BaseSelectedCard from "@/components/base/BaseSelectedCard.vue"
import BaseSelect from "@/components/base/BaseSelect.vue"
import helpers from './helpers/index'

import App from './App.vue'
import router from './router'

import './assets/main.css'


const app = createApp(App)

app.component('BaseInput',BaseInput)
app.component('BaseButton',BaseButton)
app.component('BaseIcon',BaseIcon)
app.component('BaseTitle',BaseTitle)
app.component('BaseTable', BaseTable)
app.component('BaseTableWithFilter',BaseTableWithFilter)
app.component('BaseTableStatut',BaseTableStatut)
app.component('BaseSelectedCard',BaseSelectedCard)
app.component('BaseSelect',BaseSelect)

app.use(createPinia())
app.use(router)
app.use(helpers)

app.mount('#app')
