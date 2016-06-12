import alt from '../alt';
import TasksActions from '../actions/TasksActions';
import _ from 'underscore';

class TasksStore {
  constructor() {
    this.bindActions(TasksActions);
    this.buildSidebar();
  }

  buildSidebar(...sectionsArray) {
    let sectionsAll = [];
    sectionsArray.map(sections => sectionsAll.push(...sections));

    this.sidebar = {
      title: "任务",
      searchbar: { onSearch: () => { } },
      sections: [
        {
          header: { label: '工作台' },
          body: [
            { label: '我的任务', icon: 'tasks', to: '/tasks/my' },
            { label: '我参与的任务', icon: 'briefcase', to: '/tasks/part' },
            { label: '任务日历', icon: 'calendar', to: '/tasks/calendar' },
          ]
        }, ...sectionsAll
      ]
    };
  }

  getMyPartProjectsSuccess(projects) {
    let sections = _.chain(projects)
      .groupBy(project => (project.team || { name: '未指派团队' }).name)
      .mapObject((teamProjects, team) => ({
        header: { label: team, icon: 'th-large' },
        body: teamProjects.map(project => ({
          label: project.name,
          icon: 'file', to: `/tasks/projects/${project._id}`
        }))
      })).toArray().value();

    this.buildSidebar(sections);
  }
}

export default alt.createStore(TasksStore);