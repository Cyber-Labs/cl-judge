import React from 'react'
import PropTypes from 'prop-types'
import Loading from '../components/common/Loading'

function AccountSettings (props) {
  const { user } = props
  if (!user) {
    return <Loading />
  }
  const { username } = user
  return (
    <div className="container mb-5 pb-5">
      <div className="row mt-5 ">
        <div className="col text-center">
          <div
            role="button"
            onClick={() => {
              console.log('upload image')
            }}
            onKeyDown={() => {
              console.log('upload image')
            }}
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            <img
              alt="User face"
              width="250px"
              height="250px"
              src="/images/profile.png"
            />
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col text-center">
          <a href={`/profile/${username}`}>
            <h4>{username}</h4>
          </a>
        </div>
      </div>
    </div>
  )
}

AccountSettings.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string
  })
}

export default AccountSettings
