import Vue from 'vue';
import App from './App.vue';
import { router } from './router';
import store from './store';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VeeValidate from 'vee-validate';
import vSelect from 'vue-select'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import 'vue-select/dist/vue-select.css';
import * as VueGoogleMaps from 'vue2-google-maps'

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('v-select', vSelect)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCvyiNcC-MHEmWvBgzQKcxZvPk-YsjK4Ws',
    libraries: 'places',
    },
 installComponents: true
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');