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
          itemNameField: 'projectName'
        },
        {
          name: '我参与的项目',
          data: projectService.getMyPartProjects,
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
            .then(project => project.members)
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