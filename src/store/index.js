import Vue from 'vue'
import Vuex from 'vuex'
import getters from '@/store/getters'
import app from '@/store/modules/app'
import permission from '@/store/modules/permission'
import settings from '@/store/modules/settings'
import user from '@/store/modules/user'
import tagsView from '@/store/modules/tagsView'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user,
    tagsView
  },
  getters
});

export default store
