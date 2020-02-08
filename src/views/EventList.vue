<template>
  <div class="list row">
    <div class="col-md-8">
      <div class="input-group mb-3">
        <div style="width:80%;" v-if="searchBy=='Category'">
          <v-select
            v-model="searchedTerm"
            name="category"
            :options="['Music', 'Culture', 'Education',
          'Causes', 'Sports' ]"
            :searchable="false"
          ></v-select>
        </div>
        <div v-else style="width:80%;">
          <input
            type="text"
            class="form-control"
            :placeholder="placeholderSearch"
            v-model="searchedTerm"
          />
        </div>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="searchTitle">Search</button>
          <button class="btn btn-outline-secondary" type="button" @click="clearSearch">Clear</button>
        </div>
      </div>
    </div>
    <div class="col-md-8">
      Search by :
      <div class="btn-group btn-group-toggle" data-toggle="buttons">
        <label class="btn btn-secondary active">
          <input
            type="radio"
            name="searchBy"
            id="byTitle"
            value="Title"
            autocomplete="off"
            checked
            v-on:click="changeSearch('Title')"
          />
          Title
        </label>
        <label class="btn btn-secondary">
          <input
            type="radio"
            name="searchBy"
            id="byTag"
            value="Tag"
            autocomplete="off"
            v-on:click="changeSearch('Tag')"
          />
          Tag
        </label>
        <label class="btn btn-secondary">
          <input
            type="radio"
            name="searchBy"
            id="byCategory"
            value="Category"
            autocomplete="off"
            v-on:click="changeSearch('Category')"
          />
          Category
        </label>
        <label class="btn btn-secondary">
          <input
            type="radio"
            name="searchBy"
            id="byDate"
            value="Date"
            autocomplete="off"
            v-on:click="changeSearch('Date')"
          /> Date
        </label>
      </div>
    </div>
    <div class="col-md-6">
      <h4>Events List</h4>
      <ul class="list-group">
        <li
          class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(event, index) in events"
          :key="index"
          @click="setActiveEvent(event, index)"
        >
          <img :src="event.imgUrl" class="imgThumb float-left" />
          <div style="font-style:13px">{{ event.name }}</div>
          {{ formattedDate(event.dateScheduled)}}
          <br />
          <div style="float:right; color:blue;">{{event.category}}</div>
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

        <button
          v-if="currentevent.isTracked"
          class="btn btn-outline-dark"
          @click="untrackEvent()"
        >Untrack event</button>

        <button v-else class="btn btn-outline-dark" @click="trackEvent()">Track event</button>
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
  name: "events-list",
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
    eventsByTag(tag) {
      eventDataService
        .getByTag(tag)
        .then(response => {
          this.events = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    eventsByCategory(category) {
      eventDataService
        .getByCategory(category)
        .then(response => {
          this.events = response.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    changeSearch(val) {
      console.log(val);
      this.searchBy = val;
      this.searchedTerm = "";
      this.placeholderSearch = "Search by " + val;
    },
    retrieveevents() {
      eventDataService
        .getAll()
        .then(response => {
          this.events = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    formattedDate(date) {
      return moment(date).format("MMMM Do YYYY, h:mm a");
    },
    refreshList() {
      this.retrieveevents();
      this.currentevent = null;
      this.currentIndex = -1;
    },

    setActiveEvent(event, index) {
      
      this.currentevent = null;
       if (this.currentUser) {
        eventDataService
          .isEventTracked(event.id)
          .then(response => {
            this.currentevent = event;
            this.currentIndex = index;
            this.currentevent.isTracked = response.data  ;

            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      }
    },

    searchTitle() {
      if (this.searchBy == "Title") {
        eventDataService
          .findByTitle(this.searchedTerm)
          .then(response => {
            this.events = response.data;
            console.log(response.data);
          })
          .catch(e => {
            console.log(e);
          });
      }
      if (this.searchBy == "Tag") {
        this.eventsByTag(this.searchedTerm);
      }
      if (this.searchBy == "Category") {
        this.eventsByCategory(this.searchedTerm);
      }
    },
    trackEvent() {
      eventDataService
        .trackEvent({
          id: this.currentevent.id
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
      this.setActiveEvent(this.currentevent, this.currentIndex);
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
      this.setActiveEvent(this.currentevent, this.currentIndex);
    },
    clearSearch() {
      this.refreshList();
    }
  },
  computed: {
    currentUser() {
      return this.$store.state.auth.user;
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