<template>

  <div class="row mr-n4 ml-n4 ">

   <b-card-group class="col-md-12 ">

    <div class="col-md-3" >
    <b-card header-tag="header"
    text-variant="default"
    header-text-variant="info"
    border-variant="info"
    >
      <h6 slot="header" class="mb-0"><strong>Total Amount</strong></h6>
      <b-card-text>

      <span v-if="dashboardLoading">
         <fa-icon icon="spinner" pulse> </fa-icon>
      </span>
      <template v-else-if="data.totalAmt && data.totalAmt.total">
      <span class="text-info" style="font-size:2.2em;">{{data.totalAmt.total * exRate | abbreviate }} </span>
      </template>
      <span class="no-data" v-else>
           No data
       </span>

      </b-card-text>
    </b-card>
    </div>

    <div class="col-md-3" >

      <b-card header-tag="header"
      text-variant="default"
      header-text-variant="warning"
      border-variant="warning"
      >


          <template v-if="dashParams.selCounty == '000' ">

          <h6 slot="header" class="mb-0"><strong style="color:#d1412c;">Top Receipient County</strong></h6>

           <b-card-text>

           
            <span v-if="dashboardLoading">
               <fa-icon icon="spinner" pulse> </fa-icon>
            </span>
           <template v-else-if="data.totalAmtByCounty && data.totalAmtByCounty[0]">

             <span class="text-default" style="font-size:1.2em;">{{data.totalAmtByCounty[0].county_name }}</span>
            <br />
            <span style="font-size:1.8em;color:#d1412c;"> {{data.totalAmtByCounty[0].total * exRate | abbreviate }}</span>

           </template>
           <span class="no-data" v-else>
               No data
           </span>


           </b-card-text>

         </template>

         <template v-else-if="dashParams.selSdg == 0 ">

          <h6 slot="header" class="mb-0"><strong style="color:#d1412c;">Top Receipient SDG</strong></h6>

           <b-card-text>

            <span v-if="dashboardLoading">
               <br /> <fa-icon icon="spinner" pulse> </fa-icon>
            </span>
           <template v-else-if="data.totalAmtBySdg && data.totalAmtBySdg[0]">

            <span style="font-size:0.75em;">{{data.totalAmtBySdg[0].sdg_id }} {{data.totalAmtBySdg[0].sdg_name }}</span>
            <br />
            <span style="font-size:1.8em;color:#d1412c;"> {{data.totalAmtBySdg[0].total * exRate | abbreviate }}</span>

           </template>
           <span class="no-data" v-else>
               No data
           </span>

           </b-card-text>

         </template>

         <template v-else>
         <h6 slot="header" class="mb-0"><strong>Top Receiving Year</strong></h6>
          <b-card-text>

           <span v-if="dashboardLoading">
               <fa-icon icon="spinner" pulse> </fa-icon>
           </span>
          <template v-else-if="data.totalAmtByYear && data.totalAmtByYear[0]">

            <span class="text-default" style="font-size:1.5em;">{{data.totalAmtByYear[0].trans_year }}</span>
            <br />
            <span style="font-size:1.8em;color:#d1412c;">{{data.totalAmtByYear[0].total * exRate | abbreviate }}</span>

           </template>
           <span class="no-data" v-if="!dashboardLoading && !(data.totalAmt && data.totalAmt.total)">
             No data
           </span>

          </b-card-text>
         </template>


      </b-card>

    </div>

    <div class="col-md-3" >
    <b-card header-tag="header"
    text-variant="default"
    header-text-variant="success"
    border-variant="success"
    >
      <h6 slot="header" class="mb-0"><strong>Top Contributing Organization </strong></h6>

      <b-card-text class="top-org">

       <span v-if="dashboardLoading">
           <br /><fa-icon icon="spinner" pulse> </fa-icon>
       </span>
       <template v-else-if="data.totalAmtByPublisher && data.totalAmtByPublisher[0]">

       <span style="font-size:0.7em">{{data.totalAmtByPublisher[0].publisher }} </span>
       <br /><br /><span class="text-success" style="font-size:1.8em"> {{data.totalAmtByPublisher[0].total * exRate | abbreviate }} </span>

       </template>
       <span class="no-data" v-else>
           <span><br />No data</span>
       </span>

      </b-card-text>


    </b-card>
    </div>

    <div class="col-md-3 mr-0" >
       <b-card header-tag="header"
    text-variant="default"
    header-text-variant="info"
    border-variant="info"
    >

         <template v-if="dashParams.selCounty != '000' && dashParams.selSdg != 0 ">

           <h6 slot="header" class="mb-0"><strong>Other Transactions</strong></h6>

           <b-card-text>
           
            <span v-if="dashboardLoading">
               <fa-icon icon="spinner" pulse> </fa-icon>
            </span>
           <template v-else-if="data.summaryByTrxnType">

             <table style="width:100%;">
             <tr v-for="t in data.summaryByTrxnType">
              <td class="text-left pr-2 " style="font-size:0.7em;">{{t.name}}</td>
              <td class="text-right"  style="font-size:0.7em;">{{t.total * exRate | abbreviate }}</td>
             </tr>
             </table>

           </template>
         <span class="no-data" v-if="!dashboardLoading && !(data.totalAmt && data.totalAmt.total)">
           No data
         </span>


          </b-card-text>

        </template>

        <template v-else-if="dashParams.selCounty == '000' && dashParams.selSdg == 0 ">

           <h6 slot="header" class="mb-0"><strong>Top Receipient SDG</strong></h6>

           <b-card-text class="top-org">

            <span v-if="dashboardLoading">
               <fa-icon icon="spinner" pulse> </fa-icon>
            </span>
           <template v-else-if="data.totalAmtBySdg && data.totalAmtBySdg[0]">

            <span style="font-size:0.75em;">{{data.totalAmtBySdg[0].sdg_id }} {{data.totalAmtBySdg[0].sdg_name }}</span>
            <br /><br />
            <span class="text-info" style="font-size:1.8em;">{{data.totalAmtBySdg[0].total * exRate | abbreviate }}</span>

           </template>
           <span class="no-data" v-else>
               No data
           </span>

          </b-card-text>

        </template>


        <template v-else>

          <!-- <h6 slot="header" class="mb-0"><strong>Top Receiving Year</strong></h6>
          <b-card-text>

          <template v-if="data.totalAmtByYear && data.totalAmtByYear[0]">

            <span class="text-default" style="font-size:1.5em;">{{data.totalAmtByYear[0].trans_year }}</span>
            <br />
            <span class="text-info" style="font-size:1.8em;">{{data.totalAmtByYear[0].total | abbreviate }}</span>

           </template>

          </b-card-text> -->

          <h6 slot="header" class="mb-0"><strong>Other Transactions</strong></h6>

           <b-card-text>

           
            <span v-if="dashboardLoading">
               <fa-icon icon="spinner" pulse> </fa-icon>
            </span>
           <template v-else-if="data.summaryByTrxnType">

             <table style="width:100%;" class="hover striped">
             <tr v-for="t in data.summaryByTrxnType">
              <td class="text-left pr-2 " style="font-size:0.7em;">{{t.name}}</td>
              <td class="text-right text-info"  style="font-size:0.7em;"><strong>{{t.total * exRate | abbreviate }}</strong></td>
             </tr>
             </table>

           </template>
         <span class="no-data" v-if="!dashboardLoading && !(data.totalAmt && data.totalAmt.total)">
           No data
         </span>

          </b-card-text>

        </template>

    </b-card>

    </div>

  </b-card-group>

 </div>
</template>

<script>

import EventBus from '../eventBus';

export default {
  name: 'DashboardKpis',
  props: {
    currency: String,
    data: Object,
    dashParams: Object,
    selOptions: Object,
    labels: Object,
  },
  components: {
  },
  data() {
    return {

      dashboardLoading: true,
      exRate: 1,

    };
  },

  watch: {

    labels() {
      // console.log(this.labels);
    },
    dashParams() {
      // console.log(this.dashParams);
    },

  },

  methods: {

  },

  created() {

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
    });

  
  },


};
</script>

<style scoped lang="scss">
.card-header {
  padding: 0.2rem 1.25rem;
}
.card-body {
  min-height:6.3em;
  padding-bottom:0;
}
p.top-org {
  margin-top:-10px;
  margin-bottom:12px;
  line-height:1.1em;
}

span.no-data {
   font-style:italic;
   color:#ff3333;
}

</style>
