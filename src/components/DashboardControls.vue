<template>
  <div class="mt-3">

      <!-- <nav class=" "> -->

         <nav class="navbar row sticky-top border ml-2 mr-2" style="background-color:white;padding-top:12px;">

                <div class="col-md-3">
                <b-form-group
                  label-cols-sm="4"
                  label="Transaction:"
                  label-align-sm="right"
                  label-for="nestedStreet"
                >

                  <b-form-select style="width:85%" size="sm" v-model="form.selTrxnType" :options="selOptions.trxnType" @change="logSelectChange('trxn')"> </b-form-select>

                  <b-link class="no-deco" style="display:inline-block;float:right" id="trxn-info">
                     <fa-icon  class="text-info" icon="info-circle"></fa-icon>
                     <b-tooltip target="trxn-info">{{selTrxnDesc}}</b-tooltip>
                  </b-link>

                </b-form-group>
                </div>

                <div class="col-md-3">
                <b-form-group
                  label-cols-sm="3"
                  label="County:"
                  label-align-sm="right"
                  label-for="nestedStreet"
                >
                  <b-form-select size="sm" v-model="form.selCounty" :options="selOptions.county" @change="logSelectChange('county')"> </b-form-select>
                </b-form-group>
                </div>

                <div class="col-md-3">
                <b-form-group
                  label-cols-sm="2"
                  label="SDG:"
                  label-align-sm="right"
                  label-for="nestedStreet"
                >
                  <b-form-select size="sm" v-model="form.selSdg" :options="selOptions.sdg" @change="logSelectChange('sdg')"> </b-form-select>
                </b-form-group>
                </div>

                <div class="col-md-3">
                 <b-form-group
                  label-cols-sm="2"
                  label="From:"
                  label-align-sm="right"
                  label-for="nestedStreet"
                  >
                  <b-form-select size="sm"
                     v-model="form.selDateRange.from"
                     style="max-width:85px;"
                     :options="selOptions.dateRange.from"
                     @change="loadDashBoardData('date-from')"
                  >
                  </b-form-select>
                  &nbsp;to&nbsp;
                  <b-form-select size="sm"
                     v-model="form.selDateRange.to"
                     style="max-width:85px;"
                     :options="selOptions.dateRange.to"
                     @change="loadDashBoardData('date-to')"
                  >
                  </b-form-select>
                </b-form-group>

                </div>

               <div class="row ml-2" style="width:100%;margin-top:-35px;margin-bottom:-5px">
                <div class="col-md-12 text-center">
                    <hr />
                    <h5 v-html="dashboardHeader"></h5>
                </div>
               </div>

          </nav>

      <!-- </nav> -->

    <dashboard-kpis :dash-params="form" :sel-options="selOptions" :labels="labels" :currency="form.currency" :data="dashboard.kpiAndPanel" class="mt-2"></dashboard-kpis>


    <div class="row ml-n2 mr-n2 mt-2">

        <div class="col-md-7">

           <dashboard-map @countyClicked="onCountyClicked" :dash-params="form" :sel-options="selOptions" :labels="labels" :county-data="dashboard.kpiAndPanel.totalAmtByCounty"
           :county-location-data="dashboard.countyLocationData" class="mt-2"></dashboard-map>

        </div>

        <div class="col-md-5">
            <dashboard-user-pane :dash-params="form" :sel-options="selOptions" :labels="labels" :data="dashboard.kpiAndPanel" class="mt-2"></dashboard-user-pane>
        </div>

    </div>

    <dashboard-trend :dash-params="form" :sel-options="selOptions" :labels="labels" :data="dashboard.totalAmtByTimeStamp" class="mt-2"></dashboard-trend>

 </div>
</template>

<script>

import DashboardKpis from '@/components/DashboardKpis.vue';
import DashboardTrend from '@/components/DashboardTrend.vue';
import DashboardMap from '@/components/DashboardMap.vue';
import DashboardUserPane from '@/components/DashboardUserPane.vue';
import EventBus from '../eventBus';

