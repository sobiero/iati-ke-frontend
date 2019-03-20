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

      <template v-if="data.totalAmt && data.totalAmt.total">
      <span class="text-info" style="font-size:3.3em;">{{data.totalAmt.total | abbreviate }} </span>
      </template>

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

           <template v-if="data.totalAmtByCounty && data.totalAmtByCounty[0]">

             <span class="text-default" style="font-size:1.5em;">{{data.totalAmtByCounty[0].county_name }}</span>
            <br />
            <span style="font-size:2.7em;color:#d1412c;"> {{data.totalAmtByCounty[0].total | abbreviate }}</span>

           </template>
           </b-card-text>

         </template>

         <template v-else-if="dashParams.selSdg == 0 ">

          <h6 slot="header" class="mb-0"><strong style="color:#d1412c;">Top Receipient SDG</strong></h6>

           <b-card-text>

           <template v-if="data.totalAmtBySdg && data.totalAmtBySdg[0]">

            <span style="font-size:0.9em;">{{data.totalAmtBySdg[0].sdg_id }} {{data.totalAmtBySdg[0].sdg_name }}</span>
            <br />
            <span style="font-size:2.7em;color:#d1412c;"> {{data.totalAmtBySdg[0].total | abbreviate }}</span>

           </template>
           </b-card-text>

         </template>

         <template v-else>
         <h6 slot="header" class="mb-0"><strong>Top Receiving Year</strong></h6>
          <b-card-text>

          <template v-if="data.totalAmtByYear && data.totalAmtByYear[0]">

            <span class="text-default" style="font-size:1.5em;">{{data.totalAmtByYear[0].trans_year }}</span>
            <br />
            <span style="font-size:2.7em;color:#d1412c;">{{data.totalAmtByYear[0].total | abbreviate }}</span>

           </template>

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

       <template v-if="data.totalAmtByPublisher && data.totalAmtByPublisher[0]">

       <span style="font-size:0.9em">{{data.totalAmtByPublisher[0].publisher }} </span>
       <br /><br /><span class="text-success" style="font-size:2.7em"> {{data.totalAmtByPublisher[0].total | abbreviate }} </span>

       </template>

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

           <template v-if="data.summaryByTrxnType">

             <table style="width:100%;">
             <tr v-for="t in data.summaryByTrxnType">
              <td class="text-left pr-2 " style="font-size:0.9em;">{{t.name}}</td>
              <td class="text-right"  style="font-size:0.9em;">{{t.total | abbreviate }}</td>
             </tr>
             </table>


           </template>

          </b-card-text>

        </template>

        <template v-else-if="dashParams.selCounty == '000' && dashParams.selSdg == 0 ">

           <h6 slot="header" class="mb-0"><strong>Top Receipient SDG</strong></h6>

           <b-card-text class="top-org">

           <template v-if="data.totalAmtBySdg && data.totalAmtBySdg[0]">

            <span style="font-size:0.9em;">{{data.totalAmtBySdg[0].sdg_id }} {{data.totalAmtBySdg[0].sdg_name }}</span>
            <br /><br />
            <span class="text-info" style="font-size:2.7em;">{{data.totalAmtBySdg[0].total | abbreviate }}</span>

           </template>

          </b-card-text>

        </template>


        <template v-else>

          <!-- <h6 slot="header" class="mb-0"><strong>Top Receiving Year</strong></h6>
          <b-card-text>

          <template v-if="data.totalAmtByYear && data.totalAmtByYear[0]">

            <span class="text-default" style="font-size:1.5em;">{{data.totalAmtByYear[0].trans_year }}</span>
            <br />
            <span class="text-info" style="font-size:2.7em;">{{data.totalAmtByYear[0].total | abbreviate }}</span>

           </template>

          </b-card-text> -->

          <h6 slot="header" class="mb-0"><strong>Other Transactions</strong></h6>

           <b-card-text>

           <template v-if="data.summaryByTrxnType">

             <table style="width:100%;" class="hover striped">
             <tr v-for="t in data.summaryByTrxnType">
              <td class="text-left pr-2 " style="font-size:0.9em;">{{t.name}}</td>
              <td class="text-right text-info"  style="font-size:0.9em;"><strong>{{t.total | abbreviate }}</strong></td>
             </tr>
             </table>

           </template>

          </b-card-text>

        </template>

    </b-card>

    </div>

  </b-card-group>

 </div>
</template>

<script>

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

};
</script>

<style scoped lang="scss">
.card-header {
  padding: 0.5rem 1.25rem;
}
.card-body {
  min-height:7.6em;
  padding-bottom:0;
}
p.top-org {
  margin-top:-10px;
  margin-bottom:12px;
  line-height:1.1em;
}

</style>
