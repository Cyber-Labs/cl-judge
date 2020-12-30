import React from 'react'
import { ListGroupItem, Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import PropTypes from 'prop-types'
import CustomBadge from '../common/customBadge'
import styles from './practiceListItem.module.css'

const PracticeListItem = ({ id, name, difficulty, backgroundColor, isMobile }) => {
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
        <Col lg={2} className={isMobile ? 'text-center' : ''}>
          {id}
        </Col>
        <Col lg={7} className={isMobile ? 'text-center' : ''}>
          <Link href={`/practice/${id}`} passHref>
            <a className={ styles.questionTitle }>
            {name}
            </a>
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
  backgroundColor: PropTypes.string,
  isMobile: PropTypes.bool
}

export default PracticeListItem
