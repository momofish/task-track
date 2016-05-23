import Selector from '../components/Selector';
import DatePicker from '../components/DatePicker';
import {projectService, teamService, deptService} from '../services';

export default {
  selectProject(target, selected, onSelect) {
    Selector.open({
      target,
      dataSources: [
        {
          name: '我的项目',
          data: projectService.getMyProjects,
          searchable: true,
          itemNameField: 'projectName'
        },
        {
          name: '我参与的项目',
          data: projectService.getMyPartProjects,
          searchable: true,
          itemNameField: 'projectName'
        }
      ],
      selected,
      onSelect
    });
  },

  selectMember(target, selected, onSelect, param) {
    Selector.open({
      target,
      dataSources: [
        {
          name: '项目',
          data: () => projectService.getProject(param && param._id)
            .then(project => project.members),
          searchable: true
        }
      ],
      selected,
      onSelect
    });
  },
  
  selectMenu(target, selected, onSelect, data) {
    Selector.open({
      target,
      dataSources: [
        {
          data: data,
          searchable: false
        }
      ],
      selected,
      onSelect
    });
  },
  
  selectDate(target, selected, onSelect) {
    DatePicker.open({
      target,
      selected,
      onSelect
    });
  }
}