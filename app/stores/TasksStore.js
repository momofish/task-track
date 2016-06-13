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

  getProjectsSuccess({teams, projects, opener}) {
    let team2Section = team => ({
      header: {
        label: team.name, icon: 'th-large', actionIcon: team._id && 'cog',
        onAction: event => {
          opener && opener('team', team);
        },
        key: team._id, data: team
      },
      body: []
    });
    let project2Item = project => ({
      label: project.name, icon: 'file',
      to: `/tasks/projects/${project._id}`,
      key: project._id, data: project
    });
    let sections = teams.map(team2Section);
    projects.map(project2Item).forEach(item => {
      let teamId = item.data.team && item.data.team._id;
      let section = _.find(sections, section => section.header.key == teamId);
      if (!section) {
        section = team2Section({ name: '未指派团队' });
        sections.push(section);
      }
      section.body.push(item);
    });

    this.buildSidebar(sections);
  }
}

export default alt.createStore(TasksStore);