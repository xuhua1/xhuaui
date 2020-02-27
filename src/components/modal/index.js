import classnames from 'classnames'
import React, { useCallback, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TouchFeedback from 'rmc-feedback';
import './index.less'

const Modal = (props) => {
  const {
    prefixCls,
    className,
    style,
    transparent,
    popup,
    animationType,
    wrapClassName,
    footer,
    header,
    operation,
    platform,
  } = props

  const renderFooterButton = useCallback((button, prefixCls, i) => {
    let buttonStyle = {}
    if (button.style) {
      buttonStyle = button.style
    }
    const onClickFn = (e) => {
      e.preventDefault();
      if (button.onPress) {
        button.onPress();
      }
    }
    return (
      <TouchFeedback activeClassName={`${prefixCls}-button-active`} key={i}>
        <a
          className={`${prefixCls}-button`}
          role="button"
          style={buttonStyle}
          onClick={onClickFn}
        >
          {button.text || `Button`}
        </a>
      </TouchFeedback>
    )
  }, [])

  const btnGroupClass = footer.length ? classnames(
    `${prefixCls}-button-group-${
    footer.length === 2 && !operation ? 'h' : 'v'
    }`,
    `${prefixCls}-button-group-${operation ? 'operation' : 'normal'}`,
  ) : ''
  const footerDom = footer.length ? (
    <div className={btnGroupClass} role="group">
      {footer.map((button, i) =>
        // tslint:disable-next-line:jsx-no-multiline-js
        renderFooterButton(button, prefixCls, i),
      )}
    </div>
  ) : null;
  const wrapCls = classnames(wrapClassName, `${prefixCls}-wrap`, {
    [`${prefixCls}-wrap-popup`]: popup,
  });
  const cls = classnames(prefixCls, className, {
    [`${prefixCls}-transparent`]: transparent,
    [`${prefixCls}-popup`]: popup,
    [`${prefixCls}-popup-${animationType}`]: popup && animationType,
    [`${prefixCls}-android`]: platform === 'android',
  });
  return (
    <div>
      <div className={`${prefixCls}-mask`}></div>
      <div className={wrapCls}>
        <div className={cls} style={style}>
          <div className={`${prefixCls}-content`}>
            {header && <div className={`${prefixCls}-header`}>
              {header}
            </div>}
            <div
              className={`${prefixCls}-body`}
            >
              {props.children}
            </div>
            {footerDom}
          </div>
        </div>
      </div>
    </div>
  )
}

Modal.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  transparent: PropTypes.bool,
  popup: PropTypes.bool,
  animationType: PropTypes.oneOf([
    'slide-up', 'slide-down',
  ]),
  wrapClassName: PropTypes.string,
  footer: PropTypes.array,
  header: PropTypes.node,
  operation: PropTypes.bool,
  platform: PropTypes.oneOf([
    'android', 'ios',
  ]),
}

Modal.defaultProps = {
  prefixCls: 'xh-modal',
  style: {},
  transparent: true,
  popup: false,
  animationType: '',
  footer: [],
  operation: false,
  platform: 'ios',
}

export default Modal