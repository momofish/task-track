import {get, save} from './commonService';

const resourceUrl = '/api/teams';

export default {
  getTeam(id) {
    return get(resourceUrl, id);
  },

  getMyTeams() {
    return get(resourceUrl, 'my');
  },

  getMyPartTeams() {
    return get(resourceUrl, 'part');
  },

  saveTeam(team) {
    return save(resourceUrl, team);
  }
}