import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import Item from './FlexItem'
import './index.less'

const Flex = (props) => {
  const {
    direction,
    wrap,
    justify,
    align,
    alignContent,
    className,
    children,
    prefixCls,
    style,
    ...restProps
  } = props

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-dir-row`]: direction === 'row',
    [`${prefixCls}-dir-row-reverse`]: direction === 'row-reverse',
    [`${prefixCls}-dir-column`]: direction === 'column',
    [`${prefixCls}-dir-column-reverse`]: direction === 'column-reverse',

    [`${prefixCls}-nowrap`]: wrap === 'nowrap',
    [`${prefixCls}-wrap`]: wrap === 'wrap',
    [`${prefixCls}-wrap-reverse`]: wrap === 'wrap-reverse',

    [`${prefixCls}-justify-start`]: justify === 'start',
    [`${prefixCls}-justify-end`]: justify === 'end',
    [`${prefixCls}-justify-center`]: justify === 'center',
    [`${prefixCls}-justify-between`]: justify === 'between',
    [`${prefixCls}-justify-around`]: justify === 'around',

    [`${prefixCls}-align-start`]: align === 'start',
    [`${prefixCls}-align-center`]: align === 'center',
    [`${prefixCls}-align-end`]: align === 'end',
    [`${prefixCls}-align-baseline`]: align === 'baseline',
    [`${prefixCls}-align-stretch`]: align === 'stretch',

    [`${prefixCls}-align-content-start`]: alignContent === 'start',
    [`${prefixCls}-align-content-end`]: alignContent === 'end',
    [`${prefixCls}-align-content-center`]: alignContent === 'center',
    [`${prefixCls}-align-content-between`]: alignContent === 'between',
    [`${prefixCls}-align-content-around`]: alignContent === 'around',
    [`${prefixCls}-align-content-stretch`]: alignContent === 'stretch',
  })
  return (
    <div className={wrapCls} style={style} {...restProps}>
      {children}
    </div>
  )
}

Flex.Item = Item

Flex.propTypes = {
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  style: PropTypes.object,
  direction: PropTypes.oneOf([
    'row', 'row-reverse', 'column', 'column-reverse'
  ]),
  wrap: PropTypes.oneOf([
    'nowrap', 'wrap', 'wrap-reverse'
  ]),
  justify: PropTypes.oneOf([
    'start', 'end', 'center', 'between', 'around'
  ]),
  align: PropTypes.oneOf([
    'start', 'center', 'end', 'baseline', 'stretch',
  ]),
  alignContent: PropTypes.oneOf([
    'start', 'end', 'center', 'between', 'around', 'stretch',
  ]),
}

Flex.defaultProps = {
  prefixCls: 'xh-flexbox',
  align: 'center',
}

export default Flex