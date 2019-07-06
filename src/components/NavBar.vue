<template>
<div>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="#">
    <div class="text-left" style="line-height:99%;margin-left:25px;">
    Open Aid Data for Kenya
    <br><span style="font-size:0.6em;"><em>towards the attainment of the SDGs in Kenya Counties</em></span>
    </div>
    </b-navbar-brand>

    <b-navbar-toggle target="nav_collapse" />

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <!-- <b-nav-item href="#">About</b-nav-item>
        <b-nav-item href="#" disabled>Disabled</b-nav-item> -->
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto" style="margin-right:15px">
        <b-nav-item href="#" @click="showWelcomeModal" xstyle="padding-right:18px;">
        About</b-nav-item>
        <b-nav-item href="#" @click="showSusQuestionnaire" style="padding-right:18px;">
        Questionnaire</b-nav-item>
        <b-nav-form>
          <b-form-input size="sm" class="mr-sm-2" type="text" v-model="searchTerm"
          placeholder="Search" />
          <b-button size="sm" class="my-2 my-sm-0" @click="search()" type="button">
          Search</b-button>
        </b-nav-form>

        <flag :iso="currencyFlag" :squared="false" style="display:inline-block;margin: 0 0 0 10px;" />

        <b-nav-item-dropdown text="Currency" right style="z-index:1030">
          <b-dropdown-item href="#" @click="setCurrencyClick('USD', 'drop')">
          <flag iso="us" :squared="false" /> USD </b-dropdown-item>
          <b-dropdown-item href="#" @click="setCurrencyClick('KES', 'drop')">
          <flag iso="ke" :squared="false" /> KES </b-dropdown-item>
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
        <b-button @click="onClose('btn-x')" class="close" aria-label="Close">
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
        <b-button @click="onClose('btn-cancel')" size="sm" variant="danger">
         Cancel</b-button>&nbsp;
        <b-button @click="onOk" size="sm" variant="primary">Ok</b-button>&nbsp;
        </div>

      </div>
    </b-popover>

   <b-modal id="welcome" title="Welcome to Open Aid Data for Kenya website"
    size="lg">

    <p><strong>About this Website</strong></p>

    <p>This website is a prototype of an academic research project to examine
    different visualization and user interaction techniques for exploring open
    aid data.</p>

    <p>This prototype uses open aid data from the
    <a style="color:#004d71" target="_blank" href="https://www.iatiregistry.org/">
    International Aid Tranasparency Initiative (IATI)</a>
    to show how Organizations publishing to the IATI registry
    are contributing towards the attainment of the Sustainable Development Goals
    (SDGs) in Kenyan Counties.</p>

    <p><strong>IATI data and the SDGs</strong></p>

    <p>This prototype was developed in mid-2019 when much of IATI data did not have
    clear linkages to the SDGs. We were however, able to map IATI's sectors data to the
    SDGs using the <a target="_blank" style="color:#004d71" href="http://ap-unsdsn.org/wp-content/uploads/2017/04/Compiled-Keywords-for-SDG-Mapping_Final_17-05-10.xlsx">
    "Compiled Keywords for SDG Mapping"</a> developed by the <a style="color:#004d71" href="http://ap-unsdsn.org/" target="_blank">
    Sustainable Development Solutions Network </a>.

    </p>

    <p><strong>IATI data and the Kenyan Counties</strong></p>

    <p>While it is not mandatory to publish location informaton, some organizations
    have published detailed information about the exact locations where they have
    have carried out their development activies, including the name of the locations
    and latitude & longitude coordinates.

    </p>


  </b-modal>

  <b-modal id="sus-questionnaire" title="System Usability Questionnaire"
  size="lg">

    <sus-questionnaire></sus-questionnaire>

  </b-modal>


   <vue-cookie-accept-decline style="max-width:550px;"
    :ref="'iati-ke'"
    :elementId="'iati-ke'"
    :debug="false"
    :position="'bottom-left'"
    :type="'floating'"
    :disableDecline="true"
    :transitionName="'slideFromBottom'"
    :showPostponeButton="false"
    @status="cookieStatus"
    @clicked-accept="cookieClickedAccept"
    @clicked-decline="cookieClickedDecline">

    <!-- Optional -->
    <div slot="postponeContent">
        &times;
    </div>

    <!-- Optional -->
    <div slot="message" style="font-size:0.85em;">
        This website stores cookies on your computer. These cookies are used to collect information
        about how you interact with our website and allow us to remember you. We use this information
        in order to improve and customize your browsing experience and for analytics and metrics
        about our visitors on this website.
    </div>

    <!-- Optional -->
     <div slot="declineContent">
       OPT OUT
    </div>

    <!-- Optional -->
    <div slot="acceptContent">
        GOT IT!
    </div>
</vue-cookie-accept-decline>


</div>
</template>

<script>

import EventBus from '../eventBus';
import SusQuestionnaire from '@/components/SusQuestionnaire.vue';

export default {
  name: 'NavBar',
  props: {
    msg: String
  },

  components: {
    SusQuestionnaire,
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

    cookieClickedAccept() {

        // alert( this.cookieStatus );

    },
    cookieClickedDecline() {

       // alert( this.cookieStatus );

    },

    cookieStatus() {

    },

    showWelcomeModal()
    {
      this.$bvModal.show('welcome') ;

      EventBus.$emit('interaction', {name: 'about', type: 'link', event: 'click', data:{} });

    },

    showSusQuestionnaire()
    {
      this.$bvModal.show('sus-questionnaire') ;
      EventBus.$emit('interaction', {name: 'questionnaire', type: 'link', event: 'click', data:{} });

    },

    setCurrencyClick(cur, emit)
    {

       EventBus.$emit('interaction', {name: 'currency', type: 'link', event: 'click', data: { cur: cur} });
       this.setCurrency(cur, emit) ;

    },

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

         EventBus.$emit('interaction', {name: 'search', type: 'button', event: 'click', data:{searchTerm: this.searchTerm } });

     },


      onClose(btn) {
        EventBus.$emit('interaction', {name: 'preference-' + btn + '-close', type: 'button', event: 'click', data: this.prefs });
        this.popoverShow = false
      },
      onOk() {

        localStorage.prefs = JSON.stringify(this.prefs) ;

        if (this.prefs.userCurrency != '')
        {
           this.setCurrency(this.prefs.userCurrency);
        }

        EventBus.$emit('interaction', {name: 'preference-btn-ok', type: 'button', event: 'click', data: this.prefs  });

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

        EventBus.$emit('interaction', {name: 'preference', type: 'link', event: 'click', data: this.prefs });

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

     this.showWelcomeModal();

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
