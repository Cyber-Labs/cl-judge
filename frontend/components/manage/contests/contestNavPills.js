import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { Badge, Nav, NavItem } from 'react-bootstrap'
import styles from './contestNavPills.module.css'

function ContestNavPills (props) {
  const { activeTab, contestId } = props
  const contestMenuItems = [{ title: 'Basic Info', link: `/manage/contests/${contestId}` },
    { title: 'Questions', link: `/manage/contests/${contestId}/questions` },
    { title: 'Moderators', link: `/manage/contests/${contestId}/moderators` },
    { title: 'Participants', link: `/manage/contests/${contestId}/participants` },
    { title: 'Submissions', link: `/manage/contests/${contestId}/submissions` },
    { title: 'Leaderboard', link: `/manage/contests/${contestId}/leaderboard` }]
  return (
    <Nav>
      {
        contestMenuItems.map(({ title, link }) => <NavItem key={title}>
        <Link
          href={link}
          style={{ color: 'black' }}
        >
          <h5>
            <Badge
              className={(activeTab === title) ? styles.selectedOption : styles.option}
              variant={activeTab === title ? 'dark' : ''}
              size="xl"
              pill
              >
            {title}
            </Badge>
          </h5>
        </Link>
        &nbsp;
        </NavItem>)
      }
    </Nav>
  )
}

ContestNavPills.propTypes = {
  activeTab: PropTypes.string.isRequired,
  contestId: PropTypes.number.isRequired
}

export default ContestNavPills
