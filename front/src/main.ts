import { createApp } from "vue";
import { createPinia } from "pinia";
import BaseButton from "./components/base/BaseButton.vue";
import BaseIcon from "./components/base/BaseIcon.vue";
import BaseInput from "./components/base/BaseInput.vue";
import BaseTitle from "./components/base/BaseTitle.vue";
import BaseTable from "@/components/base/BaseTable.vue";
import BaseTableWithFilter from "@/components/base/BaseTableWithFilter.vue";
import BaseTableStatut from "@/components/base/BaseTableStatut.vue";
import BaseSelectedCard from "@/components/base/BaseSelectedCard.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import helpers from "./helpers/index";
import customsValidations from "./plugins/vee-validate/customs-validations";
import BaseBottomModal from "@/components/base/BaseBottomModal.vue";
import BaseModal from "./components/base/BaseModal.vue";
import BaseTabs from "./components/base/BaseTabs.vue";
import Toast from "vue-toastification";
import BaseGoBack from "./components/base/BaseGoBack.vue";
import BaseDateRange from "@/components/base/BaseDateRange.vue";
import "vue-toastification/dist/index.css";
import VueApexCharts from "vue3-apexcharts";

import VCalendar from "v-calendar";
import "v-calendar/dist/style.css";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

import AllRules from "@vee-validate/rules";
import { defineRule, configure } from "vee-validate";
import { localize } from "@vee-validate/i18n";
import './locales';
import BaseRightModal from "@/components/base/BaseRightModal.vue";
import HistoryTrackingList from "@/components/HistoryTrackingList.vue";
import BaseActions from "@/components/base/BaseActions.vue";
import VPanel from "@/components/VPanel.vue";
import HistoryStockList from "@/components/HistoryStockList.vue";
// import HistoryStock from "@/components/HistoryStock.vue";

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});

configure({
  // Generates an English message locale generator
  generateMessage: localize("fr", {
    messages: {
      required: "Ce champs est réquis",
      email: "Adresse mail invalide",
    },
  }),
});



const app = createApp(App);

app.component("BaseInput", BaseInput);
app.component("BaseButton", BaseButton);
app.component("BaseIcon", BaseIcon);
app.component("BaseTitle", BaseTitle);
app.component("BaseTable", BaseTable);
app.component("BaseTableWithFilter", BaseTableWithFilter);
app.component("BaseTableStatut", BaseTableStatut);
app.component("BaseSelectedCard", BaseSelectedCard);
app.component("BaseSelect", BaseSelect);
app.component("BaseBottomModal", BaseBottomModal);
app.component("BaseModal", BaseModal);
app.component("BaseTabs", BaseTabs);
app.component("BaseGoBack", BaseGoBack);
app.component("BaseDateRange", BaseDateRange);
app.component("BaseRightModal", BaseRightModal);
app.component("HistoryTrackingList", HistoryTrackingList);
app.component("BaseActions", BaseActions);
app.component("VPanel", VPanel);
// app.component("HistoryStock", HistoryStock);
app.component("HistoryStockList", HistoryStockList);


app.use(createPinia());
app.use(router);
app.use(Toast, {});
app.use(VCalendar, {});
app.use(VueApexCharts);

app.mount("#app");
