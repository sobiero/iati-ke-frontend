<template>

  <div class="row">
   <div class="col-md-12">

      <b-card header-tag="header" style="min-height: 520px;">
        <h6 slot="header" class="mb-0">
           <span v-if="dashboardLoading">
               <fa-icon icon="spinner" pulse> </fa-icon> <span style="font-size:0.9em;"> loading map data... </span>
           </span>
           <span v-else>
              <span class="pull-right" style="display:inline-block;">

               <template v-if="labels.selCounty == '' || labels.selCounty == 'All counties'">
                 Map showing {{labels.selTrxnType.toLowerCase()}} accross the counties
               </template>

               <template v-else>
                    Map showing {{labels.selTrxnType.toLowerCase()}} for {{labels.selCounty}} county
               </template>

              <download-excel style="display:inline-block;"
                class   = "pull-right"
                :data   = "countyData"
                :fields = "jsonFields"
                type    = "csv"
                name    = "map_data.csv">

                <span style="display:inline-block; min-width:80px;"></span>

                <b-link class="no-deco" href="#" @click="logIconClick('map-pane-download')">
                   <fa-icon icon="download" id="map-pane-download"></fa-icon>
                   <b-tooltip target="map-pane-download">Download map data as CSV</b-tooltip>
                </b-link>

              </download-excel>

              </span>
           </span>
        </h6>
        <b-card-text>

          <l-map :zoom="zoom" :min-zoom="minZoom" :max-zoom="maxZoom" ref="dMap"
          :center="center" style="height: 500px; width: 100%">

             <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

             <template v-for=" l in activeCounty.pointData " v-if="dashParams.selCounty != '000'">

             <l-marker :lat-lng="l.marker" >
              <l-popup @click="logPopupClicked">
                  <table class="table bordered">
                  <tr>
                    <td><strong>Location Name</strong></td>
                    <td>{{l.location_name}}</td>
                  </tr>
                  <tr>
                    <td><strong>{{labels.selTrxnType}} Amount</strong></td>
                    <td>{{l.amount  | abbreviate}} </td>
                  </tr>
                  </table>
              </l-popup>
             </l-marker>

             </template>

            <l-choropleth-layer :data="cleanedCountyData"
                 titleKey="county_name" idKey="county_code" :value="value"
                 geojsonIdKey="COUNTY_COD"
                 :geojson="countyGeojson" :colorScale="colorScale" >

               <template slot-scope="props">
                  <l-info-control :item="props.currentItem" :unit="props.unit"
                  title="County" placeholder="Hover over a county"></l-info-control>
                  <l-reference-chart :title="refChartTitle"
                  :colorScale="colorScale" :min="props.min" :max="props.max"
                  position="topright"  ></l-reference-chart>
                </template>

            </l-choropleth-layer>

            <l-geo-json v-if="activeCounty.geoJson && dashParams.selCounty && dashParams.selCounty != '000' "
             :geojson="activeCounty.geoJson"
              >
           </l-geo-json>

          </l-map>

        </b-card-text>
      </b-card>
    </div>

 </div>
</template>

<script>
// import { InfoControl, ReferenceChart, ChoroplethLayer } from 'vue-choropleth';
// I need to customize these
import InfoControl from '@/components/vue-choropleth/InfoControl.vue';
import ReferenceChart from '@/components/vue-choropleth/ReferenceChart.vue';
import ChoroplethLayer from '@/components/vue-choropleth/ChoroplethLayer.vue';

import EventBus from '../eventBus';

import {
  LMap, LTileLayer, LMarker, LGeoJson, LPopup,
} from 'vue2-leaflet';
// import {geojson} from '@/data/counties.min.json';
import countyGeojson from '@/data/counties.min.json';

