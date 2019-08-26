<template>

  <div class="row">
    <div class="col-md-12">

       <div class="text-center col-md-12" style="font-size:2em;" v-if="questionnaire.genAnswered == 1 ">
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
        <td class="g g1" :class="[genQ.qs.g1 != '' ? 'text-success' : '' ]">
          The
          <b-link class="no-deco" id="over-det">
            'Overview+Details'
          </b-link> <b-tooltip target="over-det"> i.e. simultaneously displaying both an overview and a detailed view of the data, each in a distinct panel </b-tooltip>

          visualization approach made it easier for me to explore the data</td>
        <td class="slider g1" :class="[genQ.qs.g1 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="genQ.qs.g1"
             :data="genQ.data"
             :range="genQ.range"
             :marks="genQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"
           >
           </vue-slider>

        </td>
       </tr>
       <tr>
        <td>2</td>
        <td class="g g2" :class="[genQ.qs.g2 != '' ? 'text-success' : '' ]">The
        <b-link class="no-deco" id="multi-rep">
        'multiple representation'
        </b-link> <b-tooltip target="multi-rep"> i.e. simultaneously representing the same dataset on a map, table, pie chart, bar chart etc... </b-tooltip>
        visualization technique in the web application helped me to extract different types of information from the same dataset</td>
        <td class="slider g2" :class="[genQ.qs.g2 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="genQ.qs.g2"
             :data="genQ.data"
             :range="genQ.range"
             :marks="genQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
        <td>3</td>
        <td class="g g3" :class="[genQ.qs.g3 != '' ? 'text-success' : '' ]">The color consistency for each of the data in all the charts and panels within the website made the whole experience easier for me</td>
        <td class="slider g3" :class="[genQ.qs.g3 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="genQ.qs.g3"
             :data="genQ.data"
             :range="genQ.range"
             :marks="genQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
        <td>4</td>
        <td class="g g4" :class="[genQ.qs.g4 != '' ? 'text-success' : '' ]">
        Using the website, I was able to learn something new about the development activities being carried in the Kenyan Counties</td>
        <td class="slider g4" :class="[genQ.qs.g4 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="genQ.qs.g4"
             :data="genQ.data"
             :range="genQ.range"
             :marks="genQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"
           >
           </vue-slider>

        </td>
       </tr>
       <tr>
        <td>5</td>
        <td class="g g5" :class="[genQ.qs.g5 != '' ? 'text-success' : '' ]">The website helped me to explore aid data for Kenya</td>
        <td class="slider g5" :class="[genQ.qs.g5 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="genQ.qs.g5"
             :data="genQ.data"
             :range="genQ.range"
             :marks="genQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
        <td>6</td>
        <td class="g g6" :class="[genQ.qs.g6 != '' ? 'text-success' : '' ]">The visualization and user-interaction techniques used on the website helped me to easily explore the data than it would have been possible without the use of these techniques</td>
        <td class="slider g6" :class="[genQ.qs.g6 != '' ? 'text-success' : '' ]">

           <vue-slider v-model="genQ.qs.g6"
             :data="genQ.data"
             :range="genQ.range"
             :marks="genQ.marks"
             :tooltip="'focus'"
             :use-keyboard="true"

           >
           </vue-slider>

        </td>
       </tr>
       <tr>
         <td colspan="3">
          Comments (Optional)
          <b-form-textarea
            id="textarea"
            v-model="genQ.qs.comments"
            placeholder="Comments on your user experience using this website"
            rows="3"
            max-rows="6"
          ></b-form-textarea>

         </td>
       </tr>
       <tr>
         <td colspan="3"  class="text-right">

         <b-button variant="primary" size="sm" @click="SubmitGenSurveyResponse">Submit Response</b-button>

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
  name: 'GenQuestionnaire',
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

      genQ: {
        data:
            ['1', '2', '3', '4', '5'],
        qs: {
          g1: '',
          g2: '',
          g3: '',
          g4: '',
          g5: '',
          g6: '',
          comments: '',
        },
        marks:
            {
              1: 'Strongly Disagree',
              2: '',
              3: 'Neutral',
              4: '',
              5: 'Strongly Agree',
            },
      },

    };
  },

  methods: {

    callbackRange(val) {
      this.rangeValue = val;
    },

    SubmitGenSurveyResponse() {
      let errors = false;

      this.$_.forOwn(this.genQ.qs, (v, k) => {
        if (k != 'comments') {
          if (v.trim() == '') {
            document.getElementsByClassName(k)[0].classList.add('text-danger');
            document.getElementsByClassName(k)[1].classList.add('text-danger');
            errors = true;
          } else {
            document.getElementsByClassName(k)[0].classList.remove('text-danger');
            document.getElementsByClassName(k)[1].classList.remove('text-danger');
          }
        }
      });

      if (errors) {
        this.$bvToast.toast('Please answer all the questions highlighted in red', {
          title: 'Some questions are not answered',
          variant: 'danger',
          autoHideDelay: 5000,
          solid: true,
        });
      } else {
        const data = {};

        data.qs = this.genQ.qs;

        data.extras = {};
        data.extras.dashboardParams = this.form;
        data.extras.browserId = localStorage.browserId;
        data.extras.userPref = {};

        if (typeof localStorage.prefs !== 'undefined' && typeof (JSON.parse(localStorage.prefs)) === 'object') {
          data.extras.userPref = JSON.parse(localStorage.prefs);
        }

        this.$axios.post(`${this.apiUrl}/user/gen-questionnaire`, { params: data })
          .then((res) => {
            if (res.data.msg == 'ok' && res.data['http-status'] == 200) {
              EventBus.$emit('gen-ans-saved', res);
              this.questionnaire.genAnswered = 1;

              // alert('hi');
            } else {
              this.$bvToast.toast(res.data.data.detail, {
                title: 'An Error Occured',
                variant: 'danger',
                autoHideDelay: 5000,
                solid: true,
              });
            }
          })
          .catch((e) => {
            // this.errors.push(e);
            console.log(e);
            this.$bvToast.toast(e, {
              title: 'An Error Occured',
              variant: 'danger',
              autoHideDelay: 5000,
              solid: true,
            });
          });
      }
    },

  },

  watch: {


  },

  mounted() {
    if (typeof localStorage.questionnaire !== 'undefined' && typeof (JSON.parse(localStorage.questionnaire)) === 'object') {
      this.questionnaire = JSON.parse(localStorage.questionnaire);
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

table tr td.g {
  padding-right:30px;
}

a.no-deco {
  color:#1f5494;
}

</style>
