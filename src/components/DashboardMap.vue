<template>
  
  <div class="row">    
   <div class="col-md-12">

      <b-card header-tag="header" style="min-height: 520px;">
        <h6 slot="header" class="mb-0">Map </h6>
        <b-card-text>

          <l-map :zoom="zoom" :min-zoom="minZoom" :max-zoom="maxZoom" 
          :center="center" style="height: 500px; width: 100%">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

            <!-- <l-marker v-if="showMarker" :lat-lng="marker"> opuk </l-marker>--> 
            
            <l-choropleth-layer :data="cleanedCountyData" 
                 titleKey="county_name" idKey="county_code" :value="value" 
                 geojsonIdKey="COUNTY_COD" 
                 :geojson="countyGeojson" :colorScale="colorScale">
              
              <template slot-scope="props">
                <l-info-control :item="props.currentItem" :unit="props.unit" 
                title="County" placeholder="Hover over a county"/>
                <l-reference-chart title="Activities in counties" 
                :colorScale="colorScale" :min="props.min" :max="props.max" 
                position="topright"/>
              </template>

            </l-choropleth-layer>
          
          </l-map>

        </b-card-text>
      </b-card>
    </div>
 </div>
</template>

<script>
//import { InfoControl, ReferenceChart, ChoroplethLayer } from 'vue-choropleth';
// I need to customize these 
import InfoControl   from '@/components/vue-choropleth/InfoControl.vue';
import ReferenceChart  from '@/components/vue-choropleth/ReferenceChart.vue';
import ChoroplethLayer    from '@/components/vue-choropleth/ChoroplethLayer.vue';

import {LMap, LTileLayer, LMarker} from 'vue2-leaflet' ;
//import {geojson} from '@/data/counties.min.json';
import countyGeojson from '@/data/counties.min.json';

export default {
  name: 'DashboardMap',
  props: {
    countyData: Array,
    dashParams: Object,
    seloptions: Object,
  },
  components: {
    LMap, 
    LTileLayer,
    LMarker,
    'l-info-control': InfoControl, 
    'l-reference-chart': ReferenceChart, 
    'l-choropleth-layer': ChoroplethLayer,
  },
  data() {
    return {
      zoom:6,
      minZoom: 2,
      maxZoom: 10,
      center: L.latLng(0.3, 38),
      url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(1, 38),
      showMarker: true,

      value: {
        key: "total",
        metric: " USD"
      },
      /*
      extraValues: [{
        key: "amount_m",
        metric: "% boys"
      }],*/
     
      countyGeojson,
      //colorScale: ["e7d090", "e9ae7b", "de7062"],
      colorScale: ["ddbb60", "de893d", "b73826"],

      cleanedCountyData: [],

    };
  
  },

  watch: {

    countyData: function () {
      var vm = this ;

      var cleanedCountyData = this.$_.map(this.countyData, function(el) {
          return { county_code: parseInt(el.county_code), county_name: el.county_name, total: el.total };
      });

      this.cleanedCountyData = cleanedCountyData ;
      
    }
  
  },

  methods: {
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
