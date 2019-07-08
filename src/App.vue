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
     <small class="text-white">&copy; 2019 Obiero Simon

      &nbsp;&nbsp;&nbsp;
      <span class="user">
      <a href="https://www.linkedin.com/in/obierosimon/" target="_blank" title="LinkedIn"> <fa-icon :icon="['fab', 'linkedin']"></fa-icon></a>
      &nbsp;&nbsp;<a href="https://github.com/sobiero" target="_blank"> <fa-icon :icon="['fab', 'github']"></fa-icon></a>
      &nbsp;&nbsp;<a href="https://twitter.com/obierosimon" target="_blank"> <fa-icon :icon="['fab', 'twitter']"></fa-icon></a>
      </span>
      &nbsp;&nbsp; | &nbsp;&nbsp;
     <span xstyle="display:inline-block;width:40%;" class="pull-right">
         <a href="https://github.com/sobiero/iati-ke-frontend" target="_blank"><fa-icon :icon="['fab', 'github']"></fa-icon> Source Code</a>
     </span>

     </small>


    </footer>

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


footer span.user a {
  font-size:1.2em;
}

footer span a {
  color:white;
}
footer span a:hover {
  color:#ffff00;
}
</style>
