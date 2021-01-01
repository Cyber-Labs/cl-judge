import React from 'react'
import { ListGroupItem, Row, Col, Button } from 'react-bootstrap'
import Link from 'next/link'
import PropTypes from 'prop-types'

function ContestListItem (props) {
  const { id, contestName, participantCount, creator, isModerator, startTime, endTime } = props
  return (
    <ListGroupItem
      style={{ borderRadius: '5px' }}
    >
      <Row>
        <Col lg={2} className='text-center'>
          {contestName}
        </Col>
        <Col lg={4} className="text-center">
              {`${new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: '2-digit',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  }).format(
                    new Date(Date.parse(startTime))
                  )} - ${new Intl.DateTimeFormat('en-US', {
                    month: 'short',
                    day: '2-digit',
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                  }).format(new Date(Date.parse(endTime)))}`}
            </Col>
        <Col lg={2} className='text-center'>
              Total Participants : &nbsp;
          {participantCount}
        </Col>
        <Col lg={2} className='text-center'>
          <b>Creator:</b>
              &nbsp;
          <Link
            href={`/profile/${creator}`}
          >
            {creator}
          </Link>
        </Col>
        <Col lg={2} className='text-center'>
          <Link href={isModerator ? `/manage/contests/${id}` : `/contests/${id}`} passHref>
            <Button variant='info'>
              <i className='fa fa-info-circle' />
                  &nbsp; View
            </Button>
          </Link>
        </Col>
      </Row>
    </ListGroupItem>
  )
}

ContestListItem.propTypes = {
  contestName: PropTypes.string,
  participantCount: PropTypes.number,
  id: PropTypes.number,
  confidential: PropTypes.number,
  creator: PropTypes.string,
  isModerator: PropTypes.bool,
  startTime: PropTypes.string,
  endTime: PropTypes.string
}

export default ContestListItem
