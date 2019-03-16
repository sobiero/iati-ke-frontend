import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import HighchartsVue from 'highcharts-vue';

import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';
stockInit(Highcharts);

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

import * as Vue2Leaflet from 'vue2-leaflet';
import vueNumeralFilterInstaller from 'vue-numeral-filter';

import App from './App.vue';
import router from './router/router';
import store from './store/store';
import './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'leaflet/dist/leaflet.css';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faChartPie, faChartBar, faTable } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faChartPie, faChartBar, faTable)

Vue.component('fa-icon', FontAwesomeIcon);

Vue.use(BootstrapVue);
Vue.use(HighchartsVue);
Vue.use(vueNumeralFilterInstaller);
Vue.config.productionTip = false;

import _ from 'lodash';
Object.defineProperty(Vue.prototype, '$_', { value: _ });
import axios from 'axios';
Object.defineProperty(Vue.prototype, '$axios', { value: axios });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