import _ from 'lodash';

export default {
  name: 'DashboardControls',

  components: {
    DashboardKpis,
    DashboardTrend,
    DashboardMap,
    DashboardUserPane,
  },

  data() {
    return {
      apiUrl: '/api',

      dashboardHeader: '',

      form: {
        selCounty: '000',
        selSdg: 0,
        selTrxnType: { new: '4', old: 'E' },
        selDateRange: {
          from: null,
          to: null,
        },
        currency: 'USD',
      },

      labels: {
        selCounty: '',
        selSdg: '',
        selTrxnType: '',
      },

      selOptions: {
        county: [],
        sdg: [],
        trxnType: [],
        dateRange: {
          from: [],
          to: [],
        },
      },

      dashboard: {
        kpiAndPanel: {
          totalAmt: null,
          totalAmtByYear: [],
          totalAmtByPublisher: [],
          totalAmtBySdg: [],
          totalAmtByCounty: [],
        },
        totalAmtByYearMonth: {},
        totalAmtByTimeStamp: [],
        countyLocationData: [],

      },

      errors: [],
    };
  },

  computed: {

    selTrxnDesc() {
      let tmp = {}; let trxTypeDesc = '';
      tmp = _.find(this.selOptions.trxnType, { value: this.form.selTrxnType });
      trxTypeDesc = tmp ? `${tmp.text}: ${tmp.description}` : '';
      return trxTypeDesc;
    },

    /*
    dashboardHeader() {


    }, */

  },

  methods: {

    generateHeader() {
      let tmp = {}; let trxTypeTxt = ''; let ctyText = ''; let sdgText = ''; let
        yrRangeTxt = '';

      const cur = this.form.currency;

      tmp = _.find(this.selOptions.trxnType, { value: this.form.selTrxnType });
      trxTypeTxt = tmp && tmp.text ? tmp.text : '';
      this.labels.selTrxnType = trxTypeTxt;

      tmp = _.find(this.selOptions.county, { value: this.form.selCounty });
      ctyText = tmp && tmp.text ? tmp.text : '';
      this.labels.selCounty = ctyText;

      tmp = _.find(this.selOptions.sdg, { value: this.form.selSdg });
      sdgText = tmp && tmp.text ? tmp.text : '';
      this.labels.selSdg = sdgText;

      if (this.form.selCounty == '000') {
        ctyText = ' across the counties ';
      } else {
        ctyText = ` for ${ctyText} county `;
      }

      if (this.form.selSdg == 0) {
        sdgText = ' for all the SDGs, ';
      } else {
        // sdgText = ` for SDG number ${this.form.selSdg}: ${sdgText}, `;
        sdgText = ` for SDG ${sdgText}, `;
      }

      if (!this.form.selDateRange.from) {
        yrRangeTxt = '<em>:No data</em> ';
      } else {
        yrRangeTxt = ` from ${this.form.selDateRange.from} to ${this.form.selDateRange.to}`;
      }

      const appendCry = this.form.selDateRange.from == false ? '' : cur;

      this.dashboardHeader = `${trxTypeTxt + ctyText + sdgText + yrRangeTxt} in ${appendCry}`;
    },

    loadCounty() {
      const vm = this;

      this.$axios.get(`${this.apiUrl}/iati/county`)
        .then((res) => {
          const tmp = [];
          tmp.push({ value: '000', text: 'All counties' });
          this.$_.forOwn(res.data.data, (v, k) => {
            tmp.push({ value: v.code, text: v.name });
          });
          this.selOptions.county = tmp;
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },

    loadSdg() {
      this.$axios.get(`${this.apiUrl}/iati/sdg`)
        .then((res) => {
          const tmp = [];
          this.$_.forOwn(res.data.data, (v, k) => {
            const append_sdg = v.id == 0 ? '' : `${v.id} - `;
            tmp.push({ value: v.id, text: append_sdg + v.sdg_name });
          });
          this.selOptions.sdg = tmp;
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },

    loadTrxnType() {
      this.$axios.get(`${this.apiUrl}/iati/trans-type`)
        .then((res) => {
          const tmp = [];
          this.$_.forOwn(res.data.data, (v, k) => {
            tmp.push({ value: { new: v.code, old: v.old_code }, text: v.name, description: v.description });
          });
          this.selOptions.trxnType = tmp;
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },

    loadDateRange() {
      this.resetPanels();

      EventBus.$emit('xhr-dashboard', 'req');
      EventBus.$emit('xhr-daterange', 'req');

      this.$axios.get(`${this.apiUrl}/iati/date-range`, { params: { params: this.form } })
        .then((res) => {
          EventBus.$emit('xhr-dashboard', 'res');
          EventBus.$emit('xhr-daterange', 'res');

          const tmp = [];

          if (!this.$_.isNil(res.data.data[0])) {
            const min = res.data.data[0].trans_date;
            const max = res.data.data[1].trans_date;

            this.form.selDateRange.from = min;
            this.form.selDateRange.to = max;

            for (let y = min; y <= max; y++) {
              tmp.push({ value: y, text: y });
            }

            this.selOptions.dateRange.from = tmp;
            this.selOptions.dateRange.to = tmp;

            EventBus.$emit('xhr-dashboard', 'req');

            this.loadDashBoardData();
          } else {
            this.$bvToast.toast('There is no data for selected parameters!', {
              title: 'Error - No Data',
              variant: 'danger',
              autoHideDelay: 8000,
              solid: true,
            });

            this.form.selDateRange.from = null;
            this.form.selDateRange.to = null;

            this.selOptions.dateRange.from = tmp;
            this.selOptions.dateRange.to = tmp;
          }
        })
        .catch((e) => {
          this.errors.push(e);
        });

      // console.log( this.form.selCounty );
    },

    loadDashBoardData(sel) {
      if (typeof sel !== 'undefined') {
        EventBus.$emit('interaction', {
          name: `select-${sel}`, type: 'select', event: 'change', data: { data: this.form },
        });
      }

      const vm = this;
      this.resetPanels();
      EventBus.$emit('xhr-dashboard', 'req');

      this.$axios.get(`${this.apiUrl}/iati/dashboard-data`, { params: { params: this.form }, headers: { browser_uuid: localStorage.browserId } })
        .then((res) => {
          EventBus.$emit('xhr-dashboard', 'res');

          vm.dashboard.kpiAndPanel.totalAmt = res.data.data.totalAmt[0] ? res.data.data.totalAmt[0] : null;
          vm.dashboard.kpiAndPanel.totalAmtByYear = res.data.data.totalAmtByYear;
          vm.dashboard.kpiAndPanel.totalAmtByPublisher = res.data.data.totalAmtByPublisher;
          vm.dashboard.kpiAndPanel.totalAmtBySdg = res.data.data.totalAmtBySdg;
          vm.dashboard.kpiAndPanel.totalAmtByCounty = res.data.data.totalAmtByCounty;
          vm.dashboard.totalAmtByYearMonth = res.data.data.totalAmtByYearMonth;
          vm.dashboard.totalAmtByTimeStamp = res.data.data.totalAmtByTimeStamp;
          vm.dashboard.kpiAndPanel.summaryByTrxnType = res.data.data.summaryByTrxnType;
        })
        .catch((e) => {
          this.errors.push(e);
        });

      if (this.form.selCounty != '000') {
        this.$axios.get(`${this.apiUrl}/iati/county-location-data`, { params: { params: this.form } })
          .then((res) => {
            vm.dashboard.countyLocationData = res.data.data;
          })
          .catch((e) => {
            this.errors.push(e);
          });
      }
    },

    resetPanels() {
      this.dashboard.kpiAndPanel.totalAmt = {};
      this.dashboard.kpiAndPanel.totalAmtByYear = {};
      this.dashboard.kpiAndPanel.totalAmtByPublisher = {};
      this.dashboard.kpiAndPanel.totalAmtBySdg = {};
      this.dashboard.kpiAndPanel.totalAmtByCounty = [];
      this.dashboard.totalAmtByYearMonth = {};
      this.dashboard.totalAmtByTimeStamp = [];
      this.dashboard.kpiAndPanel.summaryByTrxnType = {};
    },

    logSelectChange(sel) {
      EventBus.$emit('interaction', {
        name: `select-${sel}`, type: 'select', event: 'change', data: { data: this.form },
      });
    },

    onCountyClicked(value) {
      console.log(value);
    },


    logInteractionData(data) {
      this.postLogInteractionData(data, this);
    },

    postLogInteractionData: _.debounce((data, vm) => {
      data.extras = {};
      data.extras.dashboardParams = vm.form;
      data.extras.browserId = localStorage.browserId;
      data.extras.userPref = {};

      if (typeof localStorage.prefs !== 'undefined' && typeof (JSON.parse(localStorage.prefs)) === 'object') {
        data.extras.userPref = JSON.parse(localStorage.prefs);
      }

      vm.$axios.post(`${vm.apiUrl}/user/interactions`, { params: data })
        .then((res) => {

        })
        .catch((e) => {
          // vm.errors.push(e);
        });
    }, 800),

  },

  created() {
    this.loadCounty();
    this.loadSdg();
    this.loadTrxnType();
    this.loadDateRange();
  },

  mounted() {
    this.$root.$on('bv::tooltip::show', (bvEvent) => {
      // console.log('bvEvent:', bvEvent.target.attributes.id.nodeValue)

      const tool = bvEvent.target.attributes.id.nodeValue;
      EventBus.$emit('interaction', {
        name: `tooltip-${tool}`, type: 'tooltip', event: 'hover', data: { },
      });

      this.logInteractionData({
        name: `tooltip-${tool}`, type: 'tooltip', event: 'hover', data: { },
      });
    });

    EventBus.$on('countyClicked', (payload) => {
      const clickedCountyCode = this.$_.padStart(payload, 3, '0');
      this.form.selCounty = clickedCountyCode;
    });

    EventBus.$on('sdgClicked', (payload) => {
      const clickedSdg = payload;
      this.form.selSdg = clickedSdg;
    });

    EventBus.$on('trxnTypeClicked', (payload) => {
      const clickedTrxnType = payload;
      this.form.selTrxnType = clickedTrxnType;
    });

    EventBus.$on('exRate', (payload) => {
      this.form.currency = payload.cur;
    });


    EventBus.$on('interaction', (payload) => {
      this.logInteractionData(payload);
    });
  },

  watch: {

    'form.selCounty': function () {
      this.loadDateRange();
      this.generateHeader();
    },

    'form.selTrxnType': function () {
      this.loadDateRange();
      this.generateHeader();
    },

    'form.selSdg': function () {
      this.loadDateRange();
      this.generateHeader();
    },

    'form.selDateRange.from': function () {
      // this.loadDateRange();
      this.generateHeader();
    },

    'form.selDateRange.to': function () {
      // this.loadDateRange();
      this.generateHeader();
    },

    'form.currency': function () {
      this.generateHeader();
    },


  },


};
</script>

<style scoped lang="scss">

@media (max-width: 767px) {
  body {
  padding-top: 0px !important;
  }
  .sticky-top {
  position: initial !important;
  }
}

a.no-deco, a.no-deco:hover {
  text-decoration:none;
}

.navbar select {
  font-size:0.72em;
}
.navbar label {
  font-size:0.75em !important;
}

</style>
