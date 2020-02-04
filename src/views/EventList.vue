<template>
  <div class="list row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Search by title"
          v-model="title"/>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button"
            @click="searchTitle"
          >
            Search
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <h4>events List</h4>
      <ul class="list-group">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(event, index) in events"
          :key="index"
          @click="setActiveEvent(event, index)"
        >
        <img :src='event.imgUrl' class="imgThumb float-left imgThumb"/> 
          {{ event.name }}
        </li>
      </ul>
    </div>
    <div class="col-md-6">
      <div v-if="currentevent">
        <h4>Event</h4>
        <div>
          <img :src='currentevent.imgUrl' class="img-fluid"/>
        </div>
        <div>
          <label><strong>Title:</strong></label> {{ currentevent.name }}
        </div>
        <div>
          <label><strong>Description:</strong></label><br> <label style='white-space: pre-wrap'> {{ currentevent.description }} </label>
        </div>
        <div>
          <label><strong>Tags:</strong></label><br>
          <div class="tag" v-for="tag in currentevent.tags" :key="tag">
            <button class="btn btn-info" @click="eventsByTag(tag)">
            <i v-bind:class="'material-icons'">{{tag}}</i>
    </button>           
</div>
        </div>
        <div>
          <label><strong>Date:</strong></label> {{ formattedDate(currentevent.date) }}
        </div>
        <div>

        </div>

        <a class="badge"
          :href="'/events/' + currentevent.id"
        >
          Edit
        </a>
      </div>
      <div v-else>
        <br />
        <p>Please click on a event...</p>
      </div>
    </div>
  </div>
</template>

<script>
import eventDataService from "../services/eventDataService";
import moment from 'moment';

export default {
  name: "events-list",
  data() {
    return {
      events: [],
      currentevent: null,
      currentIndex: -1,
      title: ""
    };
  },
  methods: {
    eventsByTag(tag) {
      console.log(tag);
      eventDataService.getByTag(tag)
        .then(response => {
          this.events = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    retrieveevents() {
      eventDataService.getAll()
        .then(response => {
          this.events = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    formattedDate(date) {
      console.log(moment(date).format('MMMM Do YYYY, h:mm:ss a'));
      return moment(date).format('MMMM Do YYYY, h:mm:ss a')
    },
    refreshList() {
      this.retrieveevents();
      this.currentevent = null;
      this.currentIndex = -1;
    },

    setActiveEvent(event, index) {
      this.currentevent = event;
      this.currentIndex = index;
    },

    // removeAllevents() {
    //   eventDataService.deleteAll()
    //     .then(response => {
    //       this.refreshList();
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     });
    // },
    
    searchTitle() {
      eventDataService.findByTitle(this.title)
        .then(response => {
          this.events = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.retrieveevents();
  }
};
</script>

<style>
.imgThumb{
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