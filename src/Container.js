import React, { Component, PropTypes } from 'react';
import update from 'react/lib/update';
import ItemTypes from './ItemTypes';
import Battleship from './Battleship';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import snapToGrid from './snapToGrid';
import io from 'socket.io-client';

const connectServer = false;
let socket;
if (connectServer) {
    socket = io('http://localhost:5000');
}

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

const width = 48;

const ships = {
  'ship1': { top: 0, left: 0, height: 48, width },
  'ship2': { top: 100, left: 50, height: 98, width },
  'ship3': { top: 150, left: 150, height: 148, width },
  'ship4': { top: 100, left: 400, height: 198, width },
  'ship5': { top: 250, left: 300, height: 248, width }
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

    if (connectServer) {
        socket.on('click', data => {
            console.log(data);
        });
    }
    this.rotate = this.rotate.bind(this);
    this.checkConflicts = this.rotate.bind(this);
  }

  // grid background squares
  renderSquare(i) {
    return (
      <div key={i} style={{
          border: '1px dashed grey',
          backgroundColor: 'white',
          height: '48px',
          width: '48px',
          zIndex: 0
        }}>
      </div>
    )
  }

  checkConflicts(id, left, top) {
      let conflict = false;
      Object.keys(this.state.ships).map(key => {
          const ship = this.state.ships[key];
          const height = this.state.ships[id].height;
          // left = intended left
          // top = intended top
          // ship.left = left of other ships
          // ship.top = top of other ships
          // ship.height = height of other ships
          if (left === ship.left && ((ship.top <= top && top <= (ship.top + ship.height)) || (ship.top <= (top + height) && (top + height) <= (ship.top + ship.height)))) {
              conflict = true;
          }
      })
      return conflict;
  }

  rotate(id) {
//    const left = this.state.ships[id].left;
//    const top = this.state.ships[id].top;
//    if (this.checkConflicts(id, this.state.ships[id].left, this.state.ships[id].top)) {
//        return;
//    }
    this.setState(update(this.state, {
        ships: {
         [id]: {
           $merge: {
             height: this.state.ships[id].width,
             width: this.state.ships[id].height
           }
         }
        }
    }));
  }

  moveBox(id, left, top) {
    console.log(id + " " + left + " " + top)
    if (this.checkConflicts(id, left, top)) {
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
    if (connectServer) {
        socket.emit('click', {left, top});
    }
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
            const { left, top, height, width } = ships[key];
            return (
              <Battleship key={key}
                          id={key}
                          left={left}
                          top={top}
                          height={height}
                          width={width}
                          rotate={this.rotate}>
              </Battleship>
            );
          })}
        </div>
      </div>
    );
  }
}