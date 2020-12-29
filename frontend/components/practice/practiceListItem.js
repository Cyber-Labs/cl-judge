import React from 'react'
import { ListGroupItem, Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import PropTypes from 'prop-types'
import CustomBadge from './customBadge'
import styles from './practiceListItem.module.css'

const PracticeListItem = ({ id, name, difficulty, backgroundColor }) => {
  let message = 'Easy'; let variant = 'success'
  if (difficulty === 'medium') {
    message = 'Medium'
    variant = 'warning'
  } else if (difficulty === 'hard') {
    message = 'Hard'
    variant = 'danger'
  }

  return (
    <ListGroupItem className={styles.hoverBackground} style={{ backgroundColor }}>
      <Row>
        <Col lg={2}>
          {id}
        </Col>
        <Col lg={7}>
          <Link href={`/practice/${id}`} passHref>
            {name}
          </Link>
        </Col>
        <Col lg={3} className='text-center'>
          <CustomBadge message={message} variant={variant} />
        </Col>
      </Row>
    </ListGroupItem>
  )
}

PracticeListItem.propTypes = {
  name: PropTypes.string,
  difficulty: PropTypes.string,
  id: PropTypes.number,
  backgroundColor: PropTypes.string
}

export default PracticeListItem
