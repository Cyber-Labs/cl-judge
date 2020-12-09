import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import AdminNavbar from '../../../components/common/AdminNavbar/index'
import withAdminRoute from '../../../components/utils/withAdminRoute'
import baseUrl from '../../../shared/baseUrl'
import Loading from '../../../components/common/Loading'
import Error from '../../../components/common/Error'
import GroupDetail from '../../../components/manage/groups/groupDetail'
import { useRouter } from 'next/router'

const ViewGroup = (props) => {
  const router = useRouter()
  const { group_id: groupIdFromURL } = router.query
  const { isLoggedIn, user } = props
  const { access_token: accessToken } = user
  const [members, setMembers] = useState([])
  const [moderators, setModerators] = useState([])
  const [confidential, setConfidential] = useState(0)
  const [creator, setCreator] = useState('')
  const [groupName, setGroupName] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [groupId, setGroupId] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setGroupId(Number(groupIdFromURL))
    var reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/groups/${groupIdFromURL}`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          const { creator, group_name: groupName, confidential, members } = results
          const moderators = members.filter(member => member.is_group_moderator)
          const otherMembers = members.filter(member => !member.is_group_moderator)
          setError('')
          setCreator(creator)
          setGroupName(groupName)
          setConfidential(confidential)
          setModerators(moderators)
          setMembers(otherMembers)
        } else {
          setError(error.sqlMessage || error)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
        setCreator('')
        setGroupName('')
        setConfidential(0)
        setModerators([])
        setMembers([])
      })
  }, [])
  return <div>
    <AdminNavbar
      user={user}
      isLoggedIn={isLoggedIn}
      activeNav="groups"
    />
    {isLoading && <Loading />}
    {!isLoading && error && <Error message={error}></Error>}
    {!isLoading && !error && <GroupDetail
      groupId={groupId}
      groupName={groupName}
      moderators={moderators}
      members={members}
      creator={creator}
      confidential={confidential}
      setGroupName={setGroupName}
      user={user}
      setModerators={setModerators}
      setMembers={setMembers}
    />}
  </div>
}

ViewGroup.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withAdminRoute(ViewGroup)
