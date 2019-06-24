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

        <span class='text-default col-md-2' style="display:inline-block; white-space: nowrap;">

          <b-link class="no-deco" v-b-tooltip.hover title="View data in tabular format">
             &nbsp;<fa-icon :class=" selVisualType == 'tbl' ? 'text-success' : 'text-mute' " @click="setVisualType('tbl')" icon="table"> </fa-icon>&nbsp;
          </b-link>

          <b-link class="no-deco" v-b-tooltip.hover title="View data as a bar chart">
             &nbsp;<fa-icon :class=" selVisualType == 'bar' ? 'text-success' : 'text-mute' " @click="setVisualType('bar')" icon="chart-bar"> </fa-icon>&nbsp;
          </b-link>

          <b-link class="no-deco" v-b-tooltip.hover title="View data as a pie chart">
             &nbsp;<fa-icon :class=" selVisualType == 'pie' ? 'text-success' : 'text-mute' " @click="setVisualType('pie')" icon="chart-pie"> </fa-icon>&nbsp;
          </b-link>

        </span>

        </span>

        <b-card-text>

            <span v-if="dashboardLoading">
               <fa-icon icon="spinner" pulse> </fa-icon>
            </span>

            <template v-else-if="selVisualType == 'tbl' " >

                 <!-- <table v-if="tableData.rows && tableData.rows.length > 0 " style="width:100%;" class="hover striped">
                  <thead>
                  <tr>
                    <td v-if="tableData.columns[0]">{{tableData.columns[0]}}</td>
                    <td class="text-left">{{tableData.columns[1]}}</td>
                    <td class="text-right">{{tableData.columns[2]}}</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="d in tableData.rows" >
                    <td v-if=" d.col1 " style="font-size:0.9em;">{{d.col1}}</td>
                    <td class="text-left" style="font-size:0.9em;">{{d.col2}}</td>
                    <td class="text-right" style="font-size:0.9em;">{{d.col3 | abbreviate}}</td>
                  </tr>
                  </tbody>
                  </table>  -->

                  <vue-good-table v-if="tableData.rows && tableData.rows.length > 0 "
                    :columns="tableData.columns"
                    :rows="tableData.rows"
                    :pagination-options="tableData.pagination"
                    styleClass="vgt-table bordered condensed"
                    max-height="400px"
                    :fixed-header="true"
                    >

                     <template slot="table-row" slot-scope="props">

                      <span v-if="props.column.label == 'SDG Name'">
                        <span>
                          <b-link href="#" @click="linkClicked('sdg', props.row.col1)">{{props.row.col2}}</b-link>
                        </span>
                      </span>
                      <span v-else-if="props.column.label == 'County'">
                        <b-link href="#" @click="linkClicked('county', props.row.col1)">{{props.row.col2}}</b-link>
                      </span>
                      <span v-else>

                          <span v-if="props.column.field == 'col3'">
                            <span>{{props.row.col3 * exRate | abbreviate }}</span>
                          </span>
                          <span v-else>
                             {{props.formattedRow[props.column.field]}}
                          </span>

                      </span>


                     </template>

                  </vue-good-table>

                  <div class="text-right" v-if="!dashboardLoading && selBreakDown == 1 && dashParams && dashParams.selCounty != '000'">
                    <b-link style="font-size:0.8em;" href="#" @click="linkClicked('county', '000')">All Counties</b-link>
                  </div>
                  <div class="text-right" v-else-if="!dashboardLoading && selBreakDown == 2 && dashParams && dashParams.selCounty != 0 ">
                    <b-link style="font-size:0.8em;" href="#" @click="linkClicked('sdg', 0)">All SDGs</b-link>
                  </div>

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

