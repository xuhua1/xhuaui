
import classnames from 'classnames';
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Notice from './Notice'

let noticeNumber = 0
const getUuid = () => {
  return `notification-${new Date().getTime()}-${noticeNumber++}`
}

class Notification extends Component {

  constructor(props) {
    super(props)
    this.state = {
      notices: [],
    }
  }

  add = (notice) => {
    const { notices } = this.state
    const key = notice.key ? notice.key : notice.key = getUuid()
    const noticeIndex = notices.map(item => item.key).indexOf(key)
    const newNotices = notices.concat()
    if (noticeIndex !== -1) {
      newNotices.splice(noticeIndex, 1, notice);
    } else {
      newNotices.push(notice)
    }
    this.setState({
      notices: newNotices,
    })
  }

  remove = (key) => {
    const { notices } = this.state
    const newNotices = notices.filter(notice => notice.key !== key)
    this.setState({
      notices: newNotices
    })
  }

  getNoticeDoM = () => {
    const { notices } = this.state
    const result = []
    const { prefixCls } = this.props
    notices.map((notice) => {
      const closeCallback = () => {
        this.remove(notice.key)
        if (notice.onClose) notice.onClose()
      }
      const noticeProps = {
        prefixCls,
        ...notice,
      }
      result.push(
        <Notice key={notice.key} {...noticeProps} onClose={closeCallback} />
      )
    })
    return result
  }

  render() {
    const { prefixCls, className, style } = this.props
    return (
      <div className={classnames(prefixCls, className)} style={style}>
        <span>
          {
            this.getNoticeDoM()
          }
        </span>
      </div>
    )
  }
}

Notification.newInstance = (properties, callback) => {
  const { ...props } = properties

  let div = document.createElement('div')
  document.body.appendChild(div)

  let called = false;
  function ref(notification) {
    if (called) {
      return;
    }
    called = true;
    callback({
      notice(noticeProps) {
        notification.add(noticeProps);
      },
      removeNotice(key) {
        notification.remove(key);
      },
      destroy() {
        ReactDOM.unmountComponentAtNode(div);
        div.parentNode.removeChild(div);
      },
      component: notification,
    });
  }
  ReactDOM.render(<Notification {...props} ref={ref} />, div)
}

export default Notification