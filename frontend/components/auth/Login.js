import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import PropTypes from 'prop-types'
import CONSTANTS from '../../shared/CONSTANTS'
import baseUrl from '../../shared/baseUrl'
import MiniLoader from '../common/MiniLoader'

const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
})

function Login (props) {
  const { setIsLoggedIn, setUser } = props
  const router = useRouter()
  const [loginError, setLoginError] = useState('')
  const [loginProgress, setLoginProgress] = useState(false)
  return (
    <Formik
      validationSchema={loginSchema}
      onSubmit={(data) => {
        setLoginProgress(true)
        const { username, password } = data
        var urlencoded = new URLSearchParams()
        urlencoded.append('username', username)
        urlencoded.append('password', password)

        var requestOptions = {
          method: 'POST',
          body: urlencoded
        }

        fetch(`${baseUrl}/auth/login`, requestOptions)
          .then((res) => res.json())
          .then((res) => {
            const { success, error, results } = res
            if (!success) {
              if (error.sqlMessage) setLoginError(error.sqlMessage)
              else setLoginError(error)
            } else {
              results.loginTime = new Date().getTime() / 1000 // login time in seconds
              localStorage.setItem(
                CONSTANTS.KEYS.CL_JUDGE_AUTH,
                JSON.stringify(results)
              )
              setIsLoggedIn(true)
              setUser(results)
              router.push('/user/edit-profile')
            }
            setLoginProgress(false)
          })
          .catch((error) => {
            setLoginError(error.message)
            setLoginProgress(false)
          })
      }}
      initialValues={{
        username: '',
        password: ''
      }}
    >
      {({ handleSubmit, handleChange, values, touched, errors }) => (
        <Form onSubmit={handleSubmit}>
          <br />
          <h4>Login to CL Judge</h4>
          <br />
          <Form.Group controlId="loginUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your OJ username"
              name="username"
              value={values.username}
              onChange={handleChange}
              isValid={touched.username && !errors.username}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="loginPassword">
            <Form.Label>Password</Form.Label>
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
          {loginError && <Alert variant="danger">{loginError}</Alert>}
          <Button variant="primary" type="submit">
            Login &nbsp;
            {loginProgress && <MiniLoader />}
          </Button>
        </Form>
      )}
    </Formik>
  )
}

Login.propTypes = {
  setIsLoggedIn: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired
}

export default Login
