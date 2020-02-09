<template>
  <div class="container">
    <header class="jumbotron">
      <h3 class="align-center">
        <strong>{{currentUser.username}}</strong> Profile
      </h3>
    </header>
    <div class="list row">
      <div class="col-md-6">
        <h4>Events organized by you</h4>
        <ul class="list-group">
          <li
            class="list-group-item"
            v-for="(event, index) in events"
            :key="index"
            @click="editEvent(event)"
          >
            <img :src="event.imgUrl" class="imgThumb float-left" />
            <div style="font-style:13px">{{ event.name }}</div>
            {{ formattedDate(event.dateScheduled)}}
            <br />
            <div style="float:right; color:blue;">{{event.category}}</div>
          </li>
        </ul>
      </div>
      
    </div>
  </div>
</template>

<script>

import eventDataService from "../services/eventDataService";
import moment from "moment";

export default {
  name: "profile",
    data() {
    return {
      events: [],
      }
    },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
    }
  },
  mounted() {
    if (!this.currentUser) {
      this.$router.push("/login");
    }
    this.eventsByUser(this.currentUser.username)
  },
  methods: {
    eventsByUser(username) {
      console.log("here");
       eventDataService
        .getByUser(username)
        .then(response => {
          this.events = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    formattedDate(date) {
      return moment(date).format("MMMM Do YYYY, h:mm a");
    },
    editEvent(event) {
      this.$router.push('/event/' + event.id);
    }
  }
};
</script>
<style>
.align-center {
  text-align: center;
}
</style>
<style>
