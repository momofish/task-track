import { get, save, remove } from './apiService';

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

  deleteProject(id) {
    return remove(resourceUrl, id);
  },

  formatProjectName(project) {
    if (!project)
      return null;
    let projectName = `[${project.id || '个人'}]${project.name}`;
    return projectName;
  }
}