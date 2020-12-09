import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

function Toast (props) {
  const { level, visible, message } = props
  const [isVisible, setVisible] = useState(true)
  useEffect(() => {
    if (visible !== isVisible) { setVisible(visible) }
  }, [visible])
  let classes = `custom-toast ${level} `
  classes += isVisible ? 'visible' : ''
  return (
    <>
      <div className={classes}>
        <figure>
          {level === 'success' && <img src='/images/check-circle-white.svg'/>}
          {level === 'warning' && <img src='/images/warning-white.svg'/>}
          {level === 'danger' && <img src='/images/times-circle-white.svg'/>}
        </figure>
        <div style={{ paddingTop: '15px' }}>
          <p className='toast-message'>{ message }</p>
        </div>
      </div>
      <style jsx>{`
      .custom-toast {
        -webkit-box-align: center;
                align-items: center;
        border-radius: 25px;
        bottom: 0px;
        display: -webkit-box;
        display: flex;
        min-height: 50px;
        max-height: 50px;
        -webkit-box-pack: justify;
        justify-content: space-between;
        left: 50%;
        z-index: 105;
        padding: 0 20px;
        position: fixed;
        -webkit-transform: translateX(-50%) translateY(150%);
                transform: translateX(-50%) translateY(150%);
        -webkit-transition: -webkit-transform .35s ease;
        transition: -webkit-transform .35s ease;
        transition: transform .35s ease;
        transition: transform .35s ease, -webkit-transform .35s ease
      }
      .custom-toast.visible {
        -webkit-transform: translateX(-50%) translateY(-50%);
                transform: translateX(-50%) translateY(-50%);
      }
      .custom-toast.success {
        background-color: #16a085
      }
      .custom-toast.success p {
        color: #fff;
      }
      .custom-toast.danger {
        background-color: #c0392b
      }
      .custom-toast.danger p {
        color: #fff;
      }
      .custom-toast.warning {
        background-color: #F38211
      }
      .custom-toast.warning p {
        color: #fff;
      }
      .custom-toast figure {
        height: 35px;
        margin: 0 15px 0 0;
        opacity: .9;
        width: 35px;
        color: white;        
      }
      .custom-toast figure img {
        height: 100%;
        width: 100%;
        color: white;
        fill: white;
      }
      .toast-message {
        color: #000;
        font-family: 'Noto Sans';
        font-size: 14px;
        white-space: nowrap;
      }
      `}
      </style>
    </>
  )
}

Toast.propTypes = {
  visible: PropTypes.bool.isRequired,
  level: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
}

export default Toast
