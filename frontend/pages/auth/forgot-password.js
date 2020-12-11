import React, { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import baseUrl from '../../shared/baseUrl'

function ForgotPassword () {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailResult, setEmailResult] = useState('')
  return (
    <div
      className="container gray-bg mt-4 ml-auto"
      style={{ width: '500px', padding: '30px', borderRadius: '10px' }}
    >
      <h4 align="center">Forgot Password ?</h4>
      <br />
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          const urlencoded = new URLSearchParams()
          urlencoded.append('email', email)

          const requestOptions = {
            method: 'POST',
            body: urlencoded
          }

          fetch(`${baseUrl}/auth/forgot_password`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
              const { success, error, results } = res
              if (success) {
                setEmailResult(results)
                setEmailError('')
              } else {
                if (error.sqlMessage) setEmailError(error.sqlMessage)
                else setEmailError(error)
                setEmailResult('')
              }
            })
            .catch((error) => {
              setEmailError(error.message)
              setEmailResult('')
            })
        }}
      >
        <Form.Group controlId="email">
          <Form.Control
            type="email"
            placeholder="Enter your @iitism.ac.in email ID"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            name="email"
          />
        </Form.Group>
        {emailError && <Alert variant="danger">{emailError}</Alert>}
        {emailResult && <Alert variant="info">{emailResult}</Alert>}
        <br />
        <div className="text-center">
          <Button type="submit">Change Password</Button>
        </div>
      </Form>
    </div>
  )
}

export default ForgotPassword
