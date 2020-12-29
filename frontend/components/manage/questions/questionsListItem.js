import React from 'react'
import { ListGroupItem, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import Link from 'next/link'
import PropTypes from 'prop-types'
import CustomBadge from '../../common/customBadge'
import styles from './questionsListItem.module.css'

const ManageQuestionsListItem = ({ id, name, difficulty, backgroundColor, creator }) => {
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
        <Col lg={1}>
          {id}
        </Col>
        <Col lg={6}>
            <OverlayTrigger
                placement="right"
                overlay={<Tooltip>View and update question</Tooltip>}
            >
                {({ ref, ...triggerHandler }) => (
                    <Link href={`/manage/questions/${id}`} passHref>
                        <a ref={ref} {...triggerHandler}>{name}</a>
                    </Link>
                )}
            </OverlayTrigger>
        </Col>
        <Col lg={2} className='text-center'>
          <CustomBadge message={message} variant={variant} />
        </Col>
        <Col lg={3} className='text-center'>
            {creator}
        </Col>
      </Row>
    </ListGroupItem>
  )
}

ManageQuestionsListItem.propTypes = {
  name: PropTypes.string,
  difficulty: PropTypes.string,
  id: PropTypes.number,
  backgroundColor: PropTypes.string,
  creator: PropTypes.string
}

export default ManageQuestionsListItem
