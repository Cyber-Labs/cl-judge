import React from 'react'
import { ListGroupItem, Row, Col } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import PropTypes from 'prop-types'

function NotificationListItem (props) {
  const { heading, description, createdAt } = props
  return (
    <ListGroupItem
      style={{
        backgroundColor: 'whitesmoke',
        marginTop: '8px',
        borderRadius: '8px',
        boxShadow: '1px 2px #888888'
      }}
    >
      <Row>
        <Col md={7} lg={9}>
          <h5>
            <b>{heading}</b>
          </h5>
          <ReactMarkdown plugins={[gfm]} source={description} />
        </Col>
        <Col md={5} lg={3} className="my-auto">
          <p className="align-middle">{createdAt}</p>
        </Col>
      </Row>
    </ListGroupItem>
  )
}

NotificationListItem.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  createdAt: PropTypes.string
}

export default NotificationListItem
