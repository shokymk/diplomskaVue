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
    return axios.get(API_URL + `events/search/byTags/${tag}`);
  }

  getByCategory(category){
    return axios.get(API_URL + `events/search/byCategory?category=${category}`);
  }
  
  findByTitle(title) {
    return axios.get(API_URL + `events/search/byTitle?title=${title}`);
  }
  
  trackEvent(eventId) {
    console.log(eventId);
    return axios.post(API_URL +"events/trackEvent", eventId, {headers: authHeader()});
  }
  untrackEvent(eventId) {
    return axios.post(API_URL +"events/untrackEvent", eventId, {headers: authHeader()});
  }
  isEventTracked(eventId) {
    return axios.get(API_URL +`events/isTracked/?eventId=${eventId}`, {headers: authHeader()} );
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

}

export default new EventDataService();