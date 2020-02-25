import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import './index.less'

const FlexItem = (props) => {
  const {
    children,
    className,
    prefixCls,
    style,
    ...restProps
  } = props
  const wrapCls = classnames(`${prefixCls}-item`, className);
  return (
    <div className={wrapCls} style={style} {...restProps}>
      {children}
    </div>
  )
}
FlexItem.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
}
FlexItem.defaultProps = {
  prefixCls: 'xh-flexbox',
  style: {},
}

export default FlexItem