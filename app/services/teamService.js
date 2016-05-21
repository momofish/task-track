const resourceUrl = '/api/teams';

export default {
  getMyTeams() {
    return new Promise((resolve, reject) =>
      $.ajax({ url: resourceUrl + '/my', success: resolve, error: reject })
    );
  },
  
  getMyPartTeams() {
    return new Promise((resolve, reject) =>
      $.ajax({ url: resourceUrl + '/mypart', success: resolve, error: reject })
    );
  }
}