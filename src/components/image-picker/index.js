import classnames from 'classnames'
import React, { useCallback, useRef, useMemo } from 'react'
import TouchFeedback from 'rmc-feedback';
import PropTypes from 'prop-types'
import Flex from '../flex/index';
import './index.less'

const ImgPick = (props) => {
  const {
    prefixCls,
    className,
    style,
    accept,
    capture,
    multiple,
    selectable,
    count,
    cancelIcon,
  } = props
  const inputRef = useRef()

  // http://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side
  const getOrientation = useCallback(
    (file, callback) => {
      const reader = new FileReader();
      reader.onload = e => {
        const view = new DataView(e.target.result);
        if (view.getUint16(0, false) !== 0xffd8) {
          return callback(-2);
        }
        const length = view.byteLength;
        let offset = 2;
        while (offset < length) {
          const marker = view.getUint16(offset, false);
          offset += 2;
          if (marker === 0xffe1) {
            const tmp = view.getUint32((offset += 2), false);
            if (tmp !== 0x45786966) {
              return callback(-1);
            }
            const little = view.getUint16((offset += 6), false) === 0x4949;
            offset += view.getUint32(offset + 4, little);
            const tags = view.getUint16(offset, little);
            offset += 2;
            for (let i = 0; i < tags; i++) {
              if (view.getUint16(offset + i * 12, little) === 0x0112) {
                return callback(view.getUint16(offset + i * 12 + 8, little));
              }
            }
          } else if ((marker & 0xff00) !== 0xff00) {
            break;
          } else {
            offset += view.getUint16(offset, false);
          }
        }
        return callback(-1);
      };
      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    }, []
  )
  const getRotation = useCallback(
    (orientation = 1) => {
      let imgRotation = 0;
      switch (orientation) {
        case 3:
          imgRotation = 180;
          break;
        case 6:
          imgRotation = 90;
          break;
        case 8:
          imgRotation = 270;
          break;
        default:
      }
      return imgRotation;
    }, []
  )
  const parseFile = useCallback(
    (file, index) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = e => {
          const dataURL = e.target.result
          if (!dataURL) {
            reject(`第 ${index} 张图片获取失败`)
            return
          }
          let orientation = 1;
          getOrientation(file, res => {
            // -2: not jpeg , -1: not defined
            if (res > 0) {
              orientation = res;
            }
            resolve({
              url: dataURL,
              orientation,
              file,
            })
          });
        }
      })
    }, [getOrientation]
  )
  const removeImage = useCallback(
    (index) => {
      const newImages = []
      props.files.forEach((image, idx) => {
        if (index !== idx) newImages.push(image)
      })
      props.onChange(newImages, 'remove', index)
    }, [props.files, props.onChange]
  )
  const addImage = useCallback(
    (imageItem) => {
      const newImages = props.files.concat(imageItem)
      console.log(newImages)
      props.onChange(newImages, 'add')
    }, [props.files, props.onChange]
  )
  const onImageClick = useCallback(
    (index) => {
      props.onImageClick(index, props.files)
    }, [props.files, props.onImageClick]
  )
  const onFileChange = useCallback(
    () => {
      if (
        inputRef &&
        inputRef.current.files &&
        inputRef.current.files.length
      ) {
        const { files } = inputRef.current;
        const imageParsePromiseList = []
        for (let i = 0; i < files.length; i++) {
          imageParsePromiseList.push(parseFile(files[i], i))
        }
        Promise.all(imageParsePromiseList)
          .then(imageItems => addImage(imageItems))
          .catch(
            error => {
              if (props.onFail) {
                props.onFail(error);
              }
            },
          )
      }
      if (inputRef) inputRef.current.value = ''
    }
  )

  const wrapCls = useMemo(
    () => classnames(prefixCls, className), [prefixCls, className]
  )

  const imgItemList = useMemo(
    () => {
      const filesList = []
      props.files.forEach((image, index) => {
        const imgStyle = {
          backgroundImage: `url("${image.url}")`,
          transform: `rotate(${getRotation(image.orientation)}deg)`,
        }
        const itemStyle = {}
        filesList.push(
          <Flex.Item style={itemStyle} key={`image-${index}`} >
            <div className={`${prefixCls}-item`}>
              {cancelIcon && <div
                className={`${prefixCls}-item-remove`}
                role="button"
                aria-label="Click and Remove this image"
                // tslint:disable-next-line:jsx-no-multiline-js
                onClick={() => {
                  removeImage(index);
                }}
              >{cancelIcon}</div>}
              <div
                className={`${prefixCls}-item-content`}
                role="button"
                aria-label="Image can be clicked"
                // tslint:disable-next-line:jsx-no-multiline-js
                onClick={() => {
                  onImageClick(index);
                }}
                style={imgStyle}
              />
            </div>
          </Flex.Item>
        )
      })
      return filesList
    }, [props.files, getRotation, prefixCls, removeImage, onImageClick]
  )
  const InputPick = useMemo(
    () => (
      <Flex.Item key="select">
        <TouchFeedback activeClassName={`${prefixCls}-upload-btn-active`}>
          <div
            className={`${prefixCls}-item ${prefixCls}-upload-btn`}
            onClick={props.onAddImageClick}
            role="button"
            aria-label="Choose and add image"
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              onChange={onFileChange}
              multiple={multiple}
              capture={capture}
            />
          </div>
        </TouchFeedback>
      </Flex.Item>
    ), [prefixCls, props.onAddImageClick, accept, onFileChange, multiple, capture]
  )
  const renderElement = useMemo(
    () => {
      const allElement = selectable ? imgItemList.concat([InputPick]) : imgItemList
      const length = allElement.length
      if (length !== 0 && length % count !== 0) {
        const blankCount = count - length % count;
        for (let i = 0; i < blankCount; i++) {
          allElement.push(<Flex.Item key={`blank-${i}`}></Flex.Item>)
        }
      }
      const flexRowEle = []
      for (let i = 0; i < length / count; i++) {
        const rowEl = allElement.slice(i * count, i * count + count);
        flexRowEle.push(rowEl);
      }
      return flexRowEle.map((item, index) => (
        <Flex key={`row-${index}`} >{item}</Flex>
      ))
    }, [selectable, imgItemList, InputPick, count]
  )
  return (
    <div className={wrapCls} style={style}>
      <div className={`${prefixCls}-list`} role="group">
        {renderElement}
      </div>
    </div>
  )
}

ImgPick.propTypes = {
  prefixCls: PropTypes.string,
  className: PropTypes.string,
  accept: PropTypes.string,
  files: PropTypes.array,
  capture: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  multiple: PropTypes.bool,
  selectable: PropTypes.bool,
  onChange: PropTypes.func,
  onImageClick: PropTypes.func,
  onAddImageClick: PropTypes.func,
  onFail: PropTypes.func,
  count: PropTypes.number,
  cancelIcon: PropTypes.node,
}

function noop() { }
ImgPick.defaultProps = {
  prefixCls: 'xh-image-picker',
  accept: 'image/*',
  files: [],
  capture: false,
  multiple: false,
  selectable: true,
  onChange: noop,
  onImageClick: noop,
  onAddImageClick: noop,
  onFail: noop,
  count: 4,
}

export default ImgPick