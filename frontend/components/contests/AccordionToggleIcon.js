import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useAccordionToggle, AccordionContext, Col } from 'react-bootstrap'

function AccordionToggleIcon ({ children, eventKey, callback }) {
  const currentEventKey = useContext(AccordionContext)

  const decoratedOnClick = useAccordionToggle(
    eventKey,
    () => callback && callback(eventKey)
  )

  const isCurrentEventKey = currentEventKey === eventKey

  return (
    <Col className='text-center'>
      <span
        className={isCurrentEventKey ? 'fa fa-chevron-up' : 'fa fa-chevron-down'}
        onClick={decoratedOnClick}
        style={{ cursor: 'pointer' }}
      />
    </Col>
  )
}

AccordionToggleIcon.propTypes = {
  children: PropTypes.any,
  eventKey: PropTypes.string,
  callback: PropTypes.func
}

export default AccordionToggleIcon
