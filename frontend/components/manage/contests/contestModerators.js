import React, { useState, useEffect } from 'react'
import { Button, Media } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Link from 'next/link'
import ContestNameEdit from './contestNameEdit'
import ContestNavPills from './contestNavPills'
import baseUrl from '../../../shared/baseUrl'
import Loading from '../../common/Loading'
import Error from '../../common/Error'
import AddModeratorModal from './addModeratorModal'
import RemoveModeratorModal from './removeModeratorModal'

function ContestModerators (props) {
  const
    {
      contestId,
      contestName,
      setContestName,
      user,
      contestCreator
    } = props
  if (!contestCreator) {
    return <Loading/>
  }

  const [moderators, setModerators] = useState([])
  const [moderatorsLoading, setModeratorsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedModeratorIndex, setSelectedModeratorIndex] = useState(-1)
  const [isAddModeratorModalOpen, setAddModeratorModalOpen] = useState(false)
  const [isRemoveModeratorModalOpen, setRemoveModeratorModalOpen] = useState(false)

  const { access_token: accessToken } = user

  useEffect(() => {
    setModeratorsLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    fetch(`${baseUrl}/contests/${contestId}/moderators`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, error, results } = res
        if (success) {
          setError('')
          setModerators(results)
        } else {
          setError(error.sqlMessage || error)
        }
        setModeratorsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setModeratorsLoading(false)
        setModerators([])
      })
  }, [])

  return <div className='container mt-2'>
    <ContestNameEdit
      contestId={contestId}
      contestName={contestName}
      accessToken={accessToken}
      setContestName={setContestName}
    />
    <ContestNavPills contestId={contestId} activeTab='Moderators' />
    {moderatorsLoading && <Loading />}
    {!moderatorsLoading && error && <Error message={error}></Error>}
    {!moderatorsLoading && !error && <> <ul className="list-unstyled">
    {
      moderators.map(({ username, full_name: fullName, profile_img: profileImg }, i) => <Media as="li" key={username}>
        <img
          width={90}
          height={90}
          className="align-self-center mr-3"
          src={profileImg || '/images/profile.png'}
          alt={username}
        />
      <Media.Body
      className='mt-4'
      style={{ marginLeft: '10px' }}
      >
        <h5>{fullName}</h5>
        <Link href={`/profile/${username}`}>
          <h5 className='text-muted' style={{ cursor: 'pointer' }}>{username}</h5>
        </Link>
        {username === contestCreator
          ? <h6> (Creator)</h6>
          : <Button style={{
            padding: '.15rem .2rem',
            fontSize: '.700rem',
            lineHeight: '.3',
            borderRadius: '.1rem'
          }}
          className={'btn btn-sm'}
          variant='danger' onClick={() => {
            setSelectedModeratorIndex(i)
            setRemoveModeratorModalOpen(true)
          }}>
            <i className='fa fa-times' /> Remove
          </Button>
        }
      </Media.Body>
    </Media>)
    }
    </ul>
    <br/>
    <Button onClick={() => {
      setAddModeratorModalOpen(true)
    }}>
     <i className='fa fa-user-plus'/> Add moderator
    </Button>
    </>
    }
    <AddModeratorModal
      showModal={isAddModeratorModalOpen}
      toggleModal={() => {
        setAddModeratorModalOpen(!isAddModeratorModalOpen)
      }}
      accessToken={accessToken}
      contestId={contestId}
      alreadyModerators={moderators}
      setAlreadyModerators={setModerators}
    />
    <RemoveModeratorModal
      showModal={isRemoveModeratorModalOpen}
      toggleModal={() => {
        setRemoveModeratorModalOpen(!isRemoveModeratorModalOpen)
      }}
      accessToken={accessToken}
      contestId={contestId}
      moderators={moderators}
      setModerators={setModerators}
      selectedUser={selectedModeratorIndex !== -1 ? moderators[selectedModeratorIndex] : null}
    />
    </div>
}

ContestModerators.propTypes = {
  contestId: PropTypes.number.isRequired,
  contestName: PropTypes.string,
  setContestName: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  }),
  contestCreator: PropTypes.string
}

export default ContestModerators
