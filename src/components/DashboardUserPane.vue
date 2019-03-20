<template>
  
  <div class="row">    
   <div class="col-md-12">

      <b-card header-tag="header" id="userpaneopts"  style="min-height: 540px;" >
        <span slot="header" class="mb-0" style="width:100%;display:inline-block;"> 
          
            <!-- <b-dropdown :text="breakDownOption" class="btn-default" size="sm">
              <b-dropdown-item>View Break down by Counties</b-dropdown-item>
              <b-dropdown-item>View Break down by Contributing Organization</b-dropdown-item>
              <b-dropdown-item>View Break down by SDGs</b-dropdown-item>
              <b-dropdown-item>View Break down by Transaction Type</b-dropdown-item>
            </b-dropdown> -->

        <span class='text-left col-md-10' style="display:inline-block;">  
          <b-form-select id="selBreakDown" size="sm" v-model="selBreakDown" :options="breakDownOptions" @change="processData()" style="max-width:350px;background-color:inherit;"> </b-form-select>
        </span>

        <span class='text-default col-md-2' style="display:inline-block">
          <fa-icon :class=" selVisualType == 'tbl' ? 'text-success' : 'text-mute' " @click="setVisualType('tbl')" icon="table"> </fa-icon>&nbsp;
          <fa-icon :class=" selVisualType == 'bar' ? 'text-success' : 'text-mute' " @click="setVisualType('bar')" icon="chart-bar"> </fa-icon>&nbsp;
          <fa-icon :class=" selVisualType == 'pie' ? 'text-success' : 'text-mute' " @click="setVisualType('pie')" icon="chart-pie"> </fa-icon>
        </span>

        </span>

        <b-card-text>

            <template v-if="selVisualType == 'tbl' " >
           
                 <table v-if="tableData.rows && tableData.rows.length > 0 " style="width:100%;" class="hover striped">
                  <thead>
                  <tr>
                    <td v-if="tableData.header[0]">{{tableData.header[0]}}</td>
                    <td class="text-left">{{tableData.header[1]}}</td>
                    <td class="text-right">{{tableData.header[2]}}</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="d in tableData.rows" >
                    <td v-if=" d.col1 " style="font-size:0.9em;">{{d.col1}}</td>
                    <td class="text-left" style="font-size:0.9em;">{{d.col2}}</td>
                    <td class="text-right" style="font-size:0.9em;">{{d.col3 | abbreviate}}</td>
                  </tr>
                  </tbody>
                  </table>      
            
            </template>

            <template v-else-if="selVisualType == 'bar' ">
                 <highcharts :options="barChart" key="bar"></highcharts>
            </template>
              
            <template v-else-if="selVisualType == 'pie' ">
                 <highcharts :options="pieChart" key="pie"></highcharts>
            </template>
  
        </b-card-text>
      </b-card>
    
    </div>
 </div>
</template>

<script>

export default {
  name: 'DashboardUserPane',
  props: {
    data: Object,
    dashParams: Object,
    selOptions: Object,

  },
  components: {

  },
  data() {
    return {

      breakDownOptions: [
      {value: 1, text:'View break down by Recepient Counties'},
      {value: 2, text:'View break down by Recepient SDGs'},
      {value: 3, text:'View break down by Contributing Organizations'},
      {value: 4, text:'View break down by Transaction Types'},
      {value: 5, text:'View break down by Years'},

      ],
      selBreakDown: 2,
      selVisualType: 'tbl',

      tableData: {
        header: [],
        rows: {},
      },

      barChart: {
        chart: {
          height:440,
          type: 'bar',
        },
        title: {
            text: null
        },
        xAxis:{
            categories: [],
        },
        series: [{
          data: [[]],
        }],
        credits: {
            enabled: false
        },
      },

      pieChart : {
        chart: {
          type: 'pie',
        },
        title: {
            text: null
        },
        series: [{
          data: [[]],
        }],
        credits: {
            enabled: false
        },
      },

    };  
  },

  methods: {

    setVisualType: function (v) {
        this.selVisualType = v ;
    },

    processData: function () {

      switch( this.selBreakDown ) {
        case 1:
          
          this.tableData.header = ['Code', 'County', 'Amount'];
          this.tableData.rows   = this.$_.map( this.data.totalAmtByCounty, function(item) { 
              return { col1: item.county_code, col2: item.county_name, col3: item.total } ;
           });

          break;
        case 2:
          this.tableData.header = ['No', 'SDG', 'Amount'];
          this.tableData.rows   = this.$_.map( this.data.totalAmtBySdg, function(item) { 
              return { col1: item.sdg_id, col2: item.sdg_name, col3: item.total } ;
           });
           
          break;
        case 3:
          this.tableData.header = [null , 'Contributing organization', 'Amount'];
          this.tableData.rows   = this.$_.map( this.data.totalAmtByPublisher, function(item) { 
              return { col1: null, col2: item.publisher, col3: item.total } ;
           });
          break;
        case 4:
          this.tableData.header = [null , 'Transaction Type', 'Amount'];
          this.tableData.rows   = this.$_.map( this.data.summaryByTrxnType, function(item) { 
              return { col1: null, col2: item.name, col3: item.total } ;
           });
          break;
        case 5:
          this.tableData.header = [null , 'Year', 'Amount'];
          this.tableData.rows   = this.$_.map( this.data.totalAmtByYear, function(item) { 
              return { col1: null, col2: item.trans_year, col3: item.total } ;
           });
          break;
        default:
          // code block
      }  
      
        var xAxis = [];
        var yAxis = [];

        _.forOwn( this.tableData.rows, function(val, key) {
            xAxis.push( val.col2 );
            yAxis.push( val.col3 );
        });

        this.barChart.xAxis.categories = xAxis  ;
        this.barChart.series = [ {data: yAxis } ] ;
              
        var dt = []; var x = 0;

        _.forOwn( this.tableData.rows, function(val, key) {
          if (x < 5)
          {
              dt.push( { name: val.col2, y: val.col3 } );
          }
          x++;
        });

        this.pieChart.series = [ {data: dt } ] ;

    
    },
    
  },

  watch: {

    selBreakDown: function() {
       this.processData();    
    },

    data: {
      handler (val) {
        this.processData();
        console.log('watch', val);
      },
      deep: true,
    },
  
  },

  mounted() {
     
    this.processData(); 
    //this.selBreakDown = 1;
  },
 
  created() {

  },

};
</script>

<style scoped lang="scss">
.card-header {
  padding: 0.5rem 1.25rem;
}

#userpaneopts .card-header {
 padding-bottom: 0.14em;;
 padding-top: 0.14em;;

}

#userpaneopts span {
 padding: 0;
}

.custom-select option {
    font-weight: bold !important;
}

svg:hover {
  cursor: pointer;
}

svg.text-mute {
  color:#9d9d9d;
}

</style>
