import { get, save } from './commonService';

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
  },

  saveProject(project) {
    return save(resourceUrl, project);
  },

  formatProjectName(project) {
    if(!project)
      return null;
    let projectName = `[${project.id || '个人'}]${project.name}`;
    return projectName;
  }
}