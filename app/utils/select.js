import Selector from '../components/Selector';
import {projectService, teamService, deptService} from '../services';

export default {
  selectProject(ev, selected, onSelect) {
    Selector.open({
      trigger: ev.currentTarget,
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

  selectMember(ev, selected, onSelect, param) {
    Selector.open({
      trigger: ev.currentTarget,
      dataSources: [
        {
          name: '项目',
          data: () => projectService.getProject(param._id)
            .then(project => project.members)
        }
      ],
      selected,
      onSelect
    });
  }
}