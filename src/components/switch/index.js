import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import './index.less'

const Switch = (props) => {
  const {
    prefixCls,
    className,
    color,
    name,
    platform,
    checked,
    disabled,
    ...restProps
  } = props

  const onChange = (e) => {
    const { checked } = e.target;
    props.onChange(checked)
  }

  const onClick = (e) => {
    let val
    if(e && e.target && e.target.checked !== undefined){
      val = e.target.checked
    } else {
      val = checked
    }
    props.onClick(val)
  }

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-android`]: platform === 'android',
  });

  // 样式
  const fackInputCls = classnames('checkbox', {
    [`checkbox-disabled`]: disabled,
  });
  const globalProps = Object.keys(restProps).reduce((prev, key) => {
    if (
      key.substr(0, 5) === 'aria-' ||
      key.substr(0, 5) === 'data-' ||
      key === 'role'
    ) {
      prev[key] = restProps[key];
    }
    return prev;
  }, {});
  const style = props.style || {};
  if (color && checked) {
    style.backgroundColor = color;
  }

  return (
    <label className={wrapCls}>
      <input
        type="checkbox"
        name={name}
        className={`${prefixCls}-checkbox`}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        value={checked ? 'on' : 'off'}
        {...(!disabled ? { onClick: onClick } : {})}
        {...globalProps}
      />
      <div
        className={fackInputCls}
        style={style}
        {...(disabled ? { onClick: onClick } : {})}
      />
    </label>
  )
}

Switch.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  name: PropTypes.string,
  platform: PropTypes.string,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
}

function noop() { }
Switch.defaultProps = {
  prefixCls: 'xh-switch',
  name: '',
  platform: 'ios',
  checked: false,
  disabled: false,
  onChange: noop,
  onClick: noop,
}

export default Switch