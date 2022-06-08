<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    metaInfo() {
      return {
        title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
        titleTemplate: title => {
          return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
        }
      }
    }
  }
</script>
<style>

  /*.el-loading-spinner {*/
  /*  height: 100px;*/
  /*  background-image: url('assets/images/loading.gif');*/
  /*  background-repeat: no-repeat;*/
  /*  background-position: center;*/
  /*  background-size: contain;*/
  /*  background-color: unset;*/
  /*}*/

  /*.el-loading-spinner .circular {*/
  /*  display: none;*/
  /*}*/
</style>
