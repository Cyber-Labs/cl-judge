import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'

const CustomBadge = ({ message, crossBtn, variant, onClose }) => {
  return (
        <Badge variant={variant}>
            {message}
            {crossBtn &&
                <>
                    &nbsp;
                    <span className="fa fa-times hover-cursor-pointer" onClick={onClose} />
                </>
            }
        </Badge>
  )
}

CustomBadge.propTypes = {
  message: PropTypes.string,
  crossBtn: PropTypes.bool,
  variant: PropTypes.string,
  onClose: PropTypes.func
}

export default CustomBadge
