<template>
  <div class="submit-form">
    <div v-if="!submitted">
      <div class="form-group">
        <label for="name">Event name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          required
          v-model="event.name"
          name="name"
        />
      </div>
      <div class="form-group">
        <label for="name">Event picture</label>
        <input
          type="text"
          class="form-control"
          id="name"
          required
          v-model="event.imgUrl"
          name="name"
        />
      </div>

      <div class="form-group">
        <label for="timeofevent">Time and date of event</label>
        <datetime type="datetime"
         input-class="form-control"
         v-model="event.date"
         ></datetime>
         <input type="hidden" name="date" v-validate="'required'" v-model="event.date">
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          class="form-control"
          rows="5"
          id="description"
          required
          v-model="event.description"
          name="description"
        />
      </div>
      <div class="form-group">
        <label for="category">Category</label>
        <v-select
          rows="5"
          required
          v-model="event.category"
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

      <button @click="saveevent" class="btn btn-success">Submit</button>
    </div>

    <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="newevent">Add</button>
    </div>
  </div>
</template>

<script>
import eventDataService from "../services/eventDataService";
import { Datetime } from 'vue-datetime';
import 'vue-datetime/dist/vue-datetime.css'
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  name: "add-event",
  data() {
    return {
      event: {
        name: "",
        description: "",
        date: "",
        category: "",
        imgUrl: ""    
      },
      tag: "",
      tags:[],
      submitted: false
    };
  },
  methods: {
    
    saveevent() {
      var stringTags = this.tags.map((value) => {
          return value.text
        })
      
      var data = {
        name: this.event.name,
        description: this.event.description,
        dateScheduled: this.event.date,
        imgUrl: this.event.imgUrl,
        category: this.event.category,
        tags: stringTags
      };
      
      this.$validator.validateAll().then(valid => {
        if(valid) {
        eventDataService.create(data)
        .then(response => {
          this.event.id = response.data.id;
          // console.log(response.data);
          this.submitted = true;
        })
        .catch(e => {
          console.log(e);
        })
        }
        else {
          console.log('Vue validate failed');
        }
      });

    },
    
    newevent() {
      this.submitted = false;
      this.event = {};
      this.tags = [];
      this.tag = "";
    }
  },
  components: {
    datetime: Datetime,
    VueTagsInput
  }
};
</script>

<style>
.submit-form {
  max-width: 600px;
  margin: auto;
}
</style>