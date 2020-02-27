import classnames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import loadSprite from './loadSprite';

const Icon = (props) => {
  const {
    size,
    onClick,
    type,
    className,
    ...restProps
  } = props
  useEffect(() => {
    loadSprite()
  }, [])
  const cls = useMemo(() => classnames(
    className,
    'am-icon',
    `am-icon-${type}`,
    `am-icon-${size}`,
  ), [className, type, size])
  return (
    <svg className={cls} {...restProps}>
      <use xlinkHref={`#${type}`} />
    </svg>
  );
}

Icon.propTypes = {
  size: PropTypes.oneOf([
    'xxs', 'xs', 'sm', 'md', 'lg'
  ]),
  onClick: PropTypes.func
}

function noop() { }
Icon.defaultProps = {
  size: 'md',
  onClick: noop,
}

export default Icon