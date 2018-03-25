import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

class TableCell extends React.PureComponent {
  isInvalidRenderCellText = (text) => {
    return text
      && !React.isValidElement(text)
      && Object.prototype.toString.call(text) === '[object Object]';
  };

  getStyle = () => {
    const {
      column,
      isLast,
      record,
      index
    } = this.props;
    const {bodyStyle, align, width} = column;
    let style = {};
    if (typeof bodyStyle === 'function') {
      style = bodyStyle(record, index) || {};
    } else {
      style = Object.assign({}, bodyStyle);
    }
    align && (style.textAlign = column.align);
    let w = this.props.width || width;
    if (w) {
      style.flex = `${isLast ? 1 : 0} 1 ${isNumber(w) ? w + 'px' : w}`;
      style.minWidth = w;
      style.maxWidth = w;
    } else {
      style.flex = 1;
    }
    return style;
  };

  getClassName = () => {
    const {record, index, column} = this.props;
    const {className} = column;
    let cls = '';
    if (typeof className === 'function') {
      cls = className(column, record, index);
    } else if (className === 'string') {
      cls = className;
    }
    return classNames('td', cls);
  };

  render() {
    const {
      record,
      index,
      column,
      component: BodyCell
    } = this.props;
    const {dataIndex, render} = column;
    let text;
    if (typeof dataIndex === 'number') {
      text = get(record, dataIndex);
    } else if (!dataIndex || dataIndex.length === 0) {
      text = record;
    } else {
      text = get(record, dataIndex);
    }
    let tdProps = {}, colSpan, rowSpan;
    if (render) {
      text = render(text, record, index);
      if (this.isInvalidRenderCellText(text)) {
        tdProps = text.props || tdProps;
        colSpan = tdProps.colSpan;
        rowSpan = tdProps.rowSpan;
        text = text.children;
      }
    }
    if (this.isInvalidRenderCellText(text)) {
      text = null;
    }
    if (rowSpan === 0 || colSpan === 0) {
      return null;
    }
    tdProps.style = this.getStyle();
    return (
      <BodyCell
        className={this.getClassName()}
        {...tdProps}
      >
        {text}
      </BodyCell>
    )
  }
}

export default TableCell;

TableCell.propTypes = {
  record: PropTypes.object,
  prefixCls: PropTypes.string,
  index: PropTypes.number,
  indent: PropTypes.number,
  indentSize: PropTypes.number,
  column: PropTypes.object,
  component: PropTypes.any,
  isLast: PropTypes.bool
};

TableCell.defaultProps = {
  isLast: false
};
