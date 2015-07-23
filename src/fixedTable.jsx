import React from 'react';

import compact from 'lodash/array/compact';
import map from 'lodash/collection/map';
import sortBy from 'lodash/collection/sortBy';

// Loosely based on but much simpler than
// https://facebook.github.io/fixed-data-table/

let Cell = React.createClass({
  render () {
    let { row, name } = this.props;
    let cssClass = compact(['cell', name]).join(' ');
    let value = row[name];
    return (
      <span
        className={ cssClass }>
        { name === 'is_enabled' ? ( value ? '\u2714' : '\u2718') : value }
      </span>
    );
  }
})

let ColumnHeader = React.createClass({
  handleClick () {
    this.props.onColumnToggle(this.props.name);
  },
  render () {
    let { name, active, direction } = this.props;
    let cssClass = compact(['cell', name, active ? 'active' : null]).join(' ');
    return (
      <span
        onClick={ this.handleClick }
        className={ cssClass }>
        { name === 'is_enabled' ? 'E' : name }
        { active ? <span className="direction">{ direction.split('').join(' ') }</span> : null }
      </span>
    );
  }
})

let COLUMN_NAMES = ['name', 'email', 'is_enabled', 'company', 'office', 'uid'];
export let Table = React.createClass({
  render () {
    return (
      <div className="flip-the-table">
        <div className="row header">
          { map(COLUMN_NAMES, (name) => (
              <ColumnHeader
                onColumnToggle={ this.props.onColumnToggle }
                active={ this.props.column === name }
                direction={ this.props.direction }
                key={ name }
                name={ name } />
            )
          )}
        </div>
        { map(this.props.rows, (row) => (
            <div className="row" key={ row.uid }>
              { map(COLUMN_NAMES, (name) => (
                  <Cell
                    row={ row }
                    key={ name }
                    name={ name } />
                )
              )}
            </div>
          )
        )}
      </div>
    );
  }
});
