/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import Router from 'next/router'
import CONSTANTS from '../../shared/CONSTANTS'
import Loading from '../common/Loading'

export default function privateRoute (WrappedComponent) {
  return class PrivateRoute extends Component {
    constructor (props) {
      super(props)
      this.state = {
        user: this.props.user
      }
      this._isMounted = false
    }

    static async getInitialProps ({ user }) {
      const initialProps = { user }

      if (WrappedComponent.getInitialProps) {
        const wrappedProps = await WrappedComponent.getInitialProps(
          initialProps
        )
        // make sure our `auth: AuthToken` is always returned
        return { ...wrappedProps, user }
      }
      return initialProps
    }

    componentDidMount () {
      this._isMounted = true
      const user = JSON.parse(
        localStorage.getItem(CONSTANTS.KEYS.CL_JUDGE_AUTH)
      )
      if (!this._isMounted) {
        return
      }
      this.setState({ user: user }, () => {
        const { setIsLoggedIn } = this.props
        if ((!user || !user.username || !user.access_token) && this._isMounted) {
          Router.replace('/')
        } else {
          const { loginTime } = user
          const currentTime = new Date().getTime() / 1000 // in seconds
          const tokenExpired =
            currentTime >= loginTime + CONSTANTS.OTHERS.JWT_EXPIRY_TIME
          if (tokenExpired) {
            localStorage.removeItem(CONSTANTS.KEYS.CL_JUDGE_AUTH)
            setIsLoggedIn(false)
            alert(
              `It has been more than ${
                CONSTANTS.OTHERS.JWT_EXPIRY_TIME / 3600
              } hours, since you have logged in. You need to login again to continue, for security reasons`
            )
            if (this._isMounted) {
              Router.replace('/')
            }
          }
        }
      })
    }

    componentWillUnmount () {
      this._isMounted = false
    }

    render () {
      const { user, ...propsWithoutAuth } = this.props
      if (!user || !this._isMounted) {
        return <Loading />
      }
      return <WrappedComponent user={this.state.user} {...propsWithoutAuth} />
    }
  }
}