export default {
  name: 'DashboardMap',
  props: {
    countyData: Array,
    dashParams: Object,
    selOptions: Object,
    countyLocationData: Array,
    labels: Object,
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LGeoJson,
    LPopup,
    'l-info-control': InfoControl,
    'l-reference-chart': ReferenceChart,
    'l-choropleth-layer': ChoroplethLayer,
  },
  data() {
    return {

      jsonFields: {
        "County Code": "county_code",
        "County Name": "county_name",
        "Amount (USD)": "total",
        "Amount (KES)": {
          field: 'total',
             callback: (value) => {
                return value * 101 ;
            }
         }
      },

      exRate: 1,

      dashboardLoading: true,

      zoom: 6,
      minZoom: 2,
      maxZoom: 15,
      center: L.latLng(0.3, 38),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(1, 38),
      showMarker: true,
      showInfoAndRef: false,

      value: {
        key: 'total',
        metric: ' USD',
      },

      /*
      extraValues: [{
        key: "amount_m",
        metric: "% boys"
      }], */

      countyGeojson,
       //colorScale: ["6cff6c", "00b000", "005500"],
      colorScale: ["bb86fc", "6200ee", "3700b3"],

      //colorScale: ['ddbb60', 'de893d', 'b73826'],

      cleanedCountyData: [],

      activeCounty: {
        geoJson: null,
        pointData: null,
      },

    };
  },

  computed: {

    refChartTitle() {

      return this.labels.selTrxnType + " in " + this.dashParams.currency ;

    },

  },

  watch: {

    'exRate': function() {
       this.updateData();
       this.updateLocationData();
    },

    'countyData': function() {
       this.updateData();
    },

    'countyLocationData': function() {
      this.updateLocationData();
    },

    'dashParams.selCounty': function () {
      this.activeCounty.geoJson = null;

      var el1 = document.getElementsByClassName("infoCtrl"); //.style.display("block");
      el1 = el1[0];
      var el2 = document.getElementsByClassName("refChart"); //.style.display("block");
      el2 = el2[0];

      if (this.dashParams.selCounty == '000')
      {

        el1.style.display = "block";
        el2.style.display = "block";

      } else {

        el1.style.display = "none";
        el2.style.display = "none";

      }

    },


  },

  methods: {

    logIconClick(tool) {
          EventBus.$emit('interaction', {name: 'tooltip-' + tool, type: 'tooltip', event: 'click', data: { }});
    },

    logPopupClicked() {
          EventBus.$emit('interaction', {name: 'popup', type: 'map-popup', event: 'click', data: { }});
    },

    updateData() {

      const cleanedCountyData = this.$_.map(this.countyData, el => ({ county_code: parseInt(el.county_code), county_name: el.county_name, total: el.total * this.exRate }));
      this.cleanedCountyData = cleanedCountyData;

      if (this.dashParams.selCounty != '000' && !this.$_.isEmpty(this.countyData)) {
        this.showInfoAndRef = false;

        const tmp = this.$_.find(this.countyGeojson.features, { properties: { COUNTY_COD: parseInt(this.dashParams.selCounty) } });

        this.activeCounty.geoJson = { type: 'FeatureCollection', features: [tmp] };

        var b = L.geoJson(this.activeCounty.geoJson);
        this.$refs.dMap.mapObject.fitBounds(b.getBounds());
      }

      if (this.dashParams.selCounty == '000' && !this.$_.isEmpty(this.countyData)) {
        var b = L.geoJson(this.countyGeojson);
        this.$refs.dMap.mapObject.fitBounds(b.getBounds());
        this.showInfoAndRef = true;
      }

    },

    updateLocationData() {

       const m = this.$_.map(this.countyLocationData, item => ({ location_name: item.location_name, marker: L.latLng(item.location_latitude, item.location_longitude), amount: item.total * this.exRate }));
       this.activeCounty.pointData = m;

    },


    // features . properties.COUNTY_COD

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
       vm.value.metric = ' ' + payload.cur ;
    });

  },

  created() {

  },

};
</script>

<style scoped lang="scss">
.card-body {
  padding: 0;
}
.card-header {
  padding: 0.5rem 1.25rem;
  }
</style>
