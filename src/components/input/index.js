import classnames from 'classnames'
import React, { useCallback, useEffect, useMemo } from 'react'
import TouchFeedback from 'rmc-feedback'
import PropTypes from 'prop-types'
import './index.less'

const Input = (props) => {
  const {
    prefixCls,
    className,
    style,
    value,
    placeholder,
    cancelIcon,
  } = props

  const inputRef = React.useRef()
  // input setFocus
  const setInputFocus = useCallback(() => {
    if (inputRef) {
      inputRef.current.focus();
    }
  }, [inputRef])
  const onChange = useCallback((e) => {
    const { value } = e.target
    props.onChange(value)
  }, [props.onChange])
  const doClear = useCallback(() => {
    props.onChange('')
    setInputFocus()
  }, [props.onChange, setInputFocus])

  const isShowCancen = (document.activeElement === inputRef.current) && value;
  const wrapCls = useMemo(
    () => classnames(prefixCls, className, {
      [`${prefixCls}-clear-focus`]: isShowCancen,
    }), [prefixCls, className, isShowCancen]
  )
  return (
    <div
      className={wrapCls}
      onClick={setInputFocus}
      style={style}
    >
      <div
        className={`${prefixCls}-control`}
      >
        <input
          onChange={onChange}
          ref={inputRef}
          value={value}
          placeholder={placeholder}
        />
      </div>
      <TouchFeedback activeClassName={`${prefixCls}-clear-active`}>
        <a
          className={`${prefixCls}-clear`}
          onClick={doClear}
        >
          {cancelIcon}
        </a>
      </TouchFeedback>
    </div>
  )
}

Input.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  cancelIcon: PropTypes.node,
}

function noop() { }
Input.defaultProps = {
  prefixCls: 'xh-input',
  style: {},
  value: '',
  placeholder: '',
  onChange: noop,
}

export default Input