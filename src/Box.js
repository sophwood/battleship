import React, { Component, PropTypes } from 'react';
import ItemTypes from './ItemTypes';
import { DragSource } from 'react-dnd';

const boxSource = {
  beginDrag(props) {
    const { id, left, top } = props;
    return { id, left, top };
  }
};

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Box extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    hideSourceOnDrag: PropTypes.bool.isRequired,
    children: PropTypes.node
  };

  constructor(props) {
    super(props);
    this.state = {
        width: '50px',
        height: this.props.height
    }
    this.rotate = this.rotate.bind(this);
  }

  rotate(e) {
    e.preventDefault();
    this.setState({
        width: this.state.height,
        height: this.state.width
    })
  }

  render() {
    const { hideSourceOnDrag, left, top, connectDragSource, isDragging, children } = this.props;
    if (isDragging && hideSourceOnDrag) {
      return null;
    }

    const style = {
      position: 'absolute',
      border: '1px dashed gray',
      backgroundColor: 'white',
      cursor: 'move',
      width: this.state.width,
      height: this.state.height
    };

    return connectDragSource(
      <div style={{ ...style, left, top }} onClick = {this.rotate}>
        {children}
      </div>
    );
  }
}