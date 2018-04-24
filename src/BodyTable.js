import React from 'react';
import PropTypes from 'prop-types';
import BaseTable from './BaseTable';

type Props = {
  saveRef: Function,
  fixed: string,
  handleBodyScroll: Function,
  registerForce: Function
}

function BodyTable(props: Props, {table}) {
  const {
    saveRef,
    columnManager,
    sizeManager
  } = table;
  const {
    prefixCls,
    fixedHeader,
    showHeader,
    dataSource,
    bodyMaxHeight,
    indentSize
  } = table.props;
  const {
    fixed,
    handleBodyScroll,
    registerForce
  } = props;
  const baseTable = (
    <BaseTable
      hasHead={!fixedHeader}
      hasBody
      fixed={fixed}
      indentSize={indentSize}
      registerForce={registerForce}
      columns={columnManager.headColumns(fixed)}
    />
  );
  let height = 0;
  if (dataSource && dataSource.length > 0) {
    height = showHeader && fixedHeader
      ? sizeManager._wrapperHeight - sizeManager.footerHeight - sizeManager._headerHeight
      : sizeManager._wrapperHeight - sizeManager.footerHeight;
  }

  const scrollSize = sizeManager._scrollSizeY;
  const style = {
    height,
    overflowY: sizeManager._hasScrollY() ? 'scroll' : 'auto'
  };
  if (bodyMaxHeight) {
    style.maxHeight = bodyMaxHeight;
  }
  if (scrollSize > 0 && fixed && sizeManager._hasScrollX) {
    style.marginBottom = `-${scrollSize}px`;
    style.paddingBottom = '0px';
  }
  let scrollRef = 'bodyTable';
  if (fixed === 'left') {
    scrollRef = 'fixedColumnsBodyLeft';
  } else if (fixed === 'right') {
    scrollRef = 'fixedColumnsBodyRight';
  }

  if (fixed) {
    delete style.overflowX;
    delete style.overflowY;
    (fixed === 'left') && (style.width = columnManager.getWidth(fixed));
    return (
      <div key='bodyTable' className={`${prefixCls}-body-outer`} style={{...style}}>
        <div
          className={`${prefixCls}-body-inner`}
          ref={saveRef(scrollRef)}
          style={{
            height: '100%',
            overflowY: sizeManager._hasScrollY() ? 'scroll' : 'hidden',
            overflowX: sizeManager._hasScrollX ? 'scroll' : 'hidden'
          }}
          onScroll={handleBodyScroll}
        >
          {baseTable}
        </div>
      </div>
    );
  }
  return (
    <div
      key='bodyTable'
      className={`${prefixCls}-body`}
      ref={saveRef(scrollRef)}
      style={style}
      onScroll={handleBodyScroll}
    >
      {baseTable}
    </div>
  );
}

export default BodyTable;
BodyTable.contextTypes = {
  table: PropTypes.any
};
