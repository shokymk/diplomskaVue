<template>
  <div class="list row">
    <div class="col-md-6">
      <br>
      <h4>My tracked events</h4>
      <br>
      <ul class="list-group">
        <li
          class="list-group-item h-50"
          :class="{ active: index == currentIndex }"
          v-for="(event, index) in events"
          :key="index"
          @click="setActiveEvent(event, index)"
        >
          <img :src="event.imgUrl" class="imgThumb float-left" />
          <div style="font-style:13px">{{ event.name }}</div>
          {{ formattedDate(event.dateScheduled)}}
          <br>
          <div style="float:right; color:blue;"> {{event.category}} </div>
        </li>
      </ul>
    </div>
    <div class="col-md-6">
      <div v-if="currentevent">
        <h4>Event</h4>
        <div>
          <img :src="currentevent.imgUrl" class="img-fluid" />
        </div>
        <div>
          <label>
            <strong>Title:</strong>
          </label>
          {{ currentevent.name }}
        </div>
        <div>
          <label>
            <strong>Date:</strong>
          </label>
          {{ formattedDate(currentevent.dateScheduled) }}
        </div>
        <div>
          <label>
            <strong>Description:</strong>
          </label>
          <br />
          <label style="white-space: pre-wrap">{{ currentevent.description }}</label>
        </div>
        <div>
          <label>
            <strong>Tags:</strong>
          </label>
          <br />
          <div class="tag" v-for="tag in currentevent.tags" :key="tag">
            <button class="btn btn-info" @click="eventsByTag(tag)">
              <i v-bind:class="'material-icons'">{{tag}}</i>
            </button>
          </div>
        </div>
        <div>
          <label>
            <strong>Category:</strong>
          </label>
          {{ currentevent.category }}
        </div>
        
        <button class="btn btn-outline-dark" @click="untrackEvent()" >Untrack event</button>
      
      </div>
      <div v-else>
        <br />
        <p>Please click on an event...</p>
      </div>
    </div>
  </div>
</template>

<script>
import eventDataService from "../services/eventDataService";
import moment from "moment";

export default {
  name: "tracked-list",
  data() {
    return {
      events: [],
      currentevent: null,
      currentIndex: -1,
      title: "",
      searchedTerm: "",
      placeholderSearch: "Search by Title",
      searchBy: "Title"
    };
  },
  methods: {
    retrieveTrackedEvents() {
      eventDataService
        .getTrackedEvents()
        .then(response => {
          this.events = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    formattedDate(date) {
      return moment(date).format("MMM Do YYYY, h:mm a");
    },
    refreshList() {
      this.retrieveTrackedEvents();
      this.currentevent = null;
      this.currentIndex = -1;
    },
    untrackEvent() {
      eventDataService
        .untrackEvent({
          id: this.currentevent.id
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    this.events.splice(this.events.indexOf(this.currentevent),1);
    this.currentevent=null;
    this.currentIndex=-1;
    },
    setActiveEvent(event, index) {
      this.currentevent = event;
      this.currentIndex = index;
    }
  },

  mounted() {
    this.refreshList();
  }
};
</script>

<style>
.imgThumb {
  width: 30%;
  margin: 3px;
}
.list {
  text-align: left;
  max-width: 1150px;
  margin: auto;
}
.tag {
  display: inline-block;
  margin: 2px;
}
</style>