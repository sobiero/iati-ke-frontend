<template>

  <div class="row">
    <div class="col-md-12">

       <div class="text-center col-md-12" style="font-size:2em;" v-if="questionnaire.susAnswered == 1 ">
             Completed <fa-icon class="text-success" icon="check"></fa-icon>
       </div>

       <table v-else class="table table-striped">
       <thead>
       <tr>
        <th style="width:15px;">#</th>
        <th>Question</th>
        <th>Score</th>

       </tr>
       </thead>
       <tbody>
       <tr>
        <td>1</td>
        <td class="s q1" :class="[susQ.qs.q1 != '' ? 'text-success' : '' ]">I think that I would like to use this website frequently  </td>
        <td class="slider q1" :class="[susQ.qs.q1 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="susQ.qs.q1"
             :data="susQ.data"
             :range="susQ.range"
             :marks="susQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"
           >
           </vue-slider>

        </td>
       </tr>
       <tr>
        <td>2</td>
        <td class="s q2" :class="[susQ.qs.q2 != '' ? 'text-success' : '' ]">I found the website unnecessarily complex</td>
        <td class="slider q2" :class="[susQ.qs.q2 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="susQ.qs.q2"
             :data="susQ.data"
             :range="susQ.range"
             :marks="susQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
        <td>3</td>
        <td class="s q3" :class="[susQ.qs.q3 != '' ? 'text-success' : '' ]">I thought the website was easy to use</td>
        <td class="slider q3" :class="[susQ.qs.q3 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="susQ.qs.q3"
             :data="susQ.data"
             :range="susQ.range"
             :marks="susQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
        <td>4</td>
        <td class="s q4" :class="[susQ.qs.q4 != '' ? 'text-success' : '' ]">
        I  think  that  I  would  need  the  support  of  a  technical person to be able to use this website</td>
        <td class="slider q4" :class="[susQ.qs.q4 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="susQ.qs.q4"
             :data="susQ.data"
             :range="susQ.range"
             :marks="susQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
        <td>5</td>
        <td class="s q5" :class="[susQ.qs.q5 != '' ? 'text-success' : '' ]">I found the various functions in this website were well integrated</td>
        <td class="slider q5" :class="[susQ.qs.q5 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="susQ.qs.q5"
             :data="susQ.data"
             :range="susQ.range"
             :marks="susQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
        <td>6</td>
        <td class="s q6" :class="[susQ.qs.q6 != '' ? 'text-success' : '' ]">I  thought there  was  too  much  inconsistency  in  this website</td>
        <td class="slider q6" :class="[susQ.qs.q6 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="susQ.qs.q6"
             :data="susQ.data"
             :range="susQ.range"
             :marks="susQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
       <td>7</td>
        <td class="s q7" :class="[susQ.qs.q7 != '' ? 'text-success' : '' ]">I  would imagine  that  most  people  would  learn  to  use this website very quickly</td>
        <td class="slider q7" :class="[susQ.qs.q7 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="susQ.qs.q7"
             :data="susQ.data"
             :range="susQ.range"
             :marks="susQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
       <td>8</td>
        <td class="s q8" :class="[susQ.qs.q8 != '' ? 'text-success' : '' ]">I found the website very cumbersome to use</td>
        <td class="slider q8" :class="[susQ.qs.q8 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="susQ.qs.q8"
             :data="susQ.data"
             :range="susQ.range"
             :marks="susQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
       <td>9</td>
        <td class="s q9" :class="[susQ.qs.q9 != '' ? 'text-success' : '' ]">I felt very confident using the website</td>
        <td class="slider q9" :class="[susQ.qs.q9 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="susQ.qs.q9"
             :data="susQ.data"
             :range="susQ.range"
             :marks="susQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
       <td>10</td>
        <td class="s q10" :class="[susQ.qs.q10 != '' ? 'text-success' : '' ]">I needed to learn  a  lot  of  things  before  I  could get going with this website</td>
        <td class="slider q10" :class="[susQ.qs.q10 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="susQ.qs.q10"
             :data="susQ.data"
             :range="susQ.range"
             :marks="susQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <!-- <tr>
         <td colspan="3">
          Comments (Optional)
          <b-form-textarea
            id="textarea"
            v-model="susQ.qs.comments"
            placeholder="Comments on your user experience using this website"
            rows="3"
            max-rows="6"
          ></b-form-textarea>

         </td>
       </tr> -->
       <tr>
         <td colspan="3" class="text-right">

            <b-button variant="primary" size="sm" @click="SubmitSusSurveyResponse">Submit Response</b-button>

         </td>
       </tr>
       </tbody>
       </table>

      </div>
  </div>

