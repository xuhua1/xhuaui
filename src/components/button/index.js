import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import TouchFeedback from 'rmc-feedback'
import './index.less'

const Button = (props) => {

  const {
    prefixCls,
    children,
    className,
    activeClassName,
    activeStyle,
    inline,
    disabled,
    type,
    size,
    onClick,
    ...restProps
  } = props

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-primary`]: type === 'primary',
    [`${prefixCls}-ghost`]: type === 'ghost',
    [`${prefixCls}-warning`]: type === 'warning',
    [`${prefixCls}-small`]: size === 'small',
    [`${prefixCls}-inline`]: inline,
    [`${prefixCls}-disabled`]: disabled
  })
  return (
    <TouchFeedback
      // tslint:disable-next-line:jsx-no-multiline-js
      activeClassName={
        activeClassName || (activeStyle ? `${prefixCls}-active` : undefined)}
      disabled={disabled}
      activeStyle={activeStyle}
    >
      <a
        role="button"
        className={wrapCls}
        {...restProps}
        onClick={disabled ? undefined : onClick}
        aria-disabled={disabled}
      >
        {children}
      </a>
    </TouchFeedback>
  )
}

Button.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  activeClassName: PropTypes.string,
  activeStyle: PropTypes.object,
  inline: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.oneOf(['primary', 'ghost', 'warning']),
  size: PropTypes.oneOf(['small', 'large', 'normal']),
  onClick: PropTypes.func,
}

Button.defaultProps = {
  prefixCls: 'xh-button',
  inline: false,
  disabled: false,
  size: 'normal',
  activeStyle: {},
  onClick: () => { },
}

export default Button