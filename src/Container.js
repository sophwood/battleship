import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import ItemTypes from './ItemTypes';
import Box from './Box';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import snapToGrid from './snapToGrid';

const styles = {
  width: 500,
  height: 500,
  border: '1px solid black',
  position: 'relative',
  margin: '0 auto'
};

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    let left = Math.round(item.left + delta.x);
    let top = Math.round(item.top + delta.y);
    [left, top] = snapToGrid(left, top);

    component.moveBox(item.id, left, top);
  }
};

@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.BOX, boxTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Container extends Component {
  static propTypes = {
    hideSourceOnDrag: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      boxes: {
        'ship1': { top: 0, left: 0, height: 50 },
        'ship2': { top: 100, left: 50, height: 100 },
        'ship3': { top: 150, left: 150, height: 150 },
        'ship4': { top: 100, left: 400, height: 200 },
        'ship5': { top: 250, left: 300, height: 250 }
      }
    };
  }

  moveBox(id, left, top, height) {
    this.setState(update(this.state, {
      boxes: {
        [id]: {
          $merge: {
            left: left,
            top: top,
            height: height
          }
        }
      }
    }));
  }

  render() {
    const { hideSourceOnDrag, connectDropTarget } = this.props;
    const { boxes} = this.state;

    return connectDropTarget(
      <div style={styles}>
        {Object.keys(boxes).map(key => {
          const { left, top, height } = boxes[key];
          return (
            <Box key={key}
                 id={key}
                 left={left}
                 top={top}
                 hideSourceOnDrag={hideSourceOnDrag}
                 height={height}>
            </Box>
          );
        })}
      </div>
    );
  }
}