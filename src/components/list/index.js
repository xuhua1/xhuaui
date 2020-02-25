import classnames from 'classnames'
import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import Item from './ListItem'
import './index.less'

const List = (props) => {
  const {
    prefixCls,
    className,
    style,
    children,
    renderHeader,
    renderFooter,
    ...restProps
  } = props

  const wrapCls =useMemo(() =>{
    return classnames(prefixCls, className)
  }, [prefixCls, className])

  return (
    <div className={wrapCls} style={style} {...restProps}>
      {renderHeader ? (
          <div className={`${prefixCls}-header`}>
            {typeof renderFooter === 'function' ? renderHeader() : renderHeader}
          </div>
      ) : null}
      {children ? (
        <div className={`${prefixCls}-body`}>{children}</div>
      ) : null}
      {renderFooter ? (
        <div className={`${prefixCls}-footer`}>
          {typeof renderFooter === 'function' ? renderFooter() : renderFooter}
        </div>
      ) : null}
    </div>
  )
}

List.Item = Item

List.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
  renderHeader: PropTypes.node,
  renderFooter: PropTypes.node,
}

List.defaultProps = {
  prefixCls: 'xh-list',
  style: {}
}

export default List