import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import ItemTypes from './ItemTypes';
import Battleship from './Battleship';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import snapToGrid from './snapToGrid';

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

const ships = {
  'ship1': { top: 0, left: 0, height: 48 },
  'ship2': { top: 100, left: 50, height: 98 },
  'ship3': { top: 150, left: 150, height: 148 },
  'ship4': { top: 100, left: 400, height: 198 },
  'ship5': { top: 250, left: 300, height: 248 }
};

@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.Battleship, boxTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
export default class Container extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { ships };
  }

  renderSquare(i) {
    return (
      <div key={i} style={{
          border: '1px dashed grey',
          backgroundColor: 'white',
          width: '48px',
          height: '48px',
          zIndex: 0
        }}>
      </div>
    )
  }

  moveBox(id, left, top) {
    console.log(id + " " + left + " " + top)
    let conflict = false;
    Object.keys(this.state.ships).map(key => {
        console.log(this.state.ships[key])
        const ship = this.state.ships[key]
        const height = this.state.ships[id].height
        // left = intended left
        // top = intended top
        // ship.left = left of other ships
        // ship.top = top of other ships
        // ship.height = height of other ships
        if (left === ship.left && ((ship.top <= top && top <= (ship.top + ship.height)) || (ship.top <= (top + height) && (top + height) <= (ship.top + ship.height)))) {
            conflict = true;
        }
    })
    if (conflict) {
        return;
    }
    this.setState(update(this.state, {
      ships: {
        [id]: {
          $merge: {
            left: left,
            top: top
          }
        }
      }
    }));
  }

  render() {
    const { connectDropTarget } = this.props;
    const { ships} = this.state;

    const styles = {
      width: 500,
      height: 500,
      border: '1px solid black',
      position: 'relative',
      margin: '0 auto'
    };

    var squares = [];

    for (let i = 0; i < 100; i++) {
      squares.push(this.renderSquare(i));
    }

    return connectDropTarget(
      <div style={styles}>
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexWrap: 'wrap'
          }}>
          {squares}
          {Object.keys(ships).map(key => {
            const { left, top, height } = ships[key];
            return (
              <Battleship key={key}
                          id={key}
                          left={left}
                          top={top}
                          height={height}>
              </Battleship>
            );
          })}
        </div>
      </div>
    );
  }
}