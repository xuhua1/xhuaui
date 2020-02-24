import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import './index.less'

class ScreenScroll extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      index: props.index
    }
    this.scrollWrapRef = React.createRef()
  }
  componentDidMount() {
    const { index } = this.state
    this.swiperParentItemHeight = this.scrollWrapRef.current.parentNode.offsetHeight
    const num = this.props.children.length || 0
    this.scrollWrapRef.current.style.height = `${this.swiperParentItemHeight * num}px`
    this.scrollWrapRef.current.style.top = `${-this.swiperParentItemHeight * index}px`
  }
  componentWillUnmount() {
    clearTimeout(this.animationScrollTimeout)
    this.animationScrollTimeout = null
  }

  startTouchTrackY = 0
  oldTouchTrackY = 0
  isStartTouch = 0
  handleTouchStart = (e) => {
    this.startTouchTrackY = e.touches[0].pageY
    this.oldTouchTrackY = this.startTouchTrackY
    this.isStartTouch = true;
  }
  handleTouchMove = (e) => {
    if (!this.isStartTouch) return
    const { index } = this.state
    this.oldTouchTrackY = e.touches[0].pageY
    const offsetY = this.oldTouchTrackY - this.startTouchTrackY
    // 计算正确的左偏移
    this.scrollWrapRef.current.style.top = -this.swiperParentItemHeight * index + offsetY + 'px'
  }
  handleTouchEnd = (e) => {
    const { index } = this.state
    const { children } = this.props
    let newIndex = index;
    const minLen = this.swiperParentItemHeight / 10
    const moveY = this.oldTouchTrackY - this.startTouchTrackY
    if (Math.abs(moveY) > minLen) {
      newIndex = moveY > 0 ? newIndex - 1 : newIndex + 1
      newIndex = Math.max(newIndex, 0);
      newIndex = Math.min(newIndex, children.length - 1)
    }
    this.setState({ index: newIndex })
    this.scrollWrapRef.current.style.top = -this.swiperParentItemHeight * newIndex + 'px'
    this.scrollWrapRef.current.style.cssText += `transition: top 0.3s ease-in;`
    this.animationScrollTimeout = setTimeout(() => {
      this.scrollWrapRef.current.style.cssText = this.scrollWrapRef.current.style.cssText.replace('transition', '')
    }, 500)
  }

  render() {
    const { prefixCls, className, style, children } = this.props
    return (
      <div
        className={classnames(prefixCls, className)}
        style={style}
      >
        <div
          className={`${prefixCls}-wrap`}
          ref={this.scrollWrapRef}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
        >
          {
            children.map((item, idx) => {
              return (
                <div
                  key={idx}
                  className={`${prefixCls}-wrap-item`}
                  style={{height: `${this.swiperParentItemHeight}px`}}
                >
                  滑动{item}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

ScreenScroll.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  index: PropTypes.number,
}

ScreenScroll.defaultProps = {
  prefixCls: 'xh-screen-scrool',
  style: {},
  index: 0,
}

export default ScreenScroll