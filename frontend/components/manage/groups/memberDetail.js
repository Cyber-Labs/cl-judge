import React from 'react'
import { Col } from 'react-bootstrap'
import Link from 'next/link'
import PropTypes from 'prop-types'
import CONSTANTS from '../../../shared/CONSTANTS'
function MemberDetail (props) {
  const {
    username,
    fullName,
    profileImage,
    course,
    department
  } = props
  return <React.Fragment>
    <Col
      xs={12}
      md={6}
      lg={4}
    >
      <img
        src={profileImage || '/images/profile.png'}
        id={username}
        style={{
          width: '100px',
          float: 'left',
          paddingBottom: '10px',
          paddingRight: '10px'
        }}
        alt={username}
      />
      <h5 style={{ color: 'black' }} title={`${CONSTANTS.COURSES[course]}\n${CONSTANTS.DEPARTMENTS[department]}\n`}>
      &nbsp;
        {fullName}
      </h5>
      <Link href={`/profile/${username}`} passHref>
        <h6 className="text-muted" style={{ cursor: 'pointer' }}>
        &nbsp;
          {username}
        </h6>
      </Link>
    </Col>
    <br />
  </React.Fragment>
}

MemberDetail.propTypes = {
  username: PropTypes.string,
  fullName: PropTypes.string,
  admissionNumber: PropTypes.string,
  profileImage: PropTypes.string,
  course: PropTypes.number,
  department: PropTypes.number
}

export default MemberDetail
