import { Selector, DatePicker } from '../components/common';
import { projectService, teamService, userService } from '../services';
import moment from 'moment';
import { extend } from 'lodash';

export default {
  selectProject(target, selected, onSelect, options) {
    Selector.open(extend({
      target,
      dataSources: [
        {
          name: '项目',
          data: () => projectService.getMyPartProjects()
            .then(projects => projects.map(project => extend({ display: projectService.formatProjectName(project) }, project))),
          nameField: 'display',
          searchable: true
        }
      ],
      selected,
      onSelect
    }, options));
  },

  selectMember(target, selected, onSelect, options) {
    Selector.open(extend({
      target,
      dataSources: [
        {
          name: '项目',
          data: () => projectService.getProject(options._id)
            .then(project => project.members),
          searchable: true
        },
        {
          name: '团队',
          data: () => projectService.getProject(options._id)
            .then(project => (project.team || {}).members || []),
          searchable: true
        }
      ],
      selected,
      onSelect
    }, options));
  },

  select4ProjectMember(target, selected, onSelect, options) {
    Selector.open(extend({
      target,
      dataSources: [
        options.team && {
          name: '团队',
          data: () => teamService.getTeam((options.team || {})._id)
            .then(team => (team || {}).members || []),
          searchable: true
        },
        {
          name: '所有',
          data: userService.getUser,
          searchable: true
        }
      ].filter(dataSource => dataSource),
      selected,
      onSelect
    }, options));
  },

  selectUser(target, selected, onSelect, options) {
    Selector.open(extend({
      target,
      dataSources: [
        {
          name: '人员',
          data: userService.getUser,
          searchable: true
        }
      ],
      selected,
      onSelect
    }, options));
  },

  selectTeam(target, selected, onSelect, options) {
    Selector.open(extend({
      target,
      dataSources: [
        {
          name: '团队',
          data: teamService.getMyPartTeams,
          searchable: true
        }
      ],
      selected,
      onSelect
    }, options));
  },

  selectMenu(target, selected, onSelect, options) {
    Selector.open(extend({
      target,
      dataSources: [
        {
          data: options.data,
          searchable: options.searchable
        }
      ],
      selected,
      onSelect,
      top: 20
    }, options));
  },

  selectData(target, selected, onSelect, options) {
    Selector.open(extend({
      target,
      selected,
      onSelect
    }, options));
  },

  selectDate(target, selected, onSelect, options) {
    DatePicker.open(extend({
      target,
      selected: moment(selected),
      onSelect
    }, options));
  }
}