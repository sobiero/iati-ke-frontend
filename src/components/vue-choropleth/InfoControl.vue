<template>

</template>

<script>
import numeral from 'numeral';

export default {
  props: {
    item: Object,
    unit: String,
    placeholder: {
      type: String,
      default: '',
    },
    title: String,
    position: {
      type: String,
      default: 'bottomleft',
    },
  },
  mounted() {
    const {
      unit, title, placeholder, position,
    } = this;

    this.mapObject = L.control({
      position,
    });
    this.mapObject.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info infoCtrl'); // create a div with a class "info"
      this.update({
        name: '', value: 0, unit, placeholder, title,
      });
      return this._div;
    };
    this.mapObject.update = function ({
      name,
      value,
      extraValues = undefined,
      unit,
      title,
      placeholder,
    }) {
      if (name.length > 0) {
        this._div.innerHTML = `<h5> ${title} </h5>
                    <b> ${name} </b><br /> ${numeral(value).format('0.0a')} ${unit} `;
        if (extraValues) {
          for (const x of extraValues) {
            this._div.innerHTML = `${this._div.innerHTML}<br /> ${x.value} ${x.metric}`;
          }
        }
      } else {
        this._div.innerHTML = `<h4> ${title} </h4> <b> ${placeholder} </b>`;
      }
    };

    if (this.$parent._isMounted) {
      this.deferredMountedTo(this.$parent.mapObject);
    }
  },
  methods: {
    deferredMountedTo(parent) {
      this.parent = parent;
      this.mapObject.addTo(parent);
    },
  },
  watch: {
    item(newValue) {
      this.mapObject.update({
        ...newValue,
        unit: this.unit,
        title: this.title,
        placeholder: this.placeholder,
      });
    },
  },
  beforeDestroy() {
    if (this.parent) {
      this.parent.removeLayer(this.mapObject);
    }
  },
};
</script>
<style>
.info {
  padding: 6px 8px;
  font: 18px/20px sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.info h4 {
  margin: 0 0 5px;
  color: #777;
}
</style>
