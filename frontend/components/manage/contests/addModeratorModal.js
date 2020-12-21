import React, { useState, useEffect } from 'react'
import { Modal, Button, Table, Alert, InputGroup, FormControl } from 'react-bootstrap'
import PropTypes from 'prop-types'
import MiniLoader from '../../common/MiniLoader'
import baseUrl from '../../../shared/baseUrl'
import Link from 'next/link'

const limit = 6

function AddModeratorModal (props) {
  const {
    showModal,
    toggleModal,
    contestId,
    alreadyModerators,
    setAlreadyModerators,
    accessToken
  } = props
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUsername, setSelectedUsername] = useState(0)
  const [keyword, setKeyword] = useState('')

  const remainingUsers = users.filter(({ username }) => !alreadyModerators.some(({ username: moderatorUsername }) => moderatorUsername === username))

  useEffect(() => {
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    if (keyword) {
      const requestOptions = {
        method: 'GET',
        headers: reqHeaders
      }
      fetch(
        `${baseUrl}/search/users?keyword=${keyword}&limit=${limit}`,
        requestOptions
      )
        .then((res) => res.json())
        .then((res) => {
          const { success, error, results } = res
          if (success) {
            setError('')
            setUsers(results)
          } else {
            setUsers([])
            setError(error.message || error.sqlMessage || error)
          }
        })
        .catch((error) => {
          setUsers([])
          setError(error.message)
        })
    } else {
      setUsers([])
    }
  }, [keyword])

  const handleSearch = (e) => {
    setKeyword(e.target.value)
  }

  const makeModerator = (username, fullName, profileImg) => {
    setSelectedUsername(username)
    setIsLoading(true)
    setError('')
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    reqHeaders.append('Content-Type', 'application/json')
    const body = {
      moderator: username
    }
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(body)
    }
    fetch(`${baseUrl}/contests/${contestId}/moderator`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error } = res
        if (success) {
          const newAlreadyModerators = [...alreadyModerators, { username, full_name: fullName, profile_img: profileImg }]
          setAlreadyModerators(newAlreadyModerators)
        } else {
          setError(error.sqlMessage || error)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
      })
  }

  return <Modal size={'lg'} show={showModal} onHide={toggleModal}>
  <Modal.Body>
    <Modal.Header closeButton>
      <Modal.Title>
        Add moderators for contest
      </Modal.Title>
    </Modal.Header>
    <br/>
    <div className="container">
    <InputGroup style={{ marginTop: '10px' }}>
        <InputGroup.Prepend>
          <InputGroup.Text id="search-addon">
            <span className="fa fa-search" />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          style={{ height: '50%' }}
          type="text"
          placeholder="Search by username or admission number"
          className="mr-sm-2"
          value={keyword}
          onChange={handleSearch}
        />
      </InputGroup>
      {error && <Alert variant="danger">{error}</Alert>}
      {
        remainingUsers.length
          ? <Table striped bordered hover responsive="md">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
            <th>Admission Number</th>
            <th>Full Name</th>
            <th>Make moderator</th>
          </tr>
        </thead>
        <tbody>
          {remainingUsers.map(({ username, admission_number: admissionNumber, full_name: fullName, profile_img: profileImg }, i) => <tr key={username}>
            <td>{i + 1}</td>
            <td>
              <Link href={`/profile/${username}`} style={{ color: 'black' }}>
              {username}
              </Link>
            </td>
            <td>
              {admissionNumber}
            </td>
            <td>
              {fullName}
            </td>
            <td className='text-center'>
              <Button
                variant='success'
                disabled={isLoading && selectedUsername === username}
                onClick={() => {
                  makeModerator(username, fullName, profileImg)
                }}>
                <i className="fa fa-plus-circle"/> Add
                {isLoading && selectedUsername === username && <MiniLoader />}
              </Button>
            </td>
          </tr>)}
        </tbody>
      </Table>
          : ''
      }
      {error && <Alert variant="danger">{error}</Alert>}
    </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant={'danger'} onClick={toggleModal}>
    Close
    </Button>
  </Modal.Footer>
</Modal>
}

AddModeratorModal.propTypes = {
  toggleModal: PropTypes.func.isRequired,
  showModal: PropTypes.bool,
  contestId: PropTypes.number.isRequired,
  accessToken: PropTypes.string,
  alreadyModerators: PropTypes.arrayOf(PropTypes.shape({
    username: PropTypes.string
  })),
  setAlreadyModerators: PropTypes.func.isRequired
}

export default AddModeratorModal
