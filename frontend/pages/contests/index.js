import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Nav, NavItem, Button } from 'react-bootstrap'
import withPrivateRoute from '../../components/utils/withPrivateRoute'
import baseUrl from '../../shared/baseUrl'
import TabPills from '../../components/common/TabPills'
import Link from 'next/link'
import UpcomingContestsList from '../../components/contests/upcomingContestsList'
import PastContestsList from '../../components/contests/pastContestsList'
import ActiveContestsList from '../../components/contests/activeContestsList'

const defaultPageSize = 10

function Contests (props) {
  const { user } = props
  const { access_token: accessToken, isAdmin } = user
  const [activeContests, setActiveContests] = useState([])
  const [pastContests, setPastContests] = useState([])
  const [upcomingContests, setUpcomingContests] = useState([])
  const [activeContestsError, setActiveContestsError] = useState('')
  const [pastContestsError, setPastContestsError] = useState('')
  const [upcomingContestsError, setUpcomingContestsError] = useState('')
  const [activeContestsLoading, setActiveContestsLoading] = useState(false)
  const [pastContestsLoading, setPastContestsLoading] = useState(false)
  const [upcomingContestsLoading, setUpcomingContestsLoading] = useState(false)
  const [activeContestsPageCount, setActiveContestsPageCount] = useState(0)
  const [pastContestsPageCount, setPastContestsPageCount] = useState(0)
  const [upcomingContestsPageCount, setUpcomingContestsPageCount] = useState(0)
  const [activeContestsPage, setActiveContestsPage] = useState(1)
  const [pastContestsPage, setPastContestsPage] = useState(1)
  const [upcomingContestsPage, setUpcomingContestsPage] = useState(1)
  const [activeTab, setActiveTab] = useState('Active')

  useEffect(() => {
    setActiveContestsLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/contests?status=active&size=${defaultPageSize}&page=${activeContestsPage - 1}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          const { page_count: pageCount, contests } = results
          setActiveContestsError('')
          setActiveContestsPageCount(pageCount)
          setActiveContests(contests)
        } else {
          setActiveContestsError(error.sqlMessage || error)
        }
        setActiveContestsLoading(false)
      })
      .catch((error) => {
        setActiveContestsError(error.message)
        setActiveContestsLoading(false)
        setActiveContests([])
      })
  }, [activeContestsPage])

  useEffect(() => {
    setUpcomingContestsLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/contests?status=upcoming&size=${defaultPageSize}&page=${upcomingContestsPage - 1}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          const { page_count: pageCount, contests } = results
          setUpcomingContestsError('')
          setUpcomingContestsPageCount(pageCount)
          setUpcomingContests(contests)
        } else {
          setUpcomingContestsError(error.sqlMessage || error)
        }
        setUpcomingContestsLoading(false)
      })
      .catch((error) => {
        setUpcomingContestsError(error.message)
        setUpcomingContestsLoading(false)
        setUpcomingContests([])
      })
  }, [upcomingContestsPage])

  useEffect(() => {
    setPastContestsLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/contests?status=past&size=${defaultPageSize}&page=${pastContestsPage - 1}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          const { page_count: pageCount, contests } = results
          setPastContestsError('')
          setPastContestsPageCount(pageCount)
          setPastContests(contests)
        } else {
          setPastContestsError(error.sqlMessage || error)
        }
        setPastContestsLoading(false)
      })
      .catch((error) => {
        setPastContestsError(error.message)
        setPastContestsLoading(false)
        setPastContests([])
      })
  }, [pastContestsPage])

  return (
    <div className="container mt-3">
      <div className="row">
      <TabPills
        tabItems={['Active', 'Upcoming', 'Past']}
        active={activeTab}
        setActive={setActiveTab}
      />
      { isAdmin && <Nav className={window.innerWidth > 358 ? 'ml-auto' : 'mx-auto'}>
                    <NavItem className={window.innerWidth <= 365 ? 'text-center' : ''}>
                    <Link href="/manage/contests/create">
                      <Button
                        variant='success'
                        size='sm'
                        className='mb-1 mr-1'
                      >
                        <i className='fa fa-plus' />
                        &nbsp; Create contest
                      </Button>
                    </Link>
                    </NavItem>
                  </Nav>}
      </div>
      { activeTab === 'Active' &&
      <ActiveContestsList
        contests={activeContests}
        loading={activeContestsLoading}
        error={activeContestsError}
        accessToken={accessToken}
        pageCount={activeContestsPageCount}
        page={activeContestsPage}
        setPage={setActiveContestsPage}
      />
      }
      { activeTab === 'Upcoming' &&
      <UpcomingContestsList
        contests={upcomingContests}
        loading={upcomingContestsLoading}
        error={upcomingContestsError}
        accessToken={accessToken}
        pageCount={upcomingContestsPageCount}
        page={upcomingContestsPage}
        setPage={setUpcomingContestsPage}
      />
      }
      { activeTab === 'Past' &&
      <PastContestsList
        contests={pastContests}
        loading={pastContestsLoading}
        error={pastContestsError}
        pageCount={pastContestsPageCount}
        page={pastContestsPage}
        setPage={setPastContestsPage}
      />
      }
    </div>
  )
}

Contests.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withPrivateRoute(Contests)
