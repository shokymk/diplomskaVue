<template>
  <div class="submit-form">
    <div v-if="!submitted">
      <div class="form-group">
        <label for="title">Title</label>
        <input
          type="text"
          class="form-control"
          id="title"
          required
          v-model="event.title"
          name="title"
        />
      </div>

      <div class="form-group">
        <label for="description">datetime</label>
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

export default {
  name: "add-event",
  data() {
    return {
      event: {
        id: null,
        title: "",
        description: "",
        date: "",
        published: false
      },
      submitted: false
    };
  },
  methods: {
    saveevent() {
      var data = {
        title: this.event.title,
        description: this.event.description,
        date: this.event.date
      };

      this.$validator.validateAll().then(valid => {
        if(valid) {
        eventDataService.create(data)
        .then(response => {
          this.event.id = response.data.id;
          console.log(response.data);
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
    }
  },
  components: {
    datetime: Datetime
  }
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>