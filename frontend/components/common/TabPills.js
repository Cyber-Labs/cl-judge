import React from 'react'
import PropTypes from 'prop-types'
import { Badge, Nav, NavItem } from 'react-bootstrap'
import styles from './TabPills.module.css'

function TabPills (props) {
  const { tabItems, active, setActive } = props
  return <Nav>
      {
        tabItems.map(title => <NavItem key={title} onClick={() => setActive(title)}>
          <h5 style={{ color: 'black' }}>
            <Badge
              className={(active === title) ? styles.selectedOption : styles.option}
              variant={active === title ? 'dark' : ''}
              size="xl"
              pill
              style={{ marginRight: '10px' }}
              >
            {title}
            </Badge>
          </h5>
        &nbsp;
        </NavItem>)
      }
    </Nav>
}

TabPills.propTypes = {
  tabItems: PropTypes.arrayOf(PropTypes.string),
  active: PropTypes.string.isRequired,
  setActive: PropTypes.func.isRequired
}

export default TabPills
