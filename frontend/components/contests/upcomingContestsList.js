import React from 'react'
import PropTypes from 'prop-types'
import { Accordion, Card, Col, Row, Button } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import Loading from '../common/Loading'
import Error from '../common/Error'
import AccordionToggleIcon from './AccordionToggleIcon'
import CustomPagination from '../common/CustomPagination'
import Link from 'next/link'

function UpcomingContestsList (props) {
  const {
    error,
    loading,
    contests,
    pageCount,
    page,
    setPage
  } = props
  if (loading) {
    return <Loading/>
  } else if (error) {
    return <Error message={error}/>
  } else {
    return <div>
    <Accordion defaultActiveKey="0">
    { !contests.length && <p>No such contests available</p>}
    { contests.length &&
    contests.map(({ id, creator, name, start_time: startTime, end_time: endTime, about, rules, prizes }) => <Card key={id.toString()}>
      <Card.Header>
      <Row className="align-items-center">
        <Col md={8}>
          <h5 style={{ fontWeight: 'bold' }}>{name}</h5>
          <h6>
            Start time:&nbsp;
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            }).format(new Date(Date.parse(startTime)))}
          </h6>
          <h6>
            End time: &nbsp;
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            }).format(new Date(Date.parse(endTime)))}
          </h6>
          <p className="lead small">
                By &nbsp;
                <Link href={`/profile/${creator}`}>
                {creator}
                </Link>
          </p>
        </Col>
        <Col md={4} className="text-center">
          <Link href={`/contests/${id}`}>
            <Button variant="primary" className="btn-sm">
              <i className="fa fa-sign-in" />
              &nbsp; Participate
            </Button>
          </Link>
        </Col>
        <Col>
          <AccordionToggleIcon eventKey={id.toString()} />
        </Col>
      </Row>
      </Card.Header>
      <Accordion.Collapse eventKey={id.toString()}>
        <Card.Body>
        <h6 style={{ fontWeight: 'bold' }}>About</h6>
          <ReactMarkdown plugins={[gfm]} source={about} />
          { rules && <>
          <h6 style={{ fontWeight: 'bold' }}>Rules</h6>
          <ReactMarkdown plugins={[gfm]} source={rules} />
          </> }
          { prizes && <>
          <h6 style={{ fontWeight: 'bold' }}>Prizes</h6>
          <ReactMarkdown plugins={[gfm]} source={prizes} />
          </> }
        </Card.Body>
      </Accordion.Collapse>
    </Card>)}
  </Accordion>
  <br/>
  <CustomPagination
    maxPaginationOneSide={3}
    page={page}
    pageCount={pageCount}
    setPage={setPage}
  />
  </div>
  }
}

UpcomingContestsList.propTypes = {
  accessToken: PropTypes.string,
  error: PropTypes.string,
  loading: PropTypes.bool,
  contests: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    creator: PropTypes.string,
    name: PropTypes.string,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
    about: PropTypes.string,
    rules: PropTypes.string,
    prizes: PropTypes.string
  })),
  pageCount: PropTypes.number,
  page: PropTypes.number,
  setPage: PropTypes.func.isRequired
}

export default UpcomingContestsList
