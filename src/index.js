import React, { Component } from 'react';
import Container from './Container';

export default class DragAroundNaive extends Component {
  constructor(props) {
    super(props);
    this.handleHideSourceClick = this.handleHideSourceClick.bind(this);
    this.state = {
      hideSourceOnDrag: true
    };
  }

  handleHideSourceClick() {
    this.setState({
      hideSourceOnDrag: !this.state.hideSourceOnDrag
    });
  }

  render() {
    const { hideSourceOnDrag } = this.state;

    return (
      <div>
        <Container hideSourceOnDrag={hideSourceOnDrag} />
        <p>
          <label>
            <input type='checkbox'
                   checked={hideSourceOnDrag}
                   onChange={this.handleHideSourceClick} />
            <small>Hide the source item while dragging</small>
          </label>
        </p>
      </div>
    );
  }
}