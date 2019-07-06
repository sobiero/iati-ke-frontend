<template>

  <div class="row mr-n2 ml-n2 ">
   <div class="col-md-12 ">

      <b-card header-tag="header" >
        <h6 slot="header" class="mb-0">

           <span v-if="dashboardLoading">
               <fa-icon icon="spinner" pulse> </fa-icon> <span style="font-size:0.9em;"> loading {{labels.selTrxnType.toLowerCase()}} data... </span>
           </span>
           <span v-else>
              <span class="pull-right" style="display:inline-block;">

               <template v-if="labels.selCounty == '' || labels.selCounty == 'All counties'">
                 Line chart showing detailed {{labels.selTrxnType.toLowerCase()}}' data for all the counties
               </template>

               <template v-else>
                  Line chart showing detailed {{labels.selTrxnType.toLowerCase()}}' data for {{labels.selCounty}} county
               </template>

              <download-excel style="display:inline-block;"
                class   = "pull-right"
                :data   = "detailedData"
                :fields = "jsonFields"
                type    = "csv"
                name    = "detailed_transactions_data.csv">

                <span style="display:inline-block; min-width:80px;"></span>

                <b-link class="no-deco" href="#" @click="logIconClick('trend-pane-download')">
                   <fa-icon icon="download" id="trend-pane-download"></fa-icon>
                   <b-tooltip target="trend-pane-download">Download detailed {{labels.selTrxnType.toLowerCase()}} data as CSV</b-tooltip>
                </b-link>

              </download-excel>

              </span>
           </span>


        </h6>
        <b-card-text>
          <highcharts :constructor-type="'stockChart'" :options="chartOptions"></highcharts>
          {{exRate}}
        </b-card-text>
      </b-card>

    </div>

 </div>
</template>

<script>

import EventBus from '../eventBus';

export default {
  name: 'DashboardTrend',
  props: {

    data: Array,
    dashParams: Object,
    selOptions: Object,
    labels: Object,

  },
  components: {

  },
  data() {
    return {

      detailedData: [],

      jsonFields: {
        "Transaction Date":"trans_ts" ,
        "Amount (USD)":"total",
      },

      dashboardLoading: true,
      exRate: 1,

      chartOptions: {
        chart: {
          height:220,
        },
        xAxis:{
          type:'datetime'
        },
        series: [{
          data: [[]],
        }]
      }
    };

  },

  watch: {

    data: function () {
      this.processChartData();
    },
    'exRate': function () {
      this.processChartData();
    },

  },

  methods: {

    logIconClick(tool) {
      EventBus.$emit('interaction', {name: 'tooltip-' + tool, type: 'tooltip', event: 'click', data: { }});
    },

    processChartData() {

      var vm = this ;

      var chartData = this.$_.map(this.data, function(el) {
          return [ parseInt(el.trans_ts)*1000, el.total * vm.exRate ];
      });

      var dt;

      var detailedData = this.$_.map(this.data, function(el) {

          dt = new Date( parseInt(el.trans_ts) * 1000 );
          dt = dt.toISOString().slice(0,10);
          return { trans_ts: dt, total: el.total * vm.exRate };

      });

      this.detailedData = detailedData ;

      this.chartOptions.series = [ {data: chartData, name: this.labels.selTrxnType } ] ;

    },

  },

  mounted() {

    var vm = this ;

    EventBus.$on('xhr-dashboard', (payload) => {
       if ( payload == 'req' )
       {
         vm.dashboardLoading = true ;
       }
    });

    EventBus.$on('xhr-dashboard', (payload) => {
       if ( payload == 'res' )
       {
         vm.dashboardLoading = false;
       }
    });

    EventBus.$on('exRate', (payload) => {
       vm.exRate = payload.rate;
       //vm.value.metric = ' ' + payload.cur ;
    });

  },

  created() {

  },

};
</script>

<style scoped lang="scss">
.card-header {
  padding: 0.5rem 1.25rem;
}

</style>
