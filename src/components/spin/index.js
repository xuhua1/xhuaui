import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import './index.less'

const Spin = (props) => {
  const {
    prefixCls,
    className,
    style,
    icon,
  } = props
  return (
    <div className={classnames(prefixCls, className)} style={style}>
      <span className={`${prefixCls}-icon`}>{icon}</span>
    </div>
  )
}

Spin.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
}

Spin.defaultProps = {
  prefixCls: 'xh-spin',
  style: {}
}

export default Spin