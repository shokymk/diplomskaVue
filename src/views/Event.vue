<template>
  <!-- <div v-if="currentEvent" class="edit-form"> -->
    <div class="edit-form">
    <div v-if="!submitted">
    <h4>Event</h4>
    <form>
      <div class="form-group">
        <label for="name">Event name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          required
          v-model="currentEvent.name"
          name="name"
        />
      </div>
      <div class="form-group">
        <label for="name">Event picture</label>
        <input
          type="text"
          class="form-control"
          id="picture"
          required
          v-model="currentEvent.imgUrl"
          name="name"
        />
      </div>

      <div class="form-group">
        <label for="timeofevent">Time and date of event</label>
        <datetime type="datetime"
         input-class="form-control"
         v-model="currentEvent.dateScheduled"
         ></datetime>
         <input type="hidden" name="date" v-validate="'required'" v-model="currentEvent.dateScheduled">
      </div>

      <div class="form-group">
        <label for="name">Event location</label>
        <br>
        <gmap-autocomplete class="form-control" v-on:place_changed="getAddressData" :placeholder='location.name'>
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

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          class="form-control"
          rows="5"
          id="description"
          required
          v-model="currentEvent.description"
          name="description"
        />
      </div>
      <div class="form-group">
        <label for="category">Category</label>
        <v-select
          rows="5"
          required
          v-model="currentEvent.category"
          name="category"
          :options="['Music', 'Culture', 'Education',
          'Causes', 'Sports' ]"
          :searchable="false"
        ></v-select>
      </div>
     <div class="form-group">
        <label for="tags">Tags</label>
        <vue-tags-input
            v-model="tag"
            :tags="tags"
            @tags-changed="newTags => tags = newTags"
         />
      </div>

    </form>

    <button class="badge badge-danger mr-2"
      @click="deleteEvent"
    >
      Delete
    </button>

    <button type="submit" class="badge badge-success"
      @click="updateEvent"
    >
      Update
    </button>
    <p>{{ message }}</p>
    </div>

    <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="backToProfile">Back to profile</button>
    </div>
    </div>
</template>

<script>
import eventDataService from "../services/eventDataService";
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css'
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: "event",
  data() {
    return {
      message: '',
      currentEvent: {
        name: "",
        description: "",
        dateScheduled: "",
        category: "",
        imgUrl: ""    
      },
      tag: "",
      tags:[],
      location: null,
      submitted: false
    };
  },
  methods: {
    getevent(id) {
      eventDataService.get(id)
        .then(response => {
          this.currentEvent = response.data;
          console.log(response.data);
          this.currentEvent.tags.forEach(element => {
            this.tags.push({
              "text" : element,
              "tiClasses" : ["ti-valid"]
            });
          this.location = this.currentEvent.location;
          });
        })
        .catch(e => {
          console.log(e);
        });
    },
    updateEvent() {
      var stringTags = this.tags.map((value) => {
          return value.text
        })
      
      var data = {
        id: this.currentEvent.id,
        name: this.currentEvent.name,
        description: this.currentEvent.description,
        dateScheduled: this.currentEvent.dateScheduled,
        imgUrl: this.currentEvent.imgUrl,
        category: this.currentEvent.category,
        location: this.location,
        tags: stringTags
      };
      eventDataService.update(data)
        .then(response => {
          console.log(response.data);
          this.submitted = true;
          this.message = 'The event was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
    },
    getAddressData(place) {
      console.log(place);
      this.location = {
        "id" : place.place_id,
        "mapUrl" : place.url,
        "name" : place.name
      };
    },
    deleteEvent() {
      eventDataService.delete(this.currentEvent.id)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "events" });
        })
        .catch(e => {
          console.log(e);
        });
    },
    backToProfile() {
      this.$router.push('/profile')
    }
  },
  mounted() {
    this.getevent(this.$route.params.id);
  },
  components: {
    datetime: Datetime,
    VueTagsInput
  }
};
</script>

<style>
.edit-form {
  max-width: 600px;
  margin: auto;
}
</style>