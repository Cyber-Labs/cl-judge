import React from 'react'
import PropTypes from 'prop-types'

function Error (props) {
  const { message } = props
  return (
    <div className="col-12 heading justify-content-center loading">
      <br />
      <br />
      <br />
      <br />
      <h3 align="center" className="text-danger">
        {`Oops! ${message}`}
        <br />
        <br />
      </h3>
      &nbsp;
    </div>
  )
}

Error.propTypes = {
  message: PropTypes.string
}

export default Error
