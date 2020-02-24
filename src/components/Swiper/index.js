import classnames from 'classnames'
import React from 'react'
import PropTypes from 'prop-types'
import './index.less'

class Swiper extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      index: props.index
    }
    this.swiperRef = React.createRef()
    this.swiperItemWidth = 0 //走马灯的宽度
    this.animationTimeout = null // 动画定时器
    this.dataSourceLength = props.children.length || 1// 字组件
  }

  componentDidMount() {
    const { index } = this.state
    this.swiperRef.current.style.width = `${this.dataSourceLength * 100}%`
    this.swiperItemWidth = this.swiperRef.current.getBoundingClientRect()
      .width / this.dataSourceLength
    this.swiperRef.current.style.left = -this.swiperItemWidth * index + 'px'
  }
  componentWillUnmount() {
    clearTimeout(this.animationTimeout)
    this.animationTimeout = null
  }

  startTouchTrackX = 0
  oldTouchTrackX = 0
  isStartTouch = 0
  handleTouchStart = (e) => {
    this.startTouchTrackX = e.touches[0].pageX;
    this.oldTouchTrackX = this.startTouchTrackX;
    this.isStartTouch = true;
  }
  handleTouchMove = (e) => {
    if (!this.isStartTouch) return
    const { index } = this.state
    this.oldTouchTrackX = e.touches[0].pageX
    const offsetX = this.oldTouchTrackX - this.startTouchTrackX
    // 计算正确的左偏移
    this.swiperRef.current.style.left = -this.swiperItemWidth * index + offsetX + 'px'
  }
  handleTouchEnd = (e) => {
    const { index } = this.state;
    let newIndex = index;
    const minLen = this.swiperItemWidth / 10;
    const moveX = this.oldTouchTrackX - this.startTouchTrackX;
    if (Math.abs(moveX) > minLen) {
      newIndex = moveX > 0 ? newIndex - 1 : newIndex + 1;
      newIndex = Math.max(newIndex, 0);
      newIndex = Math.min(newIndex, this.dataSourceLength - 1);
    }
    this.setState({ index: newIndex })
    this.swiperRef.current.style.left = -this.swiperItemWidth * newIndex + 'px';
    this.swiperRef.current.style.cssText += `transition: left 0.3s ease-in;`;
    this.clearTime = setTimeout(() => {
      this.swiperRef.current.style.cssText = this.swiperRef.current.style.cssText.replace('transition', '');
    }, 500);
  }

  handleSwiperClick = (e) => {
    e.stopPropagation();
    this.props.onSwiperClick();
  }

  render() {
    const { prefixCls, className, style, children } = this.props
    const wrapCls = classnames(prefixCls, className)
    return (
      <div
        className={wrapCls}
        onClick={this.handleSwiperClick}
        style={style}
      >
        <div
          ref={this.swiperRef}
          className={`${prefixCls}-wrap`}
          onTouchStart={this.handleTouchStart}
          onTouchMove={this.handleTouchMove}
          onTouchEnd={this.handleTouchEnd}
        >
          {
            children.map((item, idx) =>(
              <div
                key={idx}
                className={`${prefixCls}-wrap-item`}
                style={{ width: `${100 / this.dataSourceLength}%` }}
              >
                {item}
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

Swiper.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  index: PropTypes.number,
  dataSource: PropTypes.array.isRequired,
  onSwiperClick: PropTypes.func,
}

function noop() { }
Swiper.defaultProps = {
  prefixCls: 'xh-swiper',
  style: {},
  index: 0,
  dataSource: [],
  onSwiperClick: noop,
}

export default Swiper