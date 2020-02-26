import classnames from 'classnames'
import React from 'react'
import Notification from './Notification'
import './index.less'

let _msgInstance
const prefixCls = 'xh-toast'

const get_msgInstance = (mask, callBack) => {
  Notification.newInstance(
    {
      prefixCls,
      transitionName: 'xh-fade',
      className: classnames({
        [`${prefixCls}-mask`]: mask,
        [`${prefixCls}-nomask`]: !mask,
      })
    },
    (notification) => callBack && callBack(notification)
  )
}

const notice = (
  content, duration, onClose, mask, animation,
) => {
  get_msgInstance(mask, notification => {
    if (!notification) return
    if (_msgInstance) {
      _msgInstance.destroy()
      _msgInstance = null
    }
    _msgInstance = notification
    notification.notice({
      duration,
      content,
      animation,
      onClose: () => {
        onClose && onClose()
        notification.destroy()
        notification = null
        _msgInstance = null
      },
    })
  })
}

export default {
  show(content, duration, mask = true, animation) {
    return notice(content, duration, () => {}, mask, animation);
  }
}