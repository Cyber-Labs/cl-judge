import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Form, Button, Alert } from 'react-bootstrap'
import baseUrl from '../../shared/baseUrl'

function VerifyNewEmail () {
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [otpResult, setOtpResult] = useState(false)

  const router = useRouter()
  const { username, email } = router.query

  return (
    <div
      className="container gray-bg mt-4 ml-auto"
      style={{ width: '500px', padding: '30px', borderRadius: '10px' }}
    >
      <h4 align="center">Email Verification</h4>
      <br />
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          const urlencoded = new URLSearchParams()
          urlencoded.append('otp', otp)
          urlencoded.append('email', email)
          urlencoded.append('username', username)

          const requestOptions = {
            method: 'POST',
            body: urlencoded
          }

          fetch(`${baseUrl}/auth/verify_new_email`, requestOptions)
            .then((res) => res.json())
            .then((res) => {
              const { success, error } = res
              if (success) {
                setOtpResult(true)
                setOtpError('')
              } else {
                if (error.sqlMessage) setOtpError(error.sqlMessage)
                else setOtpError(error)
                setOtpResult(false)
              }
            })
            .catch((error) => {
              setOtpError(error.message)
              setOtpResult(false)
            })
        }}
      >
        <Form.Group controlId="otp">
          <Form.Control
            type="text"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value)
            }}
            name="otp"
          />
        </Form.Group>
        {otpError && <Alert variant="danger">{otpError}</Alert>}
        <br />
        <div className="text-center">
          <Button type="submit">Verify</Button>
        </div>
        <br />
        <br />
        {otpResult && (
          <Alert variant="success">Email verified successfully.</Alert>
        )}
      </Form>
    </div>
  )
}

export default VerifyNewEmail
