import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'react-bootstrap'
import Link from 'next/link'
import withPrivateRoute from '../../components/utils/withPrivateRoute'
import baseUrl from '../../shared/baseUrl'
import Loading from '../../components/common/Loading'
import Error from '../../components/common/Error'
import GroupListItem from '../../components/manage/groups/groupListItem'

function ViewMyGroups (props) {
  const { user } = props
  const { access_token: accessToken, isAdmin } = user
  const [groups, setGroups] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    var reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    Promise.all([fetch(`${baseUrl}/groups/moderator_groups`, requestOptions), fetch(`${baseUrl}/groups`, requestOptions)])
      .then(async ([aa, bb]) => {
        const a = await aa.json()
        const b = await bb.json()
        return [a, b]
      })
      .then((res) => {
        const { success: success1, error: error1 } = res[0]
        const { success: success2, error: error2 } = res[1]
        if (success1 && success2) {
          setError('')
          let groups = res[0].results
          groups = groups.map((group) => ({ ...group, isModerator: true }))
          res[1].results.forEach((newGroup) => {
            const { id } = newGroup
            if (!groups.some((group) => group.id === id)) { groups.push({ ...newGroup, isModerator: false }) }
          })
          setGroups(groups)
        } else {
          setGroups([])
          if (error1) {
            setError(error1.sqlMessage || error1)
          } else if (error2) {
            setError(error2.sqlMessage || error2)
          }
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
        setGroups([])
      })
  }, [])

  return (
    <div className="container mt-3">
      <h4 align="center">My Groups</h4>
      {
        isAdmin && <div className="text-center">
          <br/>
          <Link href="/manage/groups/create">
            <Button variant="success">
              <i className="fa fa-plus-circle" />
              &nbsp; Create a new group
            </Button>
          </Link>
        </div>
      }
      <br />
      {isLoading && <Loading />}
      {!isLoading && error && <Error message={error}></Error>}
      {groups.map(
        ({ id, creator, group_name: groupName, member_count: memberCount, confidential, isModerator }) => {
          return (
            <GroupListItem
              key={id.toString()}
              id={id}
              groupName={groupName}
              memberCount={memberCount}
              confidential={confidential}
              creator={creator}
              isModerator={isModerator}
            />
          )
        }
      )}
      {
        !isLoading && !error && !groups.length &&
          <div className="text-center">
            <p>You are not a part of any group</p>
          </div>
      }
    </div>
  )
}

ViewMyGroups.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withPrivateRoute(ViewMyGroups)
