import classnames from 'classnames'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TouchFeedback from 'rmc-feedback'

const ListItem = (props) => {
  const {
    prefixCls,
    className,
    activeStyle,
    error,
    align,
    wrap,
    disabled,
    children,
    multipleLine,
    thumb,
    extra,
    arrow,
    platform,
    ...restProps
  } = props
  //state
  const [coverRippleStyle, setCoverRippleStyle] = useState({ display: 'none'})
  const [RippleClicked, setRippleClicked] = useState(false)

  // 定时器
  let debounceTimeout = null
  // 卸载后清除定时器
  useEffect(()=>{
    return ()=>{
      if(debounceTimeout){
        clearTimeout(debounceTimeout);
        debounceTimeout = null;
      }
    }
  }, [])

  const onClick = (e) => {
    const isAndroid = platform === 'android'
    if(!!props.onClick && isAndroid){
      if(debounceTimeout){
        clearTimeout(debounceTimeout)
        debounceTimeout = null
      }
      const Item = e.currentTarget
      const RippleWidth = Math.max(Item.offsetHeight, Item.offsetWidth)
      const ClientRect = e.currentTarget.getBoundingClientRect()
      const pointX = e.clientX - ClientRect.left - Item.offsetWidth / 2
      const pointY = e.clientY - ClientRect.top - Item.offsetWidth / 2
      const coverRippleStyle = {
        width: `${RippleWidth}px`,
        height: `${RippleWidth}px`,
        left: `${pointX}px`,
        top: `${pointY}px`,
      }
      setCoverRippleStyle(coverRippleStyle)
      setRippleClicked(true)
      debounceTimeout = setTimeout(() => {
        setCoverRippleStyle({ display: 'none'})
        setRippleClicked(false)
      }, 1000);
    }
    if(props.onClick) {
      props.onClick(e)
    }
  }

  // 样式
  const wrapCls = classnames(`${prefixCls}-item`, className, {
    [`${prefixCls}-item-disabled`]: disabled,
    [`${prefixCls}-item-error`]: error,
    [`${prefixCls}-item-top`]: align === 'top',
    [`${prefixCls}-item-middle`]: align === 'middle',
    [`${prefixCls}-item-bottom`]: align === 'bottom',
  })
  const rippleCls = classnames(`${prefixCls}-ripple`, {
    [`${prefixCls}-ripple-animate`]: RippleClicked,
  })
  const lineCls = classnames(`${prefixCls}-line`, {
    [`${prefixCls}-line-multiple`]: multipleLine,
    [`${prefixCls}-line-wrap`]: wrap,
  })
  const arrowCls = classnames(`${prefixCls}-arrow`, {
    [`${prefixCls}-arrow-horizontal`]: arrow === 'horizontal',
    [`${prefixCls}-arrow-vertical`]: arrow === 'down' || arrow === 'up',
    [`${prefixCls}-arrow-vertical-up`]: arrow === 'up',
  })

  // 调整thummb位置使之底部有线
  const content = (
    <div
      {...restProps}
      onClick={onClick}
      className={wrapCls}
    >
      <div className={lineCls}>
        {thumb ? (
          <div className={`${prefixCls}-thumb`}>
            {typeof thumb === 'string' ? <img src={thumb} /> : thumb}
          </div>
        ) : null}
        {children !== undefined && (
          <div className={`${prefixCls}-content`}>{children}</div>
        )}
        {extra !== undefined && (
          <div className={`${prefixCls}-extra`}>{extra}</div>
        )}
        {arrow && <div className={arrowCls} aria-hidden="true" />}
      </div>
      <div style={coverRippleStyle} className={rippleCls} />
    </div>
  )
  
  const touchProps = {};
  Object.keys(restProps).forEach(key => {
    if (/onTouch/i.test(key)) {
      touchProps[key] = restProps[key];
      delete restProps[key];
    }
  });

  return (
    <TouchFeedback
      {...touchProps}
      disabled={disabled || !onClick}
      activeStyle={activeStyle}
      activeClassName={`${prefixCls}-item-active`}
    >
      {content}
    </TouchFeedback>
  )

}

ListItem.Brief = function Brief(props){
  return (
    <div className="xh-list-brief" style={props.style}>
      {props.children}
    </div>
  );
}

ListItem.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  align: PropTypes.oneOf(['middle', 'left', 'right']),
  error: PropTypes.bool,
  multipleLine: PropTypes.bool,
  wrap: PropTypes.bool,
  platform: PropTypes.string,
  onClick: PropTypes.func,
}

function noop() { }
ListItem.defaultProps = {
  prefixCls: 'xh-list',
  align: 'middle',
  error: false,
  multipleLine: false,
  wrap: false,
  platform: 'ios',
  onClick: noop,
}

export default ListItem