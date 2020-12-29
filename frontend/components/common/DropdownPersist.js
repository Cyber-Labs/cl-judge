import React, { useState } from 'react'
import { DropdownButton } from 'react-bootstrap'

function DropdownPersist (props) {
  const [open, setOpen] = useState(false)
  const onToggle = (isOpen, ev, metadata) => {
    if (metadata.source === 'select') {
      setOpen(true)
      return
    }
    setOpen(isOpen)
  }
  return <DropdownButton show={open} onToggle={onToggle} {...props}></DropdownButton>
}

export default DropdownPersist
