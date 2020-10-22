/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import '../styles/global.css'
import Footer from '../components/common/Footer'
import Header from '../components/common/Header'
import CONSTANTS from '../shared/CONSTANTS'
import baseUrl from '../shared/baseUrl'

export default function App ({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [topNotifications, setTopNotifications] = useState([])

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem(CONSTANTS.KEYS.CL_JUDGE_AUTH))
    if (!isLoggedIn && auth && auth.username && auth.access_token) {
      setIsLoggedIn(true)
      setUser(auth)
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (!isLoggedIn || !user) {
      return
    }
    const { access_token: accessToken } = user
    var reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/notifications?limit=3`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          setTopNotifications(results)
        } else {
          console.log(error)
          setTopNotifications([])
        }
      })
      .catch((error) => {
        console.log(error)
        setTopNotifications([])
      })
  }, [user])

  return (
    <>
      <Head>
        <title>CL Judge</title>
        <link rel="icon" href="/images/logo.png" />
      </Head>

      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
        setUser={setUser}
        topNotifications={topNotifications}
        setTopNotifications={setTopNotifications}
      />
      <div style={{ minHeight: '75vh' }}>
        <Component
          {...pageProps}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          user={user}
          setUser={setUser}
        />
      </div>
      <Footer />
    </>
  )
}
