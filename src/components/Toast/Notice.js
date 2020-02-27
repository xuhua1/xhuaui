import classnames from 'classnames'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Notice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shouldClose: false
    }
  }

  closeTimer = null
  componentDidMount() {
    const { duration } = this.props
    if (duration > 300) {
      this.closeTimer = setTimeout(() => {
        this.close()
      }, duration - 300)
    }
  }
  componentWillUnmount() {
    clearTimeout(this.closeTimer)
    this.closeTimer = null
  }

  close = () => {
    this.setState({ shouldClose: true })
    clearTimeout(this.closeTimer)
    this.closeTimer = setTimeout(() => {
      this.props.onClose()
    }, 300)
  }

  render() {
    const { prefixCls, className, content, animation } = this.props
    const { shouldClose } = this.state
    const wrapCls = classnames(`${prefixCls}-notice`, className, {
      [`${prefixCls}-a-leave`]: shouldClose,
    })
    const contentCls = classnames(`${prefixCls}-notice-content`, {
      [`${prefixCls}-a-${animation}`]: true,
    })
    return (
      <div className={wrapCls}>
        <div className={contentCls}>
          <div className={`${prefixCls}-text`}>
            {content}
          </div>
        </div>
      </div>
    )
  }
}

Notice.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  duration: PropTypes.number,
  content: PropTypes.node,
  animation: PropTypes.string,
  onClose: PropTypes.func,
}

function noop() { }
Notice.defaultProps = {
  prefixCls: 'xh-toast',
  duration: 3000,
  content: '',
  animation: '',
  onClose: noop,
}

export default Notice