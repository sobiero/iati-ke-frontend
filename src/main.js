import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import HighchartsVue from 'highcharts-vue';

import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';

import L from 'leaflet';
import UUID from 'vue-uuid';

import * as Vue2Leaflet from 'vue2-leaflet';
import vueNumeralFilterInstaller from 'vue-numeral-filter';
import VueGoodTablePlugin from 'vue-good-table';
import FlagIcon from 'vue-flag-icon';
import JsonExcel from 'vue-json-excel';
import VueSlider from 'vue-slider-component';
import VueCookieAcceptDecline from 'vue-cookie-accept-decline';
//import VueSlideBar from 'vue-slide-bar'

import './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'leaflet/dist/leaflet.css';
import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css';

import 'vue-good-table/dist/vue-good-table.css';
import 'vue-slider-component/theme/default.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChartPie, faChartBar, faTable, faSpinner, faQuestionCircle, faInfoCircle, faDownload,
} from '@fortawesome/free-solid-svg-icons';

import {
  faGithub, faTwitter, faLinkedin, 
} from '@fortawesome/free-brands-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import _ from 'lodash';
import axios from 'axios';
import store from './store/store';
import router from './router/router';
import App from './App.vue';

stockInit(Highcharts);

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

library.add(faChartPie, faChartBar, faTable, faSpinner, faQuestionCircle, 
faInfoCircle, faDownload, faGithub, faTwitter, faLinkedin );

Vue.component('fa-icon', FontAwesomeIcon);
Vue.component('downloadExcel', JsonExcel);
Vue.component('VueSlider', VueSlider);
Vue.component('vue-cookie-accept-decline', VueCookieAcceptDecline)
//Vue.component('vue-slide-bar', VueSlideBar);

Vue.use(BootstrapVue);
Vue.use(HighchartsVue);
Vue.use(vueNumeralFilterInstaller);
Vue.use(VueGoodTablePlugin);
Vue.use(UUID);
Vue.use(FlagIcon);

Vue.config.productionTip = false;
Object.defineProperty(Vue.prototype, '$_', { value: _ });
Object.defineProperty(Vue.prototype, '$axios', { value: axios });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
