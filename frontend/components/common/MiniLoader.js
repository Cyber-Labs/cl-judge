import React from 'react'
import { Spinner } from 'react-bootstrap'

function MiniLoader () {
  return (
    <Spinner animation="border" role="status" size="sm">
      <span className="sr-only">Loading...</span>
    </Spinner>
  )
}

export default MiniLoader
