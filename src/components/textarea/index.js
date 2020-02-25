import classnames from 'classnames'
import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import PropTypes from 'prop-types'
import TouchFeedback from 'rmc-feedback';
import { IS_IOS, emojiReg } from '../../utils/index'
import './index.less'

const TextArea = (props) => {
  const {
    prefixCls,
    className,
    style,
    placeholder,
    value,
    count,
    autoHeight,
    disabled,
    cancelIcon,
  } = props
  const [focus, setFocus] = useState(false)
  const [debounceTimeout, setDebounceTimeout] = useState(null)
  const textareaRef = useRef()

  const reAlignHeight = useCallback(() => {
    textareaRef.current.style.height = '' // 字数减少时能自动减小高度
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
  }, [textareaRef])

  useEffect(() => {
    if (autoHeight) {
      reAlignHeight()
    }
  }, [autoHeight])
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        setDebounceTimeout(null)
      }
    }
  }, [])

  const onChange = useCallback((e) => {
    props.onChange(e.target.value)
    if (autoHeight) reAlignHeight()
  }, [props.onChange, autoHeight])
  const onBlur = useCallback((e) => {
    setDebounceTimeout(
      setTimeout(() => {
        if (document.activeElement !== textareaRef.current) {
          setFocus(false)
        }
      }, 100)
    )
    const { value } = e.currentTarget
    // fix autoFocus item blur with flash
    setTimeout(() => {
      // fix ios12 wechat browser click failure after input
      if (document.body) {
        document.body.scrollTop = document.body.scrollTop
      }
    }, 100);
    props.onBlur(value)
  }, [props.onBlur])
  const onFocus = useCallback((e) => {
    setFocus(true)
    const { value } = e.currentTarget
    props.onFocus(value)
  }, [props.onFocus])
  const clearInput = useCallback(() => {
    props.onChange('')
    textareaRef.current.focus()
  }, [props.onChange, textareaRef])

  const wrapCls = useMemo(() => {
    const cls = classnames(prefixCls, className, {
      [`${prefixCls}-disabled`]: disabled,
      [`${prefixCls}-focus`]: focus,
      [`${prefixCls}-has-count`]: count,
    })
    return cls
  }, [prefixCls, className, disabled, focus, count])

  const characterLength = useMemo(() => {
    console.log(typeof value, value.replace)
    return value.replace(emojiReg, '_').length
  }, [value])
  const MaxLength = useMemo(() => {
    if (!(count > 0)) return undefined
    let maxLen = 0
    if (IS_IOS) {
      const entValue = value ? value.replace(emojiReg, '_') : ''
      const entLen = entValue ? entValue.split('_').length - 1 : 0
      maxLen = count + entLen - characterLength + (value ? value.length : 0)
    } else {
      maxLen = count - characterLength + (value ? value.length : 0)
    }
    console.log(IS_IOS, 'max = ' + maxLen)
    return maxLen
  }, [value])

  return (
    <div className={wrapCls}>
      <div className={`${prefixCls}-control`}>
        <textarea
          ref={textareaRef}
          maxLength={MaxLength}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          readOnly={disabled}
          style={style}
        />
      </div>
      {!!cancelIcon &&
        !disabled &&
        value &&
        characterLength && (
          <TouchFeedback activeClassName={`${prefixCls}-clear-active`}>
            <span
              className={`${prefixCls}-clear`}
              onClick={clearInput}
            >
              {cancelIcon}
            </span>
          </TouchFeedback>
        )}
      {count && (
        <span className={`${prefixCls}-count`}>
          <span>{value ? characterLength : 0}</span>/{count}
        </span>
      )}
    </div>
  )
}

TextArea.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  count: PropTypes.number,
  autoHeight: PropTypes.bool,
  rows: PropTypes.number,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  cancelIcon: PropTypes.node,
}

function noop() { }
TextArea.defaultProps = {
  prefixCls: 'xh-textarea',
  style: {},
  placeholder: '',
  value: '',
  autoHeight: false,
  rows: 2,
  disabled: false,
  onChange: noop,
  onBlur: noop,
  onFocus: noop,
}

export default TextArea