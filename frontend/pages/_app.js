/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import '../styles/global.css'
import Footer from '../components/common/Footer'
import Header from '../components/common/Header'
import CONSTANTS from '../shared/CONSTANTS'

export default function App ({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem(CONSTANTS.KEYS.CL_JUDGE_AUTH))
    if (!isLoggedIn && auth && auth.username && auth.access_token) {
      setIsLoggedIn(true)
      setUser(auth)
    }
  })
  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
        setUser={setUser}
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
