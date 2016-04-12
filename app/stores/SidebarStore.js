import alt from '../alt';
import SidebarActions from '../actions/SidebarActions';

class SidebarStore {
  constructor() {
    this.bindActions(SidebarActions);
  }
}

export default alt.createStore(SidebarStore);