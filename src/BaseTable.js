import React from 'react';
import PropTypes from 'prop-types';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import {connect} from './mini-store';

class BaseTable extends React.PureComponent {
  handleRowHover = (isHover, key) => {
    setTimeout(() => {
      this.props.store.setState({
        currentHoverKey: isHover ? key : null
      });
    });
  };
  renderRows = () => {
    const rows = [];
    const {
      getRowKey,
      fixed,
      showData,
      tops,
      colWidth
    } = this.props;
    const table = this.context.table;
    const {
      prefixCls,
      rowRef,
      getRowHeight,
      rowHeight,
      rowClassName
    } = table.props;
    const columnManager = table.columnManager;
    (showData || []).forEach((record, i) => {
      let leafColumns;
      if (fixed === 'left') {
        leafColumns = columnManager.leftLeafColumns();
      } else if (fixed === 'right') {
        leafColumns = columnManager.rightLeafColumns();
      } else {
        leafColumns = columnManager.leafColumns();
      }
      const className = typeof rowClassName === 'function'
        ? rowClassName(record, record.index)
        : rowClassName;
      const key = getRowKey(record, record.index);
      const props = {
        key,
        record,
        fixed,
        prefixCls,
        className,
        colWidth,
        rowKey: key,
        index: record.index,
        top: tops[record.index],
        columns: leafColumns,
        ref: rowRef(record, record.index),
        components: table.components,
        height: getRowHeight(record, record.index) * rowHeight,
        onHover: this.handleRowHover
      };
      rows.push(<TableRow {...props} />);
    });
    return rows;
  };

  renderFooter = () => {
    const {footer, footerHeight} = this.context.table.props;
    return footer ? (
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: footerHeight, color: 'inherit'}}>
        {footer(this.props.dataSource)}
      </div>
    ) : null;
  };

  renderEmptyText = () => {
    const {emptyText, dataSource, rowHeight} = this.context.table.props;
    if (dataSource && dataSource.length > 0) {
      return null;
    }
    return typeof emptyText === 'function' ? (
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: rowHeight,
        lineHeight: rowHeight + 'px',
        textAlign: 'center',
        color: 'inherit'
      }}>
        {emptyText(this.props.dataSource)}
      </div>
    ) : emptyText;
  };

  render() {
    const {hasHead, hasBody, columns, fixed, bodyHeight, colWidth} = this.props;
    const table = this.context.table;
    const components = table.components;
    const {footer, footerHeight} = table.props;
    let body;
    const Table = components.table;
    const BodyWrapper = components.body.wrapper;
    if (hasBody) {
      const rows = this.renderRows();
      body = (
        <BodyWrapper className='tbody' style={{height: bodyHeight + (footer ? footerHeight : 0)}}>
          {rows}
          {this.renderEmptyText()}
          {this.renderFooter()}
        </BodyWrapper>
      )
    }
    return (
      <Table className='table'>
        {hasHead && <TableHeader columns={columns} fixed={fixed} colWidth={colWidth} />}
        {body}
      </Table>
    )
  }
}

export default connect((state) => {
  const {
    hasScroll,
    fixedColumnsBodyRowsHeight,
    renderStart,
    renderEnd,
    bodyHeight,
    colWidth,
    tops,
    showData
  } = state;
  return {
    hasScroll,
    bodyHeight,
    fixedColumnsBodyRowsHeight,
    renderStart,
    renderEnd,
    colWidth,
    tops,
    showData: showData || []
  }
})(BaseTable);

BaseTable.contextTypes = {
  table: PropTypes.any
};
