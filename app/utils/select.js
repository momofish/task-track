import Selector from '../components/Selector';
import DatePicker from '../components/DatePicker';
import {projectService, teamService, deptService} from '../services';
import {extend} from 'underscore';

export default {
  selectProject(target, selected, onSelect, options) {
    Selector.open(extend({
      target,
      dataSources: [
        {
          name: '项目',
          data: projectService.getMyPartProjects,
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

  selectMenu(target, selected, onSelect, options) {
    Selector.open(extend({
      target,
      dataSources: [
        {
          data: options.data,
          searchable: false
        }
      ],
      selected,
      onSelect
    }, options));
  },

  selectDate(target, selected, onSelect, options) {
    DatePicker.open(extend({
      target,
      selected,
      onSelect
    }, options));
  }
}