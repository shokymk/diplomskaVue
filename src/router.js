import Vue from 'vue';
import Router from 'vue-router';
import EventList from './views/EventList.vue'
import Login from './views/Login.vue';
import Register from './views/Register.vue';
import TrackedEvents from './views/TrackedEvents.vue'

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'events',
      component: EventList
    },
    {
      path: '/events',
      component: EventList
    },    
    {
      path: '/trackedEvents',
      component: TrackedEvents
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/register',
      component: Register
    },
    {
      path: '/profile',
      name: 'profile',
      // lazy-loaded
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/addEvent',
      name: 'add-event',
      // lazy-loaded
      component: () => import('./views/AddEvent.vue')
    },
    {
      path: '/event/:id',
      name: "event-details",
      component: () => import("./views/Event.vue")
    }

  ]
});