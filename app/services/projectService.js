const resourceUrl = '/api/projects';

export default {
  getMyProjects() {
    return new Promise((resolve, reject) =>
      $.ajax({ url: `${resourceUrl}/my`, success: resolve, error: reject })
    );
  },
  
  getProject(id) {
    return new Promise((resolve, reject) =>
      $.ajax({ url: `${resourceUrl}/${id}`, success: resolve, error: reject })
    );
  },
  
  getMyPartProjects() {
    return new Promise((resolve, reject) =>
      $.ajax({ url: `${resourceUrl}/part`, success: resolve, error: reject })
    );
  }
}