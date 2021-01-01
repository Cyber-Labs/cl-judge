import React, { useState, useEffect } from 'react'
import { useTable, useSortBy, usePagination, useAsyncDebounce, useFilters } from 'react-table'
import PropTypes from 'prop-types'
import Link from 'next/link'
import ContestNameEdit from './contestNameEdit'
import ContestNavPills from './contestNavPills'
import baseUrl from '../../../shared/baseUrl'
import Loading from '../../common/Loading'
import Error from '../../common/Error'
import ColumnFilter from '../../common/Table/ColumnFilter'
import TableWithPagination from '../../common/Table/TableWithPagination'

const maxPaginationOneSide = 2

function ContestSubmissions (props) {
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

  const [submissions, setSubmissions] = useState([])
  const [totalPages, setTotalPages] = useState([])
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [newDataLoading, setNewDataLoading] = useState(false)
  const [indexes, setIndexes] = useState([])
  const [csvDownloading, setCsvDownloading] = useState(false)
  const { access_token: accessToken } = user

  const renderUsername = ({ value }) => <Link href={`/profile/${value}`}>
    <p style={{ color: 'black', fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}>{value}</p>
    </Link>

  const renderSubmissionId = ({ value }) => <Link href={`/manage/contests/${contestId}/submissions/${value}`}>
  <p style={{ color: 'blue', fontWeight: 'bold', cursor: 'pointer' }}>{value}</p>
  </Link>

  const renderTime = ({ value }) => <p>{`${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  }).format(
    new Date(Date.parse(value))
  )}`} </p>

  const renderStatus = ({ value }) => <p>{value === 1 ? 'Judged' : 'Pending'}</p>

  const renderType = ({ value }) => <p>{value !== 'mcq' ? value === 'subjective' ? 'Subjective' : 'Coding' : 'MCQ'}</p>

  const typeFilter = ({ column }) => {
    return <ColumnFilter
      column={column}
      title='Filter by type'
      optionList={[{ value: 'mcq', label: 'MCQ' }, { value: 'subjective', label: 'Subjective' }, { value: 'coding', label: 'Coding' }]} />
  }

  const statusFilter = ({ column }) => {
    return <ColumnFilter
      column={column}
      title='Filter by status'
      optionList={[{ value: 0, label: 'Pending' }, { value: 1, label: 'Judged' }]} />
  }

  const columns = React.useMemo(
    () => [
      {
        Header: '#',
        accessor: 'id',
        Cell: renderSubmissionId,
        disableFilters: true
      },
      {
        Header: 'Who',
        accessor: 'username',
        Cell: renderUsername,
        disableFilters: true
      },
      {
        Header: 'Problem',
        accessor: 'name',
        disableFilters: true
      },
      {
        Header: 'When',
        accessor: 'submission_time',
        Cell: renderTime,
        disableFilters: true
      },
      {
        Header: 'Type',
        accessor: 'type',
        Cell: renderType,
        disableSortBy: true,
        Filter: typeFilter
      },
      {
        Header: 'Score',
        accessor: 'score',
        disableFilters: true
      },
      {
        Header: 'Status',
        accessor: 'judged',
        Cell: renderStatus,
        disableSortBy: true,
        Filter: statusFilter
      }
    ],
    []
  )

  const tableInstance = useTable({
    columns,
    data: submissions,
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
    let url = `${baseUrl}/contests/${contestId}/submissions?`
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
          const { submissions, page_count: numPages } = results
          setError('')
          const submissionData = submissions.map((person) =>
            ({ ...person, id: person.type[0] + person.id }))
          setSubmissions(submissionData)
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
          setSubmissions([])
          setTotalPages(0)
        }
        setNewDataLoading(false)
      })
      .catch((error) => {
        setSubmissions([])
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
    let url = `${baseUrl}/contests/${contestId}/submissions?`
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
        const element = document.createElement('a')
        const file = new Blob([res], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `${contestName}_submissions.csv`
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
    <ContestNavPills contestId={contestId} activeTab='Submissions' />
    {error && <Error message={error}></Error>}
    {!error && <TableWithPagination
          searchKeyword={keyword}
          handleSearch={handleSearch}
          searchLabel='Search by username'
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

ContestSubmissions.propTypes = {
  contestId: PropTypes.number.isRequired,
  contestName: PropTypes.string,
  setContestName: PropTypes.func.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default ContestSubmissions
