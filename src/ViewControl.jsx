import React from 'react';

export default class ViewControl extends React.Component {
    render() {
      return (
        <div className="viewcontrol">
          <span role="img" aria-label="zoom">&#128269;</span>{Math.floor(this.props.zoom*100)+"%"}
          <button onMouseDown={()=> this.props.viewControl('+')}>+</button>
          <button onMouseDown={()=> this.props.viewControl('-')}>-</button>
          <button onMouseDown={()=> this.props.viewControl('<')}>&larr;</button>
          <button onMouseDown={()=> this.props.viewControl('up')}>&uarr;</button>
          <button onMouseDown={()=> this.props.viewControl('down')}>&darr;</button>
          <button onMouseDown={()=> this.props.viewControl('>')}>&rarr;</button>
  
        </div>
      );
    }
  }
  