</template>

<script>

import EventBus from '../eventBus';

export default {
  name: 'SusQuestionnaire',
  props: {

  },
  components: {

  },
  data() {
    return {

       questionnaire: {
           susAnswered: 0,
           genAnswered: 0,
       },

       apiUrl: '/api',

       susQ: {
          data:
            ['1', '2', '3', '4', '5']
          ,
          qs: {
            q1: '',
            q2: '',
            q3: '',
            q4: '',
            q5: '',
            q6: '',
            q7: '',
            q8: '',
            q9: '',
            q10: '',
            comments: '',
          },
          marks:
            {
              '1' : 'Strongly Disagree',
              '2' : '',
              '3' : 'Neutral',
              '4' : '',
              '5' : 'Strongly Agree'
            }
       },

    };
  },

  methods: {

    callbackRange (val) {
      this.rangeValue = val ;
    },

    SubmitSusSurveyResponse() {

      var errors = false;

      this.$_.forOwn( this.susQ.qs , function(v, k) {

        if (k != 'comments' )
        {
          if ( v.trim() == '')
          {
            document.getElementsByClassName(k)[0].classList.add("text-danger");
            document.getElementsByClassName(k)[1].classList.add("text-danger");
            errors = true ;
          } else {
            document.getElementsByClassName(k)[0].classList.remove("text-danger");
            document.getElementsByClassName(k)[1].classList.remove("text-danger");
          }
        }

      });

      if (errors)
      {
         this.$bvToast.toast('Please answer all the questions highlighted in red', {
              title: 'Some questions are not answered',
              variant: 'danger',
              autoHideDelay: 5000,
              solid: true
         });

      } else {


        var data = {};

        data.qs = this.susQ.qs ;

        data.extras = {};
        data.extras.dashboardParams = this.form;
        data.extras.browserId       = localStorage.browserId;
        data.extras.userPref        = {};

        if (typeof localStorage.prefs != 'undefined' && typeof (JSON.parse( localStorage.prefs )) == 'object' )
        {
          data.extras.userPref = JSON.parse( localStorage.prefs ) ;
        }

        this.$axios.post(`${this.apiUrl}/user/sus-questionnaire`, { params:  data  })
        .then((res) => {

          if ( res.data.msg == 'ok' && res.data['http-status'] == 200  )
          {

               EventBus.$emit('sus-ans-saved', res ) ;
               this.questionnaire.susAnswered = 1 ;

          } else {


            this.$bvToast.toast( res.data.data.detail, {
                title: 'An Error Occured',
                variant: 'danger',
                autoHideDelay: 5000,
                solid: true
            });


          }



        })
        .catch((e) => {
           //this.errors.push(e);
           console.log(e);
           this.$bvToast.toast( e, {
                title: 'An Error Occured',
                variant: 'danger',
                autoHideDelay: 5000,
                solid: true
           });

        });


      }


    },

  },

  watch: {


  },

  mounted() {

     if (typeof localStorage.questionnaire != 'undefined' && typeof (JSON.parse( localStorage.questionnaire )) == 'object' )
     {
       this.questionnaire = JSON.parse( localStorage.questionnaire ) ;
     }


  },

  created() {

  },

};
</script>

<style lang="css">

table td {
  font-size:0.8em;
}

div.vue-slider-marks div.vue-slider-mark-label {
  margin-top:3px !important;
  font-size:0.85em !important;
}
div.vue-slider-dot-tooltip-inner span.vue-slider-dot-tooltip-text {
  font-size:0.85em !important;
}

table tr td.slider {
  width:300px;padding: 8px 45px 15px 30px;
}

</style>
