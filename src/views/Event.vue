<template>
  <div v-if="currentEvent" class="edit-form">
    <h4>Event</h4>
    <form>
      <div class="form-group">
        <label for="title">Title</label>
        <input type="text" class="form-control" id="title"
          v-model="currentEvent.title"
        />
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <input type="text" class="form-control" id="description"
          v-model="currentEvent.description"
        />
      </div>

      <div class="form-group">
        <label><strong>Status:</strong></label>
        {{ currentEvent.published ? "Published" : "Pending" }}
      </div>
    </form>

    <button class="badge badge-primary mr-2"
      v-if="currentEvent.published"
      @click="updatePublished(false)"
    >
      UnPublish
    </button>
    <button v-else class="badge badge-primary mr-2"
      @click="updatePublished(true)"
    >
      Publish
    </button>

    <button class="badge badge-danger mr-2"
      @click="deleteevent"
    >
      Delete
    </button>

    <button type="submit" class="badge badge-success"
      @click="updateevent"
    >
      Update
    </button>
    <p>{{ message }}</p>
  </div>

  <div v-else>
    <br />
    <p>Please click on a event...</p>
  </div>
</template>

<script>
import eventDataService from "../services/eventDataService";

export default {
  name: "event",
  data() {
    return {
      currentEvent: null,
      message: ''
    };
  },
  methods: {
    getevent(id) {
      eventDataService.get(id)
        .then(response => {
          this.currentEvent = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updatePublished(status) {
      var data = {
        id: this.currentEvent.id,
        title: this.currentEvent.title,
        description: this.currentEvent.description,
        published: status
      };

      eventDataService.update(this.currentEvent.id, data)
        .then(response => {
          this.currentEvent.published = response.data.published;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },

    updateEvent() {
      eventDataService.update(this.currentEvent.id, this.currentEvent)
        .then(response => {
          console.log(response.data);
          this.message = 'The event was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
    },

    deleteevent() {
      eventDataService.delete(this.currentEvent.id)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "events" });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.message = '';
    this.getevent(this.$route.params.id);
  }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}
</style>