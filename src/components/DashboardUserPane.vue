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
          <b-form-select id="selBreakDown" size="sm" v-model="selBreakDown" :options="breakDownOptions" @change="processData('sel')" style="max-width:350px;background-color:inherit;"> </b-form-select>
        </span>

        <span class='text-default col-md-2' style="display:inline-block; white-space: nowrap;">

          <b-link class="no-deco" id="user-pane-tbl" @click="logIconClick('user-pane-tbl')">
             <fa-icon :class=" selVisualType == 'tbl' ? 'text-success' : 'text-mute' " @click="setVisualType('tbl')" icon="table"> </fa-icon>
             <b-tooltip target="user-pane-tbl">View data in tabular format</b-tooltip>
          </b-link>&nbsp;

          <b-link class="no-deco" id="user-pane-bar" @click="logIconClick('user-pane-bar')">
             <fa-icon :class=" selVisualType == 'bar' ? 'text-success' : 'text-mute' " @click="setVisualType('bar')" icon="chart-bar"> </fa-icon>
             <b-tooltip target="user-pane-bar">View data as a bar chart</b-tooltip>
          </b-link>&nbsp;

          <b-link class="no-deco" id="user-pane-pie"  @click="logIconClick('user-pane-pie')">
             <fa-icon :class=" selVisualType == 'pie' ? 'text-success' : 'text-mute' " @click="setVisualType('pie')" icon="chart-pie"> </fa-icon>
             <b-tooltip target="user-pane-pie">View data as a pie chart</b-tooltip>
          </b-link>

        </span>

        </span>

        <b-card-text>

          <div class="col-md-12 text-right">

            <download-excel v-if="!dashboardLoading"
                style="display:inline-block;"
                class   = "pull-right"
                :data   = "tableData.rows"
                :fields = "jsonFields"
                type    = "csv"
                name    = "download_data.csv">

                <b-link class="no-deco">
                   <fa-icon icon="download" id="user-pane-download"></fa-icon>
                   <b-tooltip target="user-pane-download">Download

                    <template v-if="selVisualType == 'tbl'">
                     table
                    </template>
                    <template v-else-if="selVisualType == 'bar'">
                     bar chart
                    </template>
                    <template v-else-if="selVisualType == 'pie'">
                     pie chart
                    </template>
                    data as CSV</b-tooltip>
                </b-link>

              </download-excel>

           </div>

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

                    @on-page-change="logTableInteractionPageChange"
                    @on-per-page-change="logTableInteractionPerPageChange"
                    @on-column-filer="logTableInteractionColumnFilter"
                    @on-sort-change="logTableInteractionSortChange"

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

                 <em class="text-mute"><small>Note: Pie chart only shows the top 5 items for easy interpretation. <br>Use table or bar chart to see all </small></em>
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
    labels: Object,
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

      jsonFields: {
        "County Code": "county_code",
        "County Name": "county_name",
        "Amount (USD)": "total",
        "Amount (KES)": {
          field: 'total',
             callback: (value) => {
                return value * this.exRate ;
            }
         }
      },

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

        yAxis: {
            min: 0,
            title: {
                text:   'Amount' + this.labels.selTrxnType,
                align: 'high'
            },
            labels: {
                overflow: 'justify'
            }
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

    logIconClick(tool) {
       EventBus.$emit('interaction', {name: 'tooltip-' + tool, type: 'tooltip', event: 'click', data: { }});
    },

    logTableInteractionPageChange(params){
       this.logTableInteraction('page-change', params) ;
    },

    logTableInteractionPerPageChange(params){
       this.logTableInteraction('per-page-change', params);
    },

    logTableInteractionColumnFilter(params){
       this.logTableInteraction('column-filter', params);
    },

    logTableInteractionSortChange(params){
       this.logTableInteraction('sort-change', params);
    },

    logTableInteraction(element, params) {
       EventBus.$emit('interaction', {name: 'userpane-table-' + element , type: 'table-event', event: 'change', data: { params: params }});
    },

    setVisualType(v) {
      this.selVisualType = v;
      //EventBus.$emit('interaction', {name: 'tooltip-' + tool, type: 'tooltip', event: 'hover', data: { }});
    },

    processData(invoker) {

      switch (this.selBreakDown) {
        case 1:

          this.tableData.columns = [{ label: 'Code', field: 'col1', type: 'number' }, { label: 'County', field: 'col2' }, { label: 'Amount', field: 'col3', type: 'number' }];
          this.tableData.rows = this.$_.map(this.data.totalAmtByCounty, item => ({ col1: item.county_code, col2: item.county_name, col3: item.total }));

          this.jsonFields = {
            "County Code": "col1",
            "County Name": "col2",
            "Amount (USD)": "col3",
            "Amount (KES)": {
              field: 'col3',
                 callback: (value) => {
                    return value * this.exRate ;
                }
             }
          };

          break;
        case 2:
          this.tableData.columns = [{ label: 'SDG No', field: 'col1', type: 'number' }, { label: 'SDG Name', field: 'col2' }, { label: 'Amount', field: 'col3', type: 'number' }];
          this.tableData.rows = this.$_.map(this.data.totalAmtBySdg, item => ({ col1: item.sdg_id, col2: item.sdg_name, col3: item.total }));

          this.jsonFields = {
            "SDG No": "col1",
            "SDG Name": "col2",
            "Amount (USD)": "col3",
            "Amount (KES)": {
              field: 'col3',
                 callback: (value) => {
                    return value * this.exRate ;
                }
             }
          };

          break;
        case 3:
          this.tableData.columns = [{ label: 'Contributing Organization', field: 'col2' }, { label: 'Amount', field: 'col3', type: 'number' }];
          this.tableData.rows = this.$_.map(this.data.totalAmtByPublisher, item => ({ col2: item.publisher, col3: item.total }));

          this.jsonFields = {
            "Contributing organization": "col2",
            "Amount (USD)": "col3",
            "Amount (KES)": {
              field: 'col3',
                 callback: (value) => {
                    return value * this.exRate ;
                }
             }
          };

          break;
        case 4:
          this.tableData.columns = [{ label: 'Transaction Type', field: 'col2' }, { label: 'Amount', field: 'col3', type: 'number' }];
          this.tableData.rows = this.$_.map(this.data.summaryByTrxnType, item => ({ col2: item.name, col3: item.total }));

          this.jsonFields = {
            "Transaction Type": "col2",
            "Amount (USD)": "col3",
            "Amount (KES)": {
              field: 'col3',
                 callback: (value) => {
                    return value * this.exRate ;
                }
             }
          };

          break;
        case 5:
          this.tableData.columns = [{ label: 'Year', field: 'col2', type: 'number' }, { label: 'Amount', field: 'col3', type: 'number' }];
          this.tableData.rows = this.$_.map(this.data.totalAmtByYear, item => ({ col2: item.trans_year, col3: item.total }));

          this.jsonFields = {
            "Year": "col2",
            "Amount (USD)": "col3",
            "Amount (KES)": {
              field: 'col3',
                 callback: (value) => {
                    return value * this.exRate ;
                }
             }
          };

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
      this.barChart.series = [{ data: yAxis, name: this.labels.selTrxnType }];

      const dt = []; let x = 0;

      _.forOwn(this.tableData.rows, (val, key) => {
        if (x < 5) {
          dt.push({ name: val.col2, y: val.col3 });
        }
        x++;
      });

      this.pieChart.series = [{ data: dt, name: this.labels.selTrxnType  }];

      if (invoker == 'sel' )
      {
          EventBus.$emit('interaction', {name: 'userpane-select', type: 'select', event: 'change', data: { sel: this.selBreakDown }});
      }

    },

    linkClicked(param, val) {

       EventBus.$emit('interaction', {name: 'userpane-table-link-' + param, type: 'link', event: 'click', data: { val: val }});

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
