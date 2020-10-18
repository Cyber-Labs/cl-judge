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
