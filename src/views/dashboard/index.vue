<template>
  <div class="dashboard-container">
    <div class="dashboard-text">{{userName}}</div>
    <div class="dashboard-text"></div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'Dashboard',
    data(){
      return {}
    },
    computed: {
      ...mapGetters([
        'userName',
        'roleCodes'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }

    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
