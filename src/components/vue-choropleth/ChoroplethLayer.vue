<template>
  <div>
    <l-geo-json :geojson="geojsonData.geojson" :options="geojsonOptions" ref="geolayer"></l-geo-json>
    <slot :currentItem="currentItem" :unit="value.metric" :min="min" :max="max" :selcounty="selcounty"></slot>
  </div>
</template>
<script>

import { LGeoJson } from 'vue2-leaflet';
import {
  getMin, getMax, normalizeValue, getColor, validNumber,
} from '../choropleth-util';
import EventBus from '../../eventBus';

function mouseover({ target }) {
  target.setStyle({
    weight: this.currentStrokeWidth,
    color: `#${this.currentStrokeColor}`,
    dashArray: '',
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    target.bringToFront();
  }

  const geojsonItem = target.feature.properties;
  const item = this.geojsonData.data.find(
    x => x[this.idKey] === Number(geojsonItem[this.geojsonIdKey]),
  );
  let tempItem = { name: item[this.titleKey], value: item[this.value.key] };
  if (this.extraValues) {
    const tempValues = [];
    for (const x of this.extraValues) {
      tempValues.push({
        value: item[x.key],
        metric: x.metric,
      });
    }
    tempItem = { ...tempItem, extraValues: tempValues };
  }
  this.currentItem = tempItem;

  EventBus.$emit('interaction', {name: 'map-geojson', type: 'geojson', event: 'hover', data: { tempItem }});

}

function mouseout({ target }) {
  target.setStyle({
    weight: this.strokeWidth,
    color: `#${this.strokeColor}`,
    dashArray: '',
  });

  EventBus.$emit('interaction', {name: 'map-geojson', type: 'geojson', event: 'hover-out', data: { item: this.currentItem }});

  this.currentItem = { name: '', value: 0 };
}

function mouseclick({ target }) {
  const geojsonItem = target.feature.properties;
  // console.log( geojsonItem.COUNTY_COD );
  // this.$root.$emit('countyClicked', geojsonItem.COUNTY_COD );

  EventBus.$emit('countyClicked', geojsonItem.COUNTY_COD);
  EventBus.$emit('interaction', {name: 'map-geojson', type: 'geojson', event: 'click', data: { clicked: geojsonItem }});
}

export default {
  props: {
    geojson: Object,
    data: Array,
    center: Array,
    colorScale: Array,
    titleKey: String,
    idKey: String,
    value: Object,
    extraValues: Array,
    geojsonIdKey: String,
    mapStyle: Object,
    zoom: Number,
    mapOptions: Object,
    strokeColor: { type: String, default: 'fff' },
    currentStrokeColor: { type: String, default: '666' },
    strokeWidth: { type: Number, default: 2 },
    currentStrokeWidth: { type: Number, default: 5 },
    selcounty: String,
  },
  mounted() {
    if (this.$parent._isMounted) {
      this.deferredMountedTo(this.$parent.mapObject);
    }

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

  },
  data() {
    return {

      dashboardLoading: true,

      currentItem: { name: '', value: 0 },
      geojsonOptions: {
        style: (feature) => {
          const itemGeoJSONID = Number(feature.properties[this.geojsonIdKey]);
          const color = 'NONE';
          const { data } = this.geojsonData;
          const item = data.find(x => x[this.idKey] === itemGeoJSONID);
          if (!item) {
            return {
              color: 'white',
              weight: this.strokeWidth,
            };
          }
          const valueParam = Number(item[this.value.key]);
          if (!validNumber(valueParam)) {
            return {
              color: 'white',
              weight: this.strokeWidth,
            };
          }
          const { min, max } = this;

          return {
            weight: this.strokeWidth,
            opacity: 1,
            color: `#${this.strokeColor}`,
            dashArray: '3',
            fillOpacity: 0.7,
            fillColor: getColor(valueParam, this.colorScale, min, max),
          };
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: mouseover.bind(this),
            mouseout: mouseout.bind(this),
            click: mouseclick.bind(this),
          });
        },
      },
    };
  },
  computed: {
    min() {
      return getMin(this.geojsonData.data, this.value.key);
    },
    max() {
      return getMax(this.geojsonData.data, this.value.key);
    },
    geojsonData() {
      return { geojson: { ...this.geojson }, data: this.data };
    },
  },
  components: {
    LGeoJson,
  },
  methods: {
    deferredMountedTo(parent) {
      this.parent = parent;
      for (let i = 0; i < this.$children.length; i++) {
        if (typeof this.$children[i].deferredMountedTo === 'function') {
          this.$children[i].deferredMountedTo(parent);
        }
      }
    },
  },
};
</script>
