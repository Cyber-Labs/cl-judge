import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import PropTypes from 'prop-types'

function CustomHeader (props) {
  const {
    title,
    backTitle,
    backLink
  } = props
  return (
    <div className="align-items-center">
      <Navbar
        variant="dark"
        style={{ backgroundColor: '#030f1f', height: '40px' }}
      >
      {backTitle && <Nav className="mr-auto"> <Nav.Link href={backLink}>
            <span className='fa fa-chevron-left small'/>&nbsp;&nbsp;
            {window.innerWidth > 530 && backTitle}
        </Nav.Link>
        </Nav>
        }
      <Nav className={`m${backTitle ? 'r' : 'x'}-auto brand`}>
      <Nav.Link href="#" active>{title}</Nav.Link>
    </Nav>
      </Navbar>
    </div>
  )
}

CustomHeader.propTypes = {
  title: PropTypes.string,
  backTitle: PropTypes.string,
  backLink: PropTypes.string
}

export default CustomHeader
