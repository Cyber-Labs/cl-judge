import React, { useEffect, useState } from 'react'
import { Form, Row, Col, Alert, Button } from 'react-bootstrap'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import 'react-markdown-editor-lite/lib/index.css'
import gfm from 'remark-gfm'
import { Formik } from 'formik'
import * as yup from 'yup'
import SearchUsers from '../../common/SearchUsers'
import MiniLoader from '../../common/MiniLoader'
import baseUrl from '../../../shared/baseUrl'

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
})

const createNotificationSchema = yup.object({
  heading: yup
    .string()
    .required('Heading is required')
    .min(3, 'Heading should have minimum 3 characters')
})

function createNotificationForm (props) {
  const { user } = props
  const { access_token: accessToken } = user
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [targetUsernames, setTargetUsernames] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState('')
  const handleEditorChange = ({ html, text }) => {
    if (text.length > 250) {
      return
    }
    setDescription(text)
  }
  useEffect(() => {
    if (!isPublic) {
      setTargetUsernames([])
    }
  }, [isPublic])

  const reqHeaders = new Headers()
  reqHeaders.append('access_token', accessToken)
  reqHeaders.append('Content-Type', 'application/json')

  const createNotification = (data) => {
    setIsLoading(true)
    const { heading } = data
    const notification = {
      heading: heading,
      description: description,
      public: isPublic,
      target_usernames: targetUsernames
    }
    const requestOptions = {
      method: 'POST',
      headers: reqHeaders,
      body: JSON.stringify(notification)
    }
    fetch(`${baseUrl}/notifications`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          const { message, invalidUsernames } = results
          if (invalidUsernames && invalidUsernames.length) {
            setError(
              `Notification couldn't be sent to the following usernames : ${invalidUsernames.join(
                ', '
              )}`
            )
          }
          setResult(message)
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
        <h4>Create a new notification</h4>
      </div>
      <br />
      <Formik
        validationSchema={createNotificationSchema}
        onSubmit={createNotification}
        initialValues={{ heading: '' }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group controlId="heading">
              <Form.Row>
                <Form.Label column lg={2}>
                  Heading
                </Form.Label>
                <Col>
                  <Form.Control
                    type="text"
                    placeholder="Heading of notification"
                    name="heading"
                    value={values.heading}
                    onChange={handleChange}
                    isValid={touched.heading && !errors.heading}
                    isInvalid={!!errors.heading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.heading}
                  </Form.Control.Feedback>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Form.Label column lg={2}>
                  Description
                </Form.Label>
                <Col>
                  <MdEditor
                    name="description"
                    style={{ height: '200px' }}
                    renderHTML={(text) => (
                      <ReactMarkdown plugins={[gfm]} source={text} />
                    )}
                    onChange={handleEditorChange}
                    placeholder="Write a short description (Max 250 characters) . Preview will be visible on right side"
                    value={description}
                    config={{
                      linkUrl: 'https://www.google.co.in/',
                      shortcuts: true
                    }}
                    plugins={[
                      'font-bold',
                      'font-italic',
                      'link',
                      'block-wrap',
                      'logger',
                      'mode-toggle'
                    ]}
                  />
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group as={Row} controlId="public">
              <Col sm={{ span: 10, offset: 2 }}>
                <Form.Check
                  label="Public notification (to be shown to all the users of CL Judge)"
                  checked={isPublic}
                  onChange={(e) => {
                    setIsPublic(e.target.checked)
                  }}
                />
              </Col>
            </Form.Group>
            {!isPublic && (
              <Form.Group>
                <Form.Row>
                  <Form.Label column lg={2}>
                    Target Users
                  </Form.Label>
                  <Col>
                    <SearchUsers
                      selectedUsers={targetUsernames}
                      setSelectedUsers={setTargetUsernames}
                      user={user}
                      limit={5}
                      alreadySelected={[]}
                    />
                  </Col>
                </Form.Row>
              </Form.Group>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="text-center">
              <Button type="submit" disabled={isLoading}>
                &nbsp;Create Notification&nbsp;
                {isLoading && <MiniLoader />}
              </Button>
            </div>
            <br />
            <br />
            {result && <Alert variant="info">{result}</Alert>}
          </Form>
        )}
      </Formik>
      <br />
    </div>
  )
}

createNotificationForm.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default createNotificationForm
