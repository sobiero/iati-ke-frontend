<template>
  <div id="app" style="background-color:#e9e9e9;">
    <div id="nav">
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
      <nav-bar></nav-bar>
    </div>

    <div class="container-fluid">
      <div class="col-md-12">
           <router-view></router-view>
      </div>
    </div>

    <footer class="footer fixed-bottom text-center bg-info pt-2 pb-2">
     <small class="text-white">&copy; @obierosimon 2019 </small>
    </footer>

    <notifications group="api-notif"></notifications>

  </div>
</template>

<script>

import NavBar from './components/NavBar.vue'
export default {
  name: 'app',
  components: {
    //HelloWorld
    NavBar
  },

  data() {
    return {
      menu: [],
    }
 },

};

</script>


<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height:650px;
}
</style>
