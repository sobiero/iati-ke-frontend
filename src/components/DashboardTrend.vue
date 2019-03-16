<template>
  
  <div class="row mr-n2 ml-n2 ">    
   <div class="col-md-12 ">

      <b-card header-tag="header" >
        <h6 slot="header" class="mb-0">Line chart below show daily transactions for the chosen parameters. </h6>
        <b-card-text>
          <highcharts :constructor-type="'stockChart'" :options="chartOptions"></highcharts>
          
        </b-card-text>
      </b-card>
    
    </div>

 </div>
</template>

<script>

export default {
  name: 'DashboardTrend',
  props: {
    data: Array,
    dashParams: Object,
    seloptions: Object,

  },
  components: {

  },
  data() {
    return {
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

      //[ { "trans_ts": 1251676800, "total": 45931 }, { "trans_ts": 1254268800, "total": 7963 }

      var chartData = this.$_.map(this.data, function(el) {
          return [ parseInt(el.trans_ts)*1000, el.total ];
      });

      this.chartOptions.series = [ {data: chartData} ] ;
      
    }
  
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

</style>
