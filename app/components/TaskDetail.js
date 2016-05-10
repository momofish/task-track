import React from 'react';
import Modal from './Modal';
import TaskDetailStore from '../stores/TaskDetailStore';
import TaskDetailActions from '../actions/TaskDetailActions';

class TaskDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.task;
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    TaskDetailStore.listen(this.onChange);
    // load data
    TaskDetailActions.getTaskDetail(this.props.task._id);
  }

  componentWillUnmount() {
    TaskDetailStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleHidden() {
    var onHidden = this.props.onHidden;
    onHidden && onHidden();
  }

  render() {
    return (
      <Modal onHidden={this.props.onHidden.bind(this) }>
        <div className="modal-header">
          <button type='button' className='close' data-dismiss='modal'><span aria-hidden='true'>×</span><span className='sr-only'>Close</span></button>
          <span>{this.state.title}</span>
        </div>
        <div className="modal-body">
          {this.state.title}
        </div>
      </Modal>
    );
  }
}

export default TaskDetail;