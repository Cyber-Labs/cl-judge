import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Form, Row, Col, Alert, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import * as yup from 'yup'
import SearchUsers from '../../common/SearchUsers'
import MiniLoader from '../../common/MiniLoader'
import baseUrl from '../../../shared/baseUrl'
import Link from 'next/link'

const createGroupSchema = yup.object({
  groupName: yup
    .string()
    .required('Group Name is required')
    .min(4, 'Group Name should have minimum 4 characters')
})

function createGroupForm (props) {
  const { user } = props
  const { access_token: accessToken } = user
  const router = useRouter()
  const [isConfidential, setIsConfidential] = useState(false)
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')

  const reqHeaders = new Headers()
  reqHeaders.append('access_token', accessToken)
  reqHeaders.append('Content-Type', 'application/json')

  const createGroup = (data) => {
    setIsLoading(true)
    const { groupName } = data
    const group = {
      group_name: groupName,
      confidential: isConfidential,
      members: members
    }
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(group)
    }
    fetch(`${baseUrl}/groups`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        console.log(success, error, results)
        if (success) {
          const { message, invalidUsernames, groupId } = results
          if (invalidUsernames && invalidUsernames.length) {
            setError(
              `Following usernames couldn't be added : ${invalidUsernames.join(
                ', '
              )}`
            )
          }
          setResult(message)
          router.push(`/manage/groups/${groupId}`)
        } else {
          setResult('')
          setError(error.sqlMessage || error)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setResult('')
        setError(error.message)
        setIsLoading(false)
      })
  }

  return (
    <div className="container mt-3">
      <div className="text-center">
        <h4>Create a new group</h4>
      </div>
      <br />
      <Formik
        validationSchema={createGroupSchema}
        onSubmit={createGroup}
        initialValues={{ groupName: '' }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="groupName">
              <Form.Row>
                <Form.Label column lg={2}>
                  Group Name
                </Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Name of group"
                    name="groupName"
                    value={values.groupName}
                    onChange={handleChange}
                    isValid={touched.groupName && !errors.groupName}
                    isInvalid={!!errors.groupName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.groupName}
                  </Form.Control.Feedback>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group as={Row} controlId="isConfidential">
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check
                  label="Confidential group (A confidential group is not visible to anyone other than group moderators and creator)"
                  checked={isConfidential}
                  onChange={(e) => {
                    setIsConfidential(e.target.checked)
                  }}
                />
              </Col>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={2}>
                    Add members
                </Form.Label>
                <Col>
                  <SearchUsers
                    selectedUsers={members}
                    setSelectedUsers={setMembers}
                    user={user}
                    limit={5}
                    alreadySelected={[]}
                  />
                </Col>
              </Form.Row>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="text-center">
              <Button type="submit" disabled={isLoading}>
                &nbsp;Create Group&nbsp;
                {isLoading && <MiniLoader />}
              </Button>
            </div>
            <br />
            <br />
            {result && <Alert variant="info">
              {result}
              <br/>
              Manage your groups &nbsp;
              <Link href='/manage/groups'>
              here
              </Link>
            </Alert>}
          </Form>
        )}
      </Formik>
      <br />
    </div>
  )
}

createGroupForm.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default createGroupForm
