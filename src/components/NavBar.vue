<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">IATI-SDG-KE</b-navbar-brand>

    <b-navbar-toggle target="nav_collapse" />

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <!-- <b-nav-item href="#">Link</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item> -->
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" type="text" v-model="searchTerm" placeholder="Search" />
          <b-button size="sm" class="my-2 my-sm-0" @click="search()" type="button">Search</b-button>
        </b-nav-form>

        <flag :iso="currencyFlag" :squared="false" style="display:inline-block;margin: 0 0 0 10px;" />

        <b-nav-item-dropdown text="Currency" right style="z-index:1030">
          <b-dropdown-item href="#" @click="setCurrency('USD', 'drop')"><flag iso="us" :squared="false" /> USD</b-dropdown-item>
          <b-dropdown-item href="#" @click="setCurrency('KES', 'drop')"><flag iso="ke" :squared="false" /> KES</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right style="z-index:1030" id="popover-reactive-1" :disabled="popoverShow">
          <!-- Using button-content slot -->
          <template slot="button-content" > User </template>
          <b-dropdown-item href="#">Preferences</b-dropdown-item>
          <!-- <b-dropdown-item href="#" class="mute">Signout</b-dropdown-item> -->
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>


   <b-popover id="pref-popover"
      target="popover-reactive-1"
      triggers="click"
      :show.sync="popoverShow"
      placement="left"
      container="my-container"
      ref="popover"
      @show="onShow"
      @shown="onShown"
      @hidden="onHidden"
    >
      <template slot="title">
        <b-button @click="onClose" class="close" aria-label="Close">
          <span class="d-inline-block" aria-hidden="true">&times;</span>
        </b-button>
        User Preferences
      </template>

      <div>
      Choose defaults:
        <b-form-group
          label="Email"
          label-for="popover-email"
          label-cols="3"

          class="mb-1"
          description="Email (optional)"

        >
          <b-form-input
            ref="userEmail"
            id="popover-email"
            v-model="prefs.userEmail"
            size="sm"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          label="Currency"
          label-for="popover-currency"
          label-cols="3"
          :state="userCurrencyState"
          class="mb-1"
          description="Choose default Currency"
          invalid-feedback="This field is required"
        >
          <b-form-select
            id="popover-currency"
            v-model="prefs.userCurrency"
            :state="userCurrencyState"
            :options="options"
            size="sm"
          ></b-form-select>
        </b-form-group>

        <!-- <b-alert show class="small">
          <strong>Current Values:</strong><br>
          Name: <strong>{{ userEmail }}</strong><br>
          Color: <strong>{{ userCurrency }}</strong>
        </b-alert> -->

        <div class="pull-right">
        <b-button @click="onClose" size="sm" variant="danger">Cancel</b-button>&nbsp;
        <b-button @click="onOk" size="sm" variant="primary">Ok</b-button>&nbsp;
        </div>

      </div>
    </b-popover>



   <b-modal id="welcome" title="Welcome to IATI-SDG-KE" size="lg" >
    <p class="my-4">

    This portal is prototype to demonstrate how a country can use IATI data to show how development activities are being...

    <br /> In this prototype, we are using IATI data to show Organizations publishing to IATI are contributing towards the attainment of Sustainable Development Goals in the Kenyan Counties.

    </p>
  </b-modal>

</div>
</template>

<script>

import EventBus from '../eventBus';


export default {
  name: 'NavBar',
  props: {
    msg: String
  },
  data () {
    return {

      currencyChanger: 'default',
      searchTerm: '',
      currencyFlag: 'us',

      //userEmailState: null,
      userCurrencyState: null,
      options: ['USD', 'KES'],
      userEmailReturn: '',
      userCurrencyReturn: '',
      popoverShow: false,

      prefs: {
        userEmail: '',
        userCurrency: '',
      }


    }
  },

  methods: {

    setCurrency(cur, emit) {

      if (typeof emit != 'undefined')
      {
        this.currencyChanger = 'select';
      }

      var curObj = {};
      if ( cur == 'USD' )
      {

         curObj = {cur: 'USD', rate: 1 };
         this.currencyFlag = 'us';

      } else {

         curObj = {cur: 'KES', rate: 101 };
         this.currencyFlag = 'ke';

      }

      EventBus.$emit('exRate', curObj );

    },

    search() {

         this.$bvToast.toast('Sorry, the search function is still under developement', {
              title: 'Search Function Unavailable',
              variant: 'info',
              autoHideDelay: 5000,
              solid: true
         });

     },

     //

      onClose() {
        this.popoverShow = false
      },
      onOk() {

        localStorage.prefs = JSON.stringify(this.prefs) ;

        if (this.prefs.userCurrency != '')
        {
           this.setCurrency(this.prefs.userCurrency);
        }

        /*
        if (!this.prefs.userEmail) {
          this.userEmailState = false
        }
        if (!this.userCurrency) {
          this.userCurrencyState = false
        }
        if (this.prefs.userEmail && this.prefs.userCurrency) {
          this.onClose()
          // Return our popover form results
          this.userEmailReturn = this.prefs.userEmail
          this.userCurrencyReturn = this.prefs.userCurrency
        }*/

      },
      onShow() {
        // This is called just before the popover is shown
        // Reset our popover form variables

        //var prefs = JSON.parse( localStorage.prefs );

        if (typeof localStorage.prefs != 'undefined' && typeof (JSON.parse( localStorage.prefs )) == 'object' )
        {
          this.prefs = JSON.parse( localStorage.prefs ) ;
        }
        else
        {
          this.prefs.userEmail = '';
          this.prefs.userCurrency = '';
        }

        //this.userEmailState = null
        //this.userCurrencyState = null
        //this.userEmailReturn = ''
        //this.userCurrencyReturn = ''
      },
      onShown() {
        // Called just after the popover has been shown
        // Transfer focus to the first input
        this.focusRef(this.$refs.userEmail)
      },
      onHidden() {
        // Called just after the popover has finished hiding
        // Bring focus back to the button
        //this.focusRef(this.$refs.button)
      },
      focusRef(ref) {
        // Some references may be a component, functional component, or plain element
        // This handles that check before focusing, assuming a `focus()` method exists
        // We do this in a double `$nextTick()` to ensure components have
        // updated & popover positioned first
        this.$nextTick(() => {
          this.$nextTick(() => {
            ;(ref.$el || ref).focus()
          })
        })
      }

     //

  },

  mounted() {

     var browserId = localStorage.browserId ;
     if (typeof browserId == 'undefined' || browserId == '' )
     {
       localStorage.browserId = this.$uuid.v4();
     }

     this.$bvModal.show('welcome') ;

     EventBus.$on('xhr-dashboard', (payload) => {
         if ( typeof localStorage.prefs != 'undefined'
              && typeof (JSON.parse( localStorage.prefs )) == 'object'
              && this.currencyChanger == 'default'
         )
         {
            var prefs = JSON.parse( localStorage.prefs );
            this.setCurrency( prefs.userCurrency );
         }
     });

  },

  watch : {

      userEmail(val) {
        if (val) {
          this.userEmailState = true
        }
      },
      userCurrency(val) {
        if (val) {
          this.userCurrencyState = true
        }
      }

  }

}
</script>

<style scoped>

div.popover {
  max-width:500px !important;
}

div.popover input, div.popover select {
  font-size:0.8em;
}

</style>
