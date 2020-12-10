import React, { useState } from 'react'
import { Row, Col, InputGroup, FormControl, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import baseUrl from '../../../shared/baseUrl'
import MiniLoader from '../../../components/common/MiniLoader'
import ManageModeratorDetail from './manageModeratorDetail'
import ManageMemberDetail from './manageMemberDetail'
import MemberDetail from './memberDetail'
import InviteMemberModal from './inviteMembersModal'
import AddBranchModal from './addBranchModal'
import RemoveBranchModal from './removeBranchModal'
import DeleteGroupModal from './deleteGroupModal'

function GroupDetail (props) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [groupNameLoading, setGroupNameLoading] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState('')
  const
    {
      groupId,
      groupName,
      members,
      moderators,
      confidential,
      creator,
      setGroupName,
      user,
      setMembers,
      setModerators,
      isModerator
    } = props
  const { access_token: accessToken, username } = user
  const [showInviteMembersModal, setShowInviteMemberModal] = useState(false)
  const [showAddBranchModal, setShowAddBranchModal] = useState(false)
  const [showRemoveBranchModal, setShowRemoveBranchModal] = useState(false)
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState(groupName)
  const changeGroupName = () => {
    if (newGroupName.length < 4) {
      return alert('Enter a valid group name, with at least 4 characters')
    }
    setGroupNameLoading(true)
    var reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify({
        new_group_name: newGroupName
      })
    }
    fetch(`${baseUrl}/groups/${groupId}/update`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success } = res
        if (success) {
          setGroupName(newGroupName)
        } else {
          alert('Couldn\'t modify group name. Try Again!')
        }
        setGroupNameLoading(false)
        setIsEditOpen(false)
      })
      .catch(() => {
        alert('Couldn\'t modify group name. Try Again!')
        setGroupNameLoading(false)
        setIsEditOpen(false)
      })
  }

  if (!isModerator) {
    return <div className='container mt-2'>
      <h2 style={{ display: 'inline' }}>
        {groupName}
        {confidential ? <sup style={{ fontSize: '18px' }}>&nbsp;<i title="Confidential" className="fa fa-lock"/></sup> : ''}
        &nbsp;
      </h2>
      <hr />
      <br />
      <h5 style={{ color: 'black' }}> Moderators : {moderators.length}</h5>
      <Row>
        {moderators.map(({
          username,
          full_name: fullName,
          profile_img: profileImage,
          email,
          course,
          department
        }) => {
          return (
            <MemberDetail
              key={username}
              username={username}
              fullName={fullName}
              profileImage={profileImage}
              course={course}
              department={department}
            />
          )
        })}
      </Row>
      <br />
      <h5 style={{ color: 'black' }} id='members'>
        {' '}
      Other Members :&nbsp;
        {members.length}
      </h5>
      <br />
      <Row>
        {members.map(({
          username,
          full_name: fullName,
          profile_img: profileImage,
          email,
          course,
          department
        }) => {
          return (
            <MemberDetail
              key={username}
              username={username}
              fullName={fullName}
              profileImage={profileImage}
              course={course}
              department={department}
            />
          )
        })}
      </Row>
    </div>
  }

  return <div className='container mt-2'>
    {isEditOpen ? (
      <Row>
        <Col md={5}>
          <InputGroup>
            <FormControl
              type='text'
              name='contestName'
              id='contestName'
              placeholder={groupName}
              defaultValue={groupName}
              style={{ display: 'inline' }}
              onChange={e => setNewGroupName(e.target.value)}
            />
          &nbsp;
            <br />
            <h6
              onClick={changeGroupName}
              style={{
                display: 'inline',
                color: 'blue',
                paddingTop: '20px',
                cursor: 'pointer'
              }}
              onKeyDown={changeGroupName}
              role='button'
            >
              <u>Save</u>
              {groupNameLoading ? <MiniLoader/> : ''}
            </h6>
          </InputGroup>
        </Col>
      </Row>
    ) : (
      <>
        <h2 style={{ display: 'inline' }}>
          {groupName}
          {confidential ? <sup style={{ fontSize: '18px' }}>&nbsp;<i title="Confidential" className="fa fa-lock"/></sup> : ''}
        &nbsp;
        </h2>
        <h6
          onClick={() => {
            setIsEditOpen(!isEditOpen)
          }}
          style={{ display: 'inline', color: 'blue', cursor: 'pointer' }}
          onKeyDown={() => {
            setIsEditOpen(!isEditOpen)
          }}
          role='button'
        >
          <u>Edit</u>
        </h6>
        &nbsp;&nbsp;&nbsp;
        {
          creator === username &&
          <h4
            style={{ display: 'inline', cursor: 'pointer' }}
            role='button'
            onClick={() => {
              setShowDeleteGroupModal(true)
            }}>
            <i title="Delete group" className="fa fa-trash"></i>
          </h4>
        }
      </>
    )}
    <hr />
    <br />
    <h5 style={{ color: 'black' }}> Moderators : {moderators.length}</h5>
    <Row>
      {moderators.map(({
        username,
        full_name: fullName,
        admission_number: admissionNumber,
        profile_img: profileImage,
        email,
        course,
        department
      }) => {
        return (
          <ManageModeratorDetail
            key={username}
            username={username}
            fullName={fullName}
            admissionNumber={admissionNumber}
            profileImage={profileImage}
            email={email}
            course={course}
            department={department}
            selectedUsername={selectedUsername}
            setSelectedUsername={setSelectedUsername}
            creator={creator}
            setModerators={setModerators}
            setMembers={setMembers}
            groupId={groupId}
            accessToken={accessToken}
            moderators={moderators}
            members={members}
          />
        )
      })}
    </Row>
    <br />
    <h5 style={{ color: 'black' }} id='members'>
      {' '}
      Other Members :&nbsp;
      {members.length}
      &nbsp;&nbsp;
      <Button
        className='btn btn-sm btn-success'
        onClick={() => { setShowInviteMemberModal(true) }}
      >
        <i className='fa fa-user-plus' />
        &nbsp; Add members
      </Button>
      &nbsp;
      <Button
        className='btn btn-sm btn-info'
        onClick={() => { setShowAddBranchModal(true) }}
      >
        <i className='fa fa-plus' />
        &nbsp; Add a branch
      </Button>
      &nbsp;
      <Button
        className='btn btn-sm btn-danger'
        onClick={() => { setShowRemoveBranchModal(true) }}
      >
        <i className='fa fa-minus' />
        &nbsp; Remove a branch
      </Button>
    </h5>
    <br />
    <Row>
      {members.map(({
        username,
        full_name: fullName,
        admission_number: admissionNumber,
        profile_img: profileImage,
        email,
        course,
        department
      }) => {
        return (
          <ManageMemberDetail
            key={username}
            username={username}
            fullName={fullName}
            admissionNumber={admissionNumber}
            profileImage={profileImage}
            email={email}
            course={course}
            department={department}
            selectedUsername={selectedUsername}
            setSelectedUsername={setSelectedUsername}
            setModerators={setModerators}
            setMembers={setMembers}
            accessToken={accessToken}
            groupId={groupId}
            moderators={moderators}
            members={members}
          />
        )
      })}
    </Row>
    <InviteMemberModal
      user={user}
      groupId={groupId}
      showModal={showInviteMembersModal}
      toggleModal={() => {
        setShowInviteMemberModal(!showInviteMembersModal)
      }}
      memberUsernames={members.map(member => member.username)}
      moderatorUsernames={moderators.map(member => member.username)}
    />
    <AddBranchModal
      accessToken={accessToken}
      groupId={groupId}
      showModal={showAddBranchModal}
      toggleModal={() => {
        setShowAddBranchModal(!showAddBranchModal)
      }}
    />
    <RemoveBranchModal
      accessToken={accessToken}
      groupId={groupId}
      showModal={showRemoveBranchModal}
      toggleModal={() => {
        setShowRemoveBranchModal(!showRemoveBranchModal)
      }}
    />
    <DeleteGroupModal
      accessToken={accessToken}
      groupId={groupId}
      showModal={showDeleteGroupModal}
      toggleModal={() => {
        setShowDeleteGroupModal(!showDeleteGroupModal)
      }}
      groupName={groupName}
    />
  </div>
}

GroupDetail.propTypes = {
  groupId: PropTypes.number.isRequired,
  groupName: PropTypes.string,
  confidential: PropTypes.number,
  creator: PropTypes.string,
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
  })),
  setGroupName: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  }),
  setModerators: PropTypes.func.isRequired,
  setMembers: PropTypes.func.isRequired,
  isModerator: PropTypes.bool
}

export default GroupDetail
