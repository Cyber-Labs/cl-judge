import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Loading from '../../components/common/Loading'
import baseUrl from '../../shared/baseUrl'
import Error from '../../components/common/Error'
import UpdateUserForm from '../../components/user/updateUserForm'
import UploadProfileImage from '../../components/user/uploadProfileImage'
import withPrivateRoute from '../../components/utils/withPrivateRoute'

function EditProfile (props) {
  const { user } = props

  if (!user) {
    return <div/>
  }

  const [loading, setLoading] = useState(true)
  const [getUserError, setGetUserError] = useState('')
  const [userInfo, setUserInfo] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(0)
  const [selectedDepartment, setSelectedDepartment] = useState(0)
  const { username, access_token: accessToken } = user

  const reqHeaders = new Headers()
  reqHeaders.append('access_token', accessToken)

  useEffect(() => {
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/user`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          setGetUserError('')
          setUserInfo(results)
          const { course, department } = results
          setSelectedCourse(course)
          setSelectedDepartment(department)
        } else {
          setGetUserError(error)
        }
        setLoading(false)
      })
      .catch((error) => {
        setGetUserError(error.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <Loading />
  } else if (getUserError) {
    return <Error message={getUserError} />
  }

  return (
    <div className="container mb-5 pb-5">
      <UploadProfileImage
        accessToken={accessToken}
        userInfo={userInfo}
        setUserInfo={setUserInfo}
      />
      <div className="row mt-2">
        <div className="col text-center">
          <a href={`/profile/${username}`}>
            <h4>{username}</h4>
          </a>
        </div>
      </div>
      <div className="row mt-2">
        <UpdateUserForm
          userInfo={userInfo}
          accessToken={accessToken}
          selectedCourse={selectedCourse}
          selectedDepartment={selectedDepartment}
          setSelectedCourse={setSelectedCourse}
          setSelectedDepartment={setSelectedDepartment}
        />
      </div>
    </div>
  )
}

EditProfile.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string
  })
}

export default withPrivateRoute(EditProfile)