import EventBus from '../eventBus';

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

      exRate: 1,

      dashboardLoading:true,

      breakDownOptions: [

        { value: 1, text: 'View break down by Recepient Counties' },
        { value: 2, text: 'View break down by Recepient SDGs' },
        { value: 3, text: 'View break down by Contributing Organizations' },
        { value: 4, text: 'View break down by Transaction Types' },
        { value: 5, text: 'View break down by Years' },

      ],
      selBreakDown: 1,
      selVisualType: 'tbl',

      tableData: {
        columns: [],
        rows: [],
        pagination: {
          enabled: true,
          mode: 'records',
          perPage: 10,
          position: 'bottom',
          perPageDropdown: [5, 10, 15, 20, 50],
          dropdownAllowAll: true,
          setCurrentPage: 1,
          nextLabel: 'next',
          prevLabel: 'prev',
          rowsPerPageLabel: 'Rows per page',
          ofLabel: 'of',
          pageLabel: 'page', // for 'pages' mode
          allLabel: 'All',
        },
      },

      barChart: {
        chart: {
          height: 440,
          type: 'bar',
        },
        title: {
          text: null,
        },
        xAxis: {
          categories: [],
        },
        series: [{
          data: [[]],
        }],
        credits: {
          enabled: false,
        },
      },

      pieChart: {
        chart: {
          type: 'pie',
        },
        title: {
          text: null,
        },
        series: [{
          data: [[]],
        }],
        credits: {
          enabled: false,
        },
      },

    };
  },

  methods: {

    setVisualType(v) {
      this.selVisualType = v;
    },

    processData() {
      switch (this.selBreakDown) {
        case 1:

          this.tableData.columns = [{ label: 'Code', field: 'col1', type: 'number' }, { label: 'County', field: 'col2' }, { label: 'Amount', field: 'col3', type: 'number' }];
          this.tableData.rows = this.$_.map(this.data.totalAmtByCounty, item => ({ col1: item.county_code, col2: item.county_name, col3: item.total }));

          break;
        case 2:
          this.tableData.columns = [{ label: 'SDG No', field: 'col1', type: 'number' }, { label: 'SDG Name', field: 'col2' }, { label: 'Amount', field: 'col3', type: 'number' }];
          this.tableData.rows = this.$_.map(this.data.totalAmtBySdg, item => ({ col1: item.sdg_id, col2: item.sdg_name, col3: item.total }));

          break;
        case 3:
          this.tableData.columns = [{ label: 'Contributing organization', field: 'col2' }, { label: 'Amount', field: 'col3', type: 'number' }];
          this.tableData.rows = this.$_.map(this.data.totalAmtByPublisher, item => ({ col2: item.publisher, col3: item.total }));
          break;
        case 4:
          this.tableData.columns = [{ label: 'Transaction Type', field: 'col2' }, { label: 'Amount', field: 'col3', type: 'number' }];
          this.tableData.rows = this.$_.map(this.data.summaryByTrxnType, item => ({ col2: item.name, col3: item.total }));
          break;
        case 5:
          this.tableData.columns = [{ label: 'Year', field: 'col2', type: 'number' }, { label: 'Amount', field: 'col3', type: 'number' }];
          this.tableData.rows = this.$_.map(this.data.totalAmtByYear, item => ({ col2: item.trans_year, col3: item.total }));
          break;
        default:
          // code block
      }

      const xAxis = [];
      const yAxis = [];

      _.forOwn(this.tableData.rows, (val, key) => {
        xAxis.push(val.col2);
        yAxis.push(val.col3 * this.exRate );
      });

      this.barChart.xAxis.categories = xAxis;
      this.barChart.series = [{ data: yAxis }];

      const dt = []; let x = 0;

      _.forOwn(this.tableData.rows, (val, key) => {
        if (x < 5) {
          dt.push({ name: val.col2, y: val.col3 });
        }
        x++;
      });

      this.pieChart.series = [{ data: dt }];
    },

    linkClicked(param, val) {

       switch (param)
       {
          case 'county':
           EventBus.$emit('countyClicked', val);
          break;

          case 'sdg':
           EventBus.$emit('sdgClicked', val);
          break;

          default:
       }

    },

  },

  watch: {

    selBreakDown() {
      this.processData();
    },

    exRate() {
      this.processData();
    },

    data: {
      handler(val) {
        this.processData();
        // console.log('watch', val);
      },
      deep: true,
    },

  },

  mounted() {
    this.processData();
    // this.selBreakDown = 1;

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

  created() {

  },

};
</script>

<style lang="scss">
.card-header {
  padding: 0.5rem 1.25rem;
}

a.no-deco, a.no-deco:hover {
  text-decoration:none;
}

#userpaneopts .card-header {
 padding-bottom: 0.14em;;
 padding-top: 0.14em;;

}

#userpaneopts span {
 padding: 0;
}

.xcustom-select option {
    font-weight: bold !important;
}

svg:hover {
  cursor: pointer;
}

svg.text-mute {
  color:#9d9d9d;
}

table.vgt-table span {
  font-size:0.95em;
}

table.vgt-table th {
  padding: .3em 1.5em .3em .75em
}
table.vgt-table.condensed td {
  padding: .15em 1.5em;
}
</style>
