import classnames from 'classnames'
import React from 'react'
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types'
import './index.less'

const TabBar = (props) => {
  const {
    prefixCls,
    hidden,
    dataSource,
    className,
  } = props

  if (hidden) {
    return null
  }
  return (
    <div className={classnames(prefixCls, className)}>
      <div className={`${prefixCls}-bar`}>
        {
          dataSource.map((data, idx) => {
            const { text, path, icon } = data;
            return (
              <NavLink
                className={`${prefixCls}-tab`}
                activeClassName={props.activeClassName}
                key={idx}
                to={path}
                replace
              >
                <div className={`${prefixCls}-tab-icon`}>
                  {icon}
                </div>
                <p
                  className={`${prefixCls}-tab-title`}
                >
                  {text}
                </p>
              </NavLink>
            )
          })
        }
      </div>
    </div>
  )
}

TabBar.propTypes = {
  prefixCls: PropTypes.string,
  hidden: PropTypes.bool,
  dataSource: PropTypes.array,
  className: PropTypes.string,
  activeClassName: PropTypes.string,
}

TabBar.defaultProps = {
  prefixCls: 'xh-tab-bar',
  hidden: false,
  dataSource: [],
  activeClassName: 'active',
}

export default TabBar