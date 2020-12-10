import React from 'react'
import { ListGroupItem, Row, Col, Button } from 'react-bootstrap'
import Link from 'next/link'
import PropTypes from 'prop-types'

function GroupListItem (props) {
  const { id, groupName, memberCount, confidential, creator, isModerator } = props
  return (
    <ListGroupItem
      style={{
        backgroundColor: 'whitesmoke'
      }}
    >
      <Row>
        <Col lg={2} className='text-center'>
          {groupName}
          {
            confidential ? <>&nbsp;<span title="Confidential Group" className="fa fa-lock"/></> : ''
          }
        </Col>
        <Col lg={5} className='text-center'>
              No. of Participants : &nbsp;
          {memberCount}
        </Col>
        <Col lg={3} className='text-center'>
          <b>Created By :</b>
              &nbsp;
          <Link
            href={`/profile/${creator}`}
          >
            {creator}
          </Link>
        </Col>
        <Col lg={2} className='text-center'>
          <Link href={isModerator ? `/manage/groups/${id}` : `/groups/${id}`} passHref>
            <Button color='info'>
              <i className='fa fa-eye' />
                  &nbsp; View
            </Button>
          </Link>
        </Col>
      </Row>
    </ListGroupItem>
  )
}

GroupListItem.propTypes = {
  groupName: PropTypes.string,
  memberCount: PropTypes.number,
  id: PropTypes.number,
  confidential: PropTypes.number,
  creator: PropTypes.string,
  isModerator: PropTypes.bool
}

export default GroupListItem
