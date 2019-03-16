<template>
  
  <div class="row">    
   <div class="col-md-12">

      <b-card header-tag="header" id="userpaneopts"  style="min-height: 540px;" >
        <span slot="header" class="mb-0 text-right"> 
          
            <!-- <b-dropdown :text="breakDownOption" class="btn-default" size="sm">
              <b-dropdown-item>View Break down by Counties</b-dropdown-item>
              <b-dropdown-item>View Break down by Contributing Organization</b-dropdown-item>
              <b-dropdown-item>View Break down by SDGs</b-dropdown-item>
              <b-dropdown-item>View Break down by Transaction Type</b-dropdown-item>
            </b-dropdown> -->

            <b-form-select size="sm" v-model="selBreakDown" :options="breakDownOptions" style="max-width:360px;"> </b-form-select>

        <div class='pull-right' style="display:inline-block;"><fa-icon icon="chart-pie"> </fa-icon>&nbsp;
        <fa-icon icon="chart-bar"> </fa-icon>&nbsp;
        <fa-icon icon="table"> </fa-icon>&nbsp; </div>

        </span>
        <b-card-text>
          



        </b-card-text>
      </b-card>
    
    </div>
 </div>
</template>

<script>

export default {
  name: 'DashboardUserPane',
  props: {
    msg: String,
    dashParams: Object,
    seloptions: Object,

  },
  components: {

  },
  data() {
    return {

      breakDownOptions: [
      {value: 1, text:'View Break down by Recepient Counties'},
      {value: 2, text:'View Break down by Recepient SDGs'},
      {value: 3, text:'View Break down by Contributing Organizations'},
      {value: 4, text:'View Break down by Transaction Types'},
      ],
      selBreakDown: 1,

    };
  
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

#userpaneopts .card-header {
 padding-bottom: 0.14em;;
 padding-top: 0.14em;;

}

#userpaneopts span {
 padding: 0.14em;
}
</style>
