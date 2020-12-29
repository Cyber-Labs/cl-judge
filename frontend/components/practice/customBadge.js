import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'

const CustomBadge = ({ message, crossBtn, variant, onClose, description }) => {
  return (
        <Badge variant={variant} style={{ marginRight: '15px' }} title={description}>
            {message}
            {crossBtn &&
                <>
                    &nbsp;
                    <span
                      className="fa fa-times hover-cursor-pointer"
                      onClick={onClose}
                    />
                </>
            }
        </Badge>
  )
}

CustomBadge.propTypes = {
  message: PropTypes.string,
  crossBtn: PropTypes.bool,
  variant: PropTypes.string,
  onClose: PropTypes.func,
  description: PropTypes.string
}

export default CustomBadge
