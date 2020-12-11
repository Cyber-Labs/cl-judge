import React, { useEffect, useState } from 'react'
import { Col, Button } from 'react-bootstrap'
import Link from 'next/link'
import PropTypes from 'prop-types'
import baseUrl from '../../../shared/baseUrl'
import CONSTANTS from '../../../shared/CONSTANTS'
import Toast from '../../common/Toast'
import MemberConfirmModal from './memberConfirmModal'

function ManageMemberDetail (props) {
  const {
    username,
    fullName,
    admissionNumber,
    profileImage,
    email,
    course,
    department,
    selectedUsername,
    setSelectedUsername,
    setMembers,
    setModerators,
    accessToken,
    groupId,
    moderators,
    members
  } = props
  const [showToast, setShowToast] = useState(false)
  const [toastLevel, setToastLevel] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [removeModalVisible, setRemoveModalVisible] = useState(false)
  const [moderatorModalVisible, setModeratorModalVisible] = useState(false)
  useEffect(() => {
    if (showToast) {
      setTimeout(() => {
        setShowToast(false)
      }, 2000)
    }
  }, [showToast])
  return <React.Fragment>
    <Col
      xs={12}
      md={6}
      lg={4}
      onMouseEnter={() => {
        setSelectedUsername(username)
      }}
      onMouseLeave={() => {
        setSelectedUsername('')
      }}
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
      <h5 style={{ color: 'black' }} title={`Email: ${email}\n${CONSTANTS.COURSES[course]}\n${CONSTANTS.DEPARTMENTS[department]}\n`}>
      &nbsp;
        {fullName}
      </h5>
      <Link href={`/profile/${username}`} passHref>
        <h6 className="text-muted" style={{ cursor: 'pointer' }}>
        &nbsp;
          {username}
        </h6>
      </Link>
      <h6>
      &nbsp;
        {admissionNumber}
      </h6>
      <Button
        style={{
          padding: '.15rem .2rem',
          fontSize: '.700rem',
          lineHeight: '.3',
          borderRadius: '.1rem'
        }}
        onClick={() => {
          setModeratorModalVisible(true)
        }}
        className={`btn btn-success btn-sm  ${
        selectedUsername === username ? '' : 'd-none'
      }`}
      >
        <i className='fa fa-check' />
      &nbsp; Make moderator
      </Button>
    &nbsp;
      <Button
        style={{
          padding: '.15rem .2rem',
          fontSize: '.700rem',
          lineHeight: '.3',
          borderRadius: '.1rem'
        }}
        className={`btn btn-danger btn-sm ${
        selectedUsername === username ? '' : 'd-none'
      }`}
        onClick={() => {
          setRemoveModalVisible(true)
        }}
      >
        <i className='fa fa-times' />
      &nbsp; Remove
      </Button>
    </Col>
    <br />
    <MemberConfirmModal
      confirmationMessage={'Are you sure you want to remove the following member ?'}
      negative
      username={username}
      fullName={fullName}
      admissionNumber={admissionNumber}
      profileImage={profileImage}
      email={email}
      course={course}
      department={department}
      showModal={removeModalVisible}
      toggleModal={() => {
        setRemoveModalVisible(!removeModalVisible)
      }}
      onConfirm={() => {
        const requestedUsername = username
        const reqHeaders = new Headers()
        reqHeaders.append('access_token', accessToken)
        reqHeaders.append('Content-Type', 'application/json')
        const requestOptions = {
          method: 'DELETE',
          headers: reqHeaders,
          body: JSON.stringify({
            members: [requestedUsername]
          })
        }
        fetch(`${baseUrl}/groups/${groupId}/members`, requestOptions)
          .then((res) => res.json())
          .then((res) => {
            const { success, error, results } = res
            if (success) {
              const { invalidUsernames } = results
              if (invalidUsernames.some((username) => username === requestedUsername)) {
                throw new Error(`Couldn't remove ${requestedUsername}`)
              }
              const newMembers = members.filter((member) => member.username !== requestedUsername)
              setMembers(newMembers)
              setToastLevel('success')
              setToastMessage(`${requestedUsername} removed from group`)
            } else {
              setToastLevel('danger')
              setToastMessage(error)
            }
            setShowToast(true)
          })
          .catch((error) => {
            setToastLevel('danger')
            setToastMessage(error.message)
            setShowToast(true)
          })
        setRemoveModalVisible(false)
      }}
    />
    <MemberConfirmModal
      confirmationMessage={'Are you sure you want to promote the following member to moderator ?'}
      username={username}
      fullName={fullName}
      admissionNumber={admissionNumber}
      profileImage={profileImage}
      email={email}
      course={course}
      department={department}
      showModal={moderatorModalVisible}
      toggleModal={() => {
        setModeratorModalVisible(!moderatorModalVisible)
      }}
      onConfirm={() => {
        const requestedUsername = username
        const reqHeaders = new Headers()
        reqHeaders.append('access_token', accessToken)
        reqHeaders.append('Content-Type', 'application/json')
        const requestOptions = {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify({
            moderator_username: requestedUsername
          })
        }
        fetch(`${baseUrl}/groups/${groupId}/moderator`, requestOptions)
          .then((res) => res.json())
          .then((res) => {
            const { success, error } = res
            if (success) {
              const newModerators = [...moderators, members.filter((member) => member.username === requestedUsername)[0]]
              const newMembers = members.filter((member) => member.username !== requestedUsername)
              setModerators(newModerators)
              setMembers(newMembers)
              setToastLevel('success')
              setToastMessage(`${requestedUsername} promoted to moderator`)
              setShowToast(true)
            } else {
              setToastLevel('danger')
              setToastMessage(error)
              setShowToast(true)
            }
          })
          .catch((error) => {
            setToastLevel('danger')
            setToastMessage(error.message)
            setShowToast(true)
          })
        setModeratorModalVisible(false)
      }}
    />
    <Toast
      level={toastLevel}
      message={toastMessage}
      visible={showToast}
    />
  </React.Fragment>
}

ManageMemberDetail.propTypes = {
  username: PropTypes.string,
  fullName: PropTypes.string,
  admissionNumber: PropTypes.string,
  profileImage: PropTypes.string,
  email: PropTypes.string,
  course: PropTypes.number,
  department: PropTypes.number,
  selectedUsername: PropTypes.string,
  setSelectedUsername: PropTypes.func.isRequired,
  setModerators: PropTypes.func.isRequired,
  setMembers: PropTypes.func.isRequired,
  accessToken: PropTypes.string,
  groupId: PropTypes.number.isRequired,
  moderators: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string,
    full_name: PropTypes.string,
    admission_number: PropTypes.string,
    profile_img: PropTypes.string,
    email: PropTypes.string,
    course: PropTypes.number,
    department: PropTypes.number,
    is_group_moderator: PropTypes.number
  })),
  members: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string,
    full_name: PropTypes.string,
    admission_number: PropTypes.string,
    profile_img: PropTypes.string,
    email: PropTypes.string,
    course: PropTypes.number,
    department: PropTypes.number,
    is_group_moderator: PropTypes.number
  }))
}

export default ManageMemberDetail
