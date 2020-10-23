import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  InputGroup,
  FormControl,
  Button,
  Alert,
  ListGroup,
  Row,
  Col,
  Badge
} from 'react-bootstrap'
import Link from 'next/link'
import baseUrl from '../../shared/baseUrl'

function SearchUsers (props) {
  const { selectedUsers, setSelectedUsers, user, limit } = props
  const { access_token: accessToken, username } = user
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [error, setError] = useState('')

  var reqHeaders = new Headers()
  reqHeaders.append('access_token', accessToken)

  useEffect(() => {
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
            const newSearchResults = results.filter(
              (userResult) =>
                userResult.username !== username &&
                Array.prototype.indexOf.call(
                  selectedUsers,
                  userResult.username
                ) === -1
            )
            setError('')
            setSearchResults(newSearchResults)
          } else {
            setSearchResults([])
            setError(error.message || error.sqlMessage || error)
          }
        })
        .catch((error) => {
          setSearchResults([])
          setError(error.message)
        })
    } else {
      setSearchResults([])
    }
  }, [keyword])
  const handleSearch = (e) => {
    setKeyword(e.target.value)
  }
  return (
    <>
      <Row>
        {selectedUsers &&
          selectedUsers.map((selectedUser, i) => (
            <Col
              xs={6}
              md={2}
              lg={1}
              key={selectedUser.username + i.toString()}
            >
              <Badge variant="dark">
                <Link href={`/profile/${selectedUser}`} passHref>
                  <a style={{ color: 'white' }} target="_blank">
                    {selectedUser}
                  </a>
                </Link>
                &nbsp;
                <i
                  className="fa fa-times"
                  aria-hidden="true"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    const newSelectedUsers = [...selectedUsers]
                    newSelectedUsers.splice(i, 1)
                    setSelectedUsers(newSelectedUsers)
                  }}
                />
              </Badge>
            </Col>
          ))}
      </Row>
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
      <ListGroup>
        {searchResults &&
          searchResults.map((userResult, i) => (
            <ListGroup.Item key={userResult.username}>
              <Row>
                <Col xs={8}>
                  <Link href={`/profile/${userResult.username}`} passHref>
                    <a target="_blank">{userResult.username}</a>
                  </Link>{' '}
                  &nbsp; - &nbsp; {userResult.admission_number}
                </Col>
                <Col xs={4}>
                  <Button
                    onClick={() => {
                      const newSelectedUsers = [...selectedUsers]
                      Array.prototype.push.call(
                        newSelectedUsers,
                        userResult.username
                      )
                      const newSearchResults = [...searchResults]
                      newSearchResults.splice(i, 1)
                      setSelectedUsers(newSelectedUsers)
                      setSearchResults(newSearchResults)
                    }}
                  >
                    Add
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
      </ListGroup>
      <br />
    </>
  )
}

SearchUsers.propTypes = {
  selectedUsers: PropTypes.arrayOf(PropTypes.string),
  setSelectedUsers: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  }),
  limit: PropTypes.number.isRequired
}

export default SearchUsers
