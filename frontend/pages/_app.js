/* eslint-disable react/prop-types */
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.css'
import '../styles/global.css'

export default function App ({ Component, pageProps }) {
  return <Component {...pageProps} />
}
