import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Alert } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import baseUrl from '../../shared/baseUrl'
import withPrivateRoute from '../../components/utils/withPrivateRoute'

const changePasswordSchema = yup.object({
  oldPassword: yup.string().required('Current Password is required'),
  password: yup
    .string()
    .min(8, 'Should consist of 8 or more characters')
    .required('Password is required'),
  confirmPassword: yup.string().required('Re-enter the above password again')
})

function ChangePassword (props) {
  const [errorMessage, setErrorMessage] = useState('')
  const [resultMessage, setResultMessage] = useState(false)
  const { user } = props
  const { username, access_token: accessToken } = user
  var reqHeaders = new Headers()
  reqHeaders.append('access_token', accessToken)

  return (
    <div
      className="container gray-bg mt-4 ml-auto"
      style={{ width: '500px', padding: '30px', borderRadius: '10px' }}
    >
      <h4 align="center">Change Password</h4>
      <br />
      <Formik
        validationSchema={changePasswordSchema}
        onSubmit={(data) => {
          const { oldPassword, password, confirmPassword } = data
          if (password !== confirmPassword) {
            setResultMessage(false)
            setErrorMessage("New password and re-entered password don't match")
            return
          }
          var urlencoded = new URLSearchParams()
          urlencoded.append('username', username)
          urlencoded.append('password', oldPassword)
          urlencoded.append('new_password', password)
          var requestOptions = {
            method: 'POST',
            body: urlencoded,
            headers: reqHeaders
          }

          fetch(`${baseUrl}/user/update_password`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
              const { success, error } = res
              if (success) {
                setResultMessage(true)
                setErrorMessage('')
              } else {
                if (error.sqlMessage) setErrorMessage(error.sqlMessage)
                else setErrorMessage(error)
                setResultMessage(false)
              }
            })
            .catch((error) => {
              setErrorMessage(error.message)
              setResultMessage(false)
            })
        }}
        initialValues={{
          username: '',
          password: '',
          confirmPassword: '',
          oldPassword: ''
        }}
      >
        {({ handleSubmit, handleChange, values, touched, errors }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="oldPassword">
              <Form.Label>Current password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Current Password"
                name="oldPassword"
                value={values.oldPassword}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>New password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !errors.password}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Re-enter new password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                isValid={touched.confirmPassword && !errors.confirmPassword}
                isInvalid={!!errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </Form.Group>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <br />
            <div className="text-center">
              <Button type="submit">Change Password</Button>
            </div>
            <br />
            <br />
            {resultMessage && (
              <Alert variant="success">Password changed successfully.</Alert>
            )}
          </Form>
        )}
      </Formik>
    </div>
  )
}

ChangePassword.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string
  })
}

export default withPrivateRoute(ChangePassword)
