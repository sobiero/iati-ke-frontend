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
                  <b-form-select size="sm" v-model="form.selTrxnType" :options="selOptions.trxnType" @change="loadDateRange"> </b-form-select>
                </b-form-group>
                </div>

                <div class="col-md-3">
                <b-form-group
                  label-cols-sm="3"
                  label="County:"
                  label-align-sm="right"
                  label-for="nestedStreet"
                >
                  <b-form-select size="sm" v-model="form.selCounty" :options="selOptions.county" @change="loadDateRange"> </b-form-select>
                </b-form-group>
                </div>

                <div class="col-md-3">
                <b-form-group
                  label-cols-sm="2"
                  label="SDG:"
                  label-align-sm="right"
                  label-for="nestedStreet"
                >
                  <b-form-select size="sm" v-model="form.selSdg" :options="selOptions.sdg" @change="loadDateRange"> </b-form-select>
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
                     @change="loadDashBoardData"
                  >
                  </b-form-select>
                  &nbsp;to&nbsp;
                  <b-form-select size="sm"
                     v-model="form.selDateRange.to"
                     style="max-width:85px;"
                     :options="selOptions.dateRange.to"
                     @change="loadDashBoardData"
                  >
                  </b-form-select>
                </b-form-group>

                </div>

               <div class="row ml-2" style="width:100%;margin-top:-25px;margin-bottom:-5px">
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

           <dashboard-map :dash-params="form" :sel-options="selOptions" :labels="labels" :county-data="dashboard.kpiAndPanel.totalAmtByCounty"
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
      apiUrl: 'http://iati-ke.webserver.net/api',

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

    dashboardHeader() {
      let tmp = {}; let trxTypeTxt = ''; let ctyText = ''; let sdgText = ''; let
        yrRangeTxt = '';

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
        sdgText = ` for SDG number ${this.form.selSdg}: ${sdgText}, `;
      }

      if (!this.form.selDateRange.from) {
        yrRangeTxt = '<em>:No data</em> ';
      } else {
        yrRangeTxt = ` from ${this.form.selDateRange.from} to ${this.form.selDateRange.to}`;
      }

      return `${trxTypeTxt + ctyText + sdgText + yrRangeTxt} in ${this.form.currency}`;
    },

  },

  methods: {

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
            tmp.push({ value: v.id, text: v.sdg_name });
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
            tmp.push({ value: { new: v.code, old: v.old_code }, text: v.name });
          });
          this.selOptions.trxnType = tmp;
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },

    loadDateRange() {
      this.resetPanels();

      this.$axios.get(`${this.apiUrl}/iati/date-range`, { params: { params: this.form } })
        .then((res) => {
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

            this.loadDashBoardData();
          } else {
            this.form.selDateRange.from = null;
            this.form.selDateRange.to = null;

            this.selOptions.dateRange.from = tmp;
            this.selOptions.dateRange.to = tmp;
          }
        })
        .catch((e) => {
          this.errors.push(e);
        });
    },

    loadDashBoardData() {
      const vm = this;
      this.resetPanels();

      this.$axios.get(`${this.apiUrl}/iati/dashboard-data`, { params: { params: this.form } })
        .then((res) => {
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

  },

  created() {
    this.loadCounty();
    this.loadSdg();
    this.loadTrxnType();
    this.loadDateRange();
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
</style>
