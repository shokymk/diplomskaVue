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
        <div style="width:80%;" v-else-if="searchBy=='Location'">
                <gmap-autocomplete class="form-control" v-on:place_changed="setAdressSearch">
                    <template v-slot:input="slotProps">
                        <v-text-field outlined
                                      prepend-inner-icon="place"
                                      placeholder="Location Of Event"
                                      ref="input"
                                      v-on:listeners="slotProps.listeners"
                                      v-on:attrs="slotProps.attrs">
                        </v-text-field>
                    </template>
        </gmap-autocomplete>
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
        <label class="btn btn-secondary">
          <input
            type="radio"
            name="searchBy"
            id="byLocation"
            value="Location"
            autocomplete="off"
            v-on:click="changeSearch('Location')"
          /> Location
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
        <h4>
          {{ currentevent.name }}
          </h4>
        <div>
          <img :src="currentevent.imgUrl" class="img-fluid" />
        </div>
        <div>
          <label>
            <strong>Date:</strong>
          </label>
          {{ formattedDate(currentevent.dateScheduled) }}
        </div>
        <button
         style="float:right;"
          class="btn btn-outline-dark"
          @click="trackEvent()">
          {{ trackedButton }}</button>

        <div>
          <label>
            <strong>Organized by:</strong>
          </label>
          <button style="margin-left:5px;" class="btn btn-info" @click="eventsByUser(currentevent.organizedBy)">
              <i v-bind:class="'material-icons'">{{ currentevent.organizedBy }}</i>
            </button>
        </div>
        
        <div>
          <label style="margin-right:5px;">
            <strong>Event location:</strong>
          </label>
          <a :href="currentevent.location.mapUrl" target="_blank">{{ currentevent.location.name }}</a>
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
      searchBy: "Title",
      trackedButton: "Track event",
      locationSearchedId: ""
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
    eventsByLocation(locationId) {
      eventDataService
      .getByLocation(locationId)
      .then(response=> {
        this.events =response.data;
      })
      .catch(e=> {
        console.log(e);
      })
    },
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
    changeSearch(val) {
      console.log(val);
      this.searchBy = val;
      this.searchedTerm = "";
      this.placeholderSearch = "Search by " + val;
      this.locationSearchedId = "";
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
       if (this.currentUser) {
        eventDataService
          .isEventTracked(event.id)
          .then(response => {
            this.currentevent = event;
            this.currentIndex = index;
            this.currentevent.isTracked = response.data  ;
            if(this.currentevent.isTracked) {
              this.trackedButton = "Untrack event"
            }
            else {
              this.trackedButton = "Track event"
            }
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
      if (this.searchBy == "Location") {
        this.eventsByLocation(this.locationSearchedId);
      }
    },
    setAdressSearch(place) {
      this.locationSearchedId = place.place_id;
    },
    trackEvent() {
      if(this.currentevent.isTracked) {
        eventDataService
        .untrackEvent({
          id: this.currentevent.id
        })
        .then(response => {
          console.log(response.data);
          this.currentevent.isTracked = false;
          this.trackedButton = "Track event"
        })
        .catch(e => {
          console.log(e);
        });
      }
      else {
        eventDataService
        .trackEvent({
          id: this.currentevent.id
        })
        .then(response => {
          console.log(response.data);
          this.currentevent.isTracked = true;
          this.trackedButton ="Untrack event"
        })
        .catch(e => {
          console.log(e);
        });
      }
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