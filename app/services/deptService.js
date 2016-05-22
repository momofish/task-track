const resourceUrl = '/api/teams';

export default {
  getMyDepts() {
    return new Promise((resolve, reject) =>
      $.ajax({ url: `${resourceUrl}/my`, success: resolve, error: reject })
    );
  },
  
  getDept(id) {
    return new Promise((resolve, reject) =>
      $.ajax({ url: `${resourceUrl}/${id}`, success: resolve, error: reject })
    );
  }
}