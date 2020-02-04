import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/';

class EventDataService {
  getAll() {
    return axios.get(API_URL + "events/list", { headers: authHeader() });
  }

  getTrackedEvents() {
    return axios.get(API_URL + 'events/tracked', { headers: authHeader() });
  }

  get(id) {
    return axios.get(`/events/${id}`);
  }

  create(data) {
    return axios.post(API_URL + "events/addEvent", data, {headers: authHeader()});
  }

  getByTag(tag){
    return axios.get(API_URL + `events/byTags/${tag}`);
  }
  update(id, data) {
    return axios.put(`/events/${id}`, data);
  }

  delete(id) {
    return axios.delete(`/events/${id}`);
  }

  deleteAll() {
    return axios.delete(`/events`);
  }

  findByTitle(title) {
    return axios.get(`/events?title=${title}`);
  }
  
}

export default new EventDataService();