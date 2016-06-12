import {get} from './commonService';

const resourceUrl = '/api/projects';

export default {
  getProject(id) {
    return get(resourceUrl, id);
  },

  getMyProjects() {
    return get(resourceUrl, 'my');
  },

  getMyPartProjects() {
    return get(resourceUrl, 'part');
  }
}