const resourceUrl = '/api/projects';

export default {
  getMyProjects () {
    return new Promise((resolve, reject) => 
      $.ajax({url: resourceUrl + '/my',success: resolve,error: reject})
    );
  }
}
