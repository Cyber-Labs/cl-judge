import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Pagination } from 'react-bootstrap'

function CustomPagination (props) {
  const {
    maxPaginationOneSide,
    page,
    setPage,
    pageCount
  } = props
  const [pageOptions, setPageOptions] = useState([])

  useEffect(() => {
    const newPageOptions = []
    if (pageCount > 2 * maxPaginationOneSide + 1) {
      let i = Math.max(page - maxPaginationOneSide, 1)
      for (; i <= Math.min(page + maxPaginationOneSide, pageCount); i++) {
        newPageOptions.push(i)
      }
    } else {
      for (let i = 1; i <= pageCount; i++) {
        newPageOptions.push(i)
      }
    }
    setPageOptions(newPageOptions)
  }, [pageCount, page])
  const canPreviousPage = page - 1 > 0
  const canNextPage = page + 1 <= pageCount
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <Pagination className={'justify-content-center'}>
    <Pagination.First onClick={() => setPage(1)} disabled={!canPreviousPage}/>
      <Pagination.Prev onClick={() => setPage(page - 1)} disabled={!canPreviousPage}/>
      {pageOptions.map((num) => <Pagination.Item key={num} active={num === page} onClick={() => setPage(num)}>
        {num}
      </Pagination.Item>)}
      <Pagination.Next onClick={() => setPage(page + 1)} disabled={!canNextPage}/>
    <Pagination.Last onClick={() => setPage(pageCount)} disabled={!canNextPage}/>
  </Pagination>
</div>
}

CustomPagination.propTypes = {
  maxPaginationOneSide: PropTypes.number.isRequired,
  page: PropTypes.number,
  setPage: PropTypes.func.isRequired,
  pageCount: PropTypes.number
}

export default CustomPagination
