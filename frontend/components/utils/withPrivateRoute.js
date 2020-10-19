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
      const user = JSON.parse(
        localStorage.getItem(CONSTANTS.KEYS.CL_JUDGE_AUTH)
      )
      this.setState({ user: user }, () => {
        if (!user || !user.username || !user.access_token) {
          Router.replace('/')
        } else {
          const { loginTime } = user
          const currentTime = new Date().getTime() / 1000 // in seconds
          const tokenExpired =
            currentTime >= loginTime + CONSTANTS.OTHERS.JWT_EXPIRY_TIME
          if (tokenExpired) {
            localStorage.removeItem(CONSTANTS.KEYS.CL_JUDGE_AUTH)
            Router.replace('/')
            alert(
              `It has been more than ${
                CONSTANTS.OTHERS.JWT_EXPIRY_TIME / 3600
              } hours, since you have logged in. You need to login again to continue, for security reasons`
            )
          }
        }
      })
    }

    render () {
      const { user, ...propsWithoutAuth } = this.props
      if (!user) {
        return <Loading />
      }
      return <WrappedComponent user={this.state.user} {...propsWithoutAuth} />
    }
  }
}
