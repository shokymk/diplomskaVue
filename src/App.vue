<template>
  <div id="app">
    <nav class="navbar navbar-expand navbar-dark bg-dark">
      <a href="#" class="navbar-brand">MyEvents</a>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <a href="/events" class="nav-link">
            <font-awesome-icon icon="home" /> Events
          </a>
        </li>
        <li class="nav-item">
          <a href="/trackedEvents" class="nav-link" v-if="currentUser">Tracked Events</a>
        </li> 
        <li class="nav-item">
          <a href="/addEvent" class="nav-link" v-if="currentUser">Add Event</a>
        </li> 
      </div>

      <div class="navbar-nav ml-auto" v-if="!currentUser">
        <li class="nav-item">
          <a href="/register" class="nav-link">
            <font-awesome-icon icon="user-plus" /> Sign Up
          </a>
        </li>
        <li class="nav-item">
          <a href="/login" class="nav-link">
            <font-awesome-icon icon="sign-in-alt" /> Login
          </a>
        </li>
      </div>

      <div class="navbar-nav ml-auto" v-if="currentUser">
        <li class="nav-item">
          <a href="/profile" class="nav-link">
            <font-awesome-icon icon="user" />
            {{currentUser.username}}
          </a>
        </li>
        <li class="nav-item">
          <a href class="nav-link" @click="logOut">
            <font-awesome-icon icon="sign-out-alt" /> LogOut
          </a>
        </li>
      </div>
    </nav>

    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  methods: {
    logOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/login');
    }
  }
};
</script>