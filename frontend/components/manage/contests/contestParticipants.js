import React, { useState, useEffect } from 'react'
import { useTable, useSortBy, usePagination, useAsyncDebounce, useFilters } from 'react-table'
import PropTypes from 'prop-types'
import Link from 'next/link'
import ContestNameEdit from './contestNameEdit'
import ContestNavPills from './contestNavPills'
import baseUrl from '../../../shared/baseUrl'
import Loading from '../../common/Loading'
import Error from '../../common/Error'
import CONSTANTS from '../../../shared/CONSTANTS'
import ColumnFilter from '../../common/Table/ColumnFilter'
import TableWithPagination from '../../common/Table/TableWithPagination'

const maxPaginationOneSide = 2

function ContestParticipants (props) {
  const
    {
      contestId,
      contestName,
      setContestName,
      user
    } = props
  if (!contestName) {
    return <Loading/>
  }

  const [participants, setParticipants] = useState([])
  const [totalPages, setTotalPages] = useState([])
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [newDataLoading, setNewDataLoading] = useState(false)
  const [indexes, setIndexes] = useState([])
  const [csvDownloading, setCsvDownloading] = useState(false)
  const { access_token: accessToken } = user
  const renderUsername = ({ value }) => <Link href={`/profile/${value}`}>
    <p style={{ color: 'black', textDecoration: 'none', cursor: 'pointer' }}>{value}</p>
    </Link>

  const courseFilter = ({ column }) => {
    return <ColumnFilter
      column={column}
      title='Filter courses'
      optionList={CONSTANTS.COURSES.map((course, i) => ({ value: i, label: course }))} />
  }

  const departmentFilter = ({ column }) => {
    return <ColumnFilter
      column={column}
      title='Filter departments'
      optionList={CONSTANTS.DEPARTMENTS.map((course, i) => ({ value: i, label: course }))} />
  }

  const columns = React.useMemo(
    () => [
      {
        Header: 'Username',
        accessor: 'username',
        Cell: renderUsername,
        disableFilters: true
      },
      {
        Header: 'Full Name',
        accessor: 'full_name',
        disableFilters: true
      },
      {
        Header: 'Admission No.',
        accessor: 'admission_number',
        disableFilters: true
      },
      {
        Header: 'Email',
        accessor: 'email',
        disableFilters: true
      },
      {
        Header: 'Course',
        accessor: 'course',
        disableSortBy: true,
        Filter: courseFilter
      },
      {
        Header: 'Department',
        accessor: 'department',
        disableSortBy: true,
        Filter: departmentFilter
      },
      {
        Header: 'Admission Year',
        accessor: 'admission_year',
        disableFilters: true
      }
    ],
    []
  )

  const tableInstance = useTable({
    columns,
    data: participants,
    manualSortBy: true,
    manualFilters: true,
    initialState: {
      pageSize: 10, pageIndex: 0
    },
    manualPagination: true,
    pageCount: totalPages
  }, useFilters, useSortBy, usePagination)
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    prepareRow,
    state
  } = tableInstance

  const { pageIndex, pageSize, sortBy, filters } = state

  const handleSearch = (e) => {
    setKeyword(e.target.value)
    gotoPage(0)
  }

  const onFetchDataDebounced = useAsyncDebounce(() => {
    setNewDataLoading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    let url = `${baseUrl}/contests/${contestId}/participants_details?`
    if (keyword) {
      url += `search=${keyword}&`
    }
    if (sortBy && sortBy.length) {
      url += `sort=${JSON.stringify(sortBy)}&`
    }
    if (filters && filters.length) {
      url += `filters=${JSON.stringify(filters)}&`
    }
    url += `page=${pageIndex}&size=${pageSize}`
    fetch(url, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        const { success, results } = res
        if (success) {
          const { participant_records: participantRecords, page_count: numPages } = results
          setError('')
          const participantData = participantRecords.map((person) =>
            ({ ...person, department: CONSTANTS.DEPARTMENTS[person.department], course: CONSTANTS.COURSES[person.course] }))
          setParticipants(participantData)
          setTotalPages(numPages)
          if (numPages > 2 * maxPaginationOneSide + 1) {
            const newIndexes = []
            let i = Math.max(pageIndex - maxPaginationOneSide, 0)
            for (; i <= Math.min(pageIndex + maxPaginationOneSide, pageCount - 1); i++) {
              newIndexes.push(i)
            }
            setIndexes(newIndexes)
          }
        } else {
          setParticipants([])
          setTotalPages(0)
        }
        setNewDataLoading(false)
      })
      .catch((error) => {
        setParticipants([])
        setError(error.message)
        setNewDataLoading(false)
        setTotalPages(0)
      })
  }, 100)

  const downloadCSV = () => {
    setCsvDownloading(true)
    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }
    let url = `${baseUrl}/contests/${contestId}/participants_details?`
    if (keyword) {
      url += `search=${keyword}&`
    }
    if (sortBy && sortBy.length) {
      url += `sort=${JSON.stringify(sortBy)}&`
    }
    if (filters && filters.length) {
      url += `filters=${JSON.stringify(filters)}&`
    }

    url += 'download_csv=true'
    fetch(url, requestOptions)
      .then((res) => res.text())
      .then((res) => {
        res += '\n\ncourse_code,course\n'
        res += CONSTANTS.COURSES.map((course, i) => `${i},${course}`).join('\n')
        res += '\n\ndepartment_code,department\n'
        res += CONSTANTS.DEPARTMENTS.map((department, i) => `${i},${department}`).join('\n')
        const element = document.createElement('a')
        const file = new Blob([res], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `${contestName}_participants.csv`
        document.body.appendChild(element)
        element.click()
        setCsvDownloading(false)
      })
      .catch((error) => {
        setError(error.message)
        setCsvDownloading(false)
      })
  }

  useEffect(() => {
    onFetchDataDebounced({ pageIndex, pageSize, sortBy, filters })
  }, [onFetchDataDebounced, pageIndex, pageSize, sortBy, filters, keyword])

  return <div className='container mt-2'>
    <ContestNameEdit
      contestId={contestId}
      contestName={contestName}
      accessToken={accessToken}
      setContestName={setContestName}
    />
    <ContestNavPills contestId={contestId} activeTab='Participants' />
    {error && <Error message={error}></Error>}
    {!error && <TableWithPagination
          searchKeyword={keyword}
          handleSearch={handleSearch}
          searchLabel='Search participants'
          pageSize={pageSize}
          setPageSize={setPageSize}
          newDataLoading={newDataLoading}
          getTableBodyProps={getTableBodyProps}
          downloadCSV={downloadCSV}
          csvDownloading={csvDownloading}
          gotoPage={gotoPage}
          pageCount={pageCount}
          pageIndex={pageIndex}
          nextPage={nextPage}
          prepareRow={prepareRow}
          previousPage={previousPage}
          canNextPage={canNextPage}
          canPreviousPage={canPreviousPage}
          maxPaginationOneSide={maxPaginationOneSide}
          page={page}
          getTableProps={getTableProps}
          headerGroups={headerGroups}
          pageOptions={pageOptions}
          indexes={indexes}
        />
    }
    </div>
}

ContestParticipants.propTypes = {
  contestId: PropTypes.number.isRequired,
  contestName: PropTypes.string,
  setContestName: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default ContestParticipants
