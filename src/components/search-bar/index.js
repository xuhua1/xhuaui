import classnames from 'classnames';
import React, { useState, useEffect, useRef } from 'react'
import TouchFeedback from 'rmc-feedback';
import PropTypes from 'prop-types'
import './index.less'

const SearchBar = (props) => {
  const {
    prefixCls,
    className,
    style,
    value,
    placeholder,
    showCancelButton,
    cancelText,
    disabled,
    autoFocus,
    maxLength,
  } = props;
  // 处理动画
  const inputContainerRef = useRef()
  const syntheticPhRef = useRef()
  const syntheticPhContainerRef = useRef()
  const rightBtnRef = useRef()

  const inputRef = useRef()

  const [focus, setFocus] = useState(false)

  let onBlurTimeout // blur定时器
  let blurFromOnClear = false // 是否确认失去焦点（点击清除/点击取消)
  let rightBtnInitMarginleft = null // 取消按钮
  // hook函数
  useEffect(()=>{
    if(autoFocus && inputRef){
      inputRef.current.focus()
    }
    if (rightBtnRef) {
      const initBtn = window.getComputedStyle(rightBtnRef.current);
      rightBtnInitMarginleft = initBtn.marginLeft;
    }
    return () => {
      if (onBlurTimeout) {
        clearNextFrameAction(onBlurTimeout);
        onBlurTimeout = null;
      }
    }
  }, [])
  // 组件更新
  useEffect(() => {
    if(syntheticPhRef) {
      if(
        inputContainerRef &&
        inputContainerRef.current.className.indexOf(
          `${prefixCls}-start`,
        ) > -1
      ) {
        // 检测是否包含名为 ${props.prefixCls}-start 样式，生成动画
        // offsetWidth 某些时候是向上取整，某些时候是向下取整，不能用
        if(syntheticPhContainerRef) {
          const realWidth = syntheticPhContainerRef.current.getBoundingClientRect()
          .width; // 包含小数
          syntheticPhRef.current.style.width = `${Math.ceil(realWidth)}px`;
        }
        if (!showCancelButton && rightBtnRef) {
          rightBtnRef.current.style.marginRight = '0';
        }
      } else {
        syntheticPhRef.current.style.width = '100%';
        if (!showCancelButton && rightBtnRef) {
          rightBtnRef.current.style.marginRight = `-${rightBtnRef.current
            .offsetWidth +
            (rightBtnInitMarginleft != null
              ? parseInt(rightBtnInitMarginleft, 10)
              : 0)}px`;
        }
      }
    }
  })
  // input setFocus
  const setInputfocus = () => {
    if(inputRef){
      inputRef.current.focus();
    }
  }
  // input about fun
  const onSubmit = (e) => {
    e.preventDefault()
    props.onSubmit(value || '')
    if (inputRef) {
      inputRef.current.blur();
    }
  }
  const onChange = (e) => {
    if(!focus) setFocus(true)
    const { value } = e.target
    props.onChange(value)
  }
  const onFocus = () => {
    props.onFocus()
    setFocus(true)
  }
  const onBlur = () => {
    // 等待doClear, onCancel 函数代码执行完毕后执行
    onBlurTimeout = setTimeout(() => {
      if(!blurFromOnClear && document.activeElement !== inputRef) setFocus(false)
      blurFromOnClear = false
    }, 1);
    // fix autoFocus item blur with flash
    setTimeout(() => {
      // fix ios12 wechat browser click failure after input
      if (document.body) {
        document.body.scrollTop = document.body.scrollTop;
      }
    },100);
    props.onBlur();
  }
  const doClear = () => {
    blurFromOnClear = true
    props.onChange('')
    setInputfocus()
  }
  const onCancel = () => {
    blurFromOnClear = false
    props.onCancel()
    props.onChange('')
  }

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-start`]: !!(focus || (value && value.length > 0)),
  })
  const clearCls = classnames(`${prefixCls}-clear`, {
    [`${prefixCls}-clear-show`]: !!(focus && value && value.length > 0),
  })
  const cancelCls = classnames(`${prefixCls}-cancel`, {
    [`${prefixCls}-cancel-show`]: !!(
      showCancelButton ||
      focus ||
      (value && value.length > 0)
    ),
    [`${prefixCls}-cancel-anim`]: true,
  })

  return (
    <form
      onSubmit={onSubmit}
      className={wrapCls}
      style={style}
      ref={inputContainerRef}
      action="#"
    >
      <div className={`${prefixCls}-input`}>
        <div
          className={`${prefixCls}-synthetic-ph`}
          ref={syntheticPhRef}
        >
          <span
            className={`${prefixCls}-synthetic-ph-container`}
            ref={syntheticPhContainerRef}
          >
            <i className={`${prefixCls}-synthetic-ph-icon`} />
            <span
              className={`${prefixCls}-synthetic-ph-placeholder`}
              // tslint:disable-next-line:jsx-no-multiline-js
              style={{
                visibility: placeholder && !value ? 'visible' : 'hidden',
              }}
            >
              {placeholder}
            </span>
          </span>
        </div>
        <input
          type="search"
          className={`${prefixCls}-value`}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={inputRef}
          maxLength={maxLength}
        />
        <TouchFeedback activeClassName={`${prefixCls}-clear-active`}>
          <a onClick={doClear} className={clearCls} />
        </TouchFeedback>
      </div>
      <div
        className={cancelCls}
        onClick={onCancel}
        ref={rightBtnRef}
      >
        {cancelText}
      </div>
    </form>
  )
}

SearchBar.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onSubmit: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onCancel: PropTypes.func,
  showCancelButton: PropTypes.bool,
  cancelText: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  maxLength: PropTypes.number,
}

function noop() { }
SearchBar.defaultProps = {
  prefixCls: 'xh-search',
  style: {},
  value: '',
  placeholder: '',
  onSubmit: noop,
  onFocus: noop,
  onBlur: noop,
  onCancel: noop,
  showCancelButton: false,
  cancelText: '取消',
  disabled: false,
  autoFocus: false,
  maxLength: 100,
}

export default SearchBar