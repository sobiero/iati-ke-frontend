<template>
  <div class="home">
    <dashboard-controls msg="Welcome to Your Vue.js Appx"> </dashboard-controls>
  </div>
</template>

<script>
// @ is an alias to /src
import DashboardControls from '@/components/DashboardControls.vue';

export default {
  name: 'home',
  components: {
    DashboardControls,
  },
};
</script>
