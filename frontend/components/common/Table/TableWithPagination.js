/* eslint-disable react/jsx-key */
import React from 'react'
import { Button, Table, FormControl, InputGroup, Row, Col, Pagination } from 'react-bootstrap'
import PropTypes from 'prop-types'
import MiniLoader from '../MiniLoader'

function TableWithPagination (props) {
  const isMobile = window.innerWidth < 768

  const {
    searchKeyword,
    handleSearch,
    searchLabel,
    pageSize,
    setPageSize,
    newDataLoading,
    getTableBodyProps,
    downloadCSV,
    csvDownloading,
    gotoPage,
    pageCount,
    pageIndex,
    nextPage,
    prepareRow,
    previousPage,
    canNextPage,
    canPreviousPage,
    maxPaginationOneSide,
    page,
    getTableProps,
    headerGroups,
    pageOptions,
    indexes
  } = props

  return <div>
  <Row>
  { handleSearch && <Col md={6} lg={4} className={isMobile ? 'mt-2 text-center' : ''}>
  <InputGroup>
    <InputGroup.Prepend>
      <InputGroup.Text id="search-addon">
        <span className="fa fa-search" />
      </InputGroup.Text>
    </InputGroup.Prepend>
    <FormControl
      style={{ height: '50%' }}
      type="text"
      placeholder={searchLabel}
      className="mr-sm-2"
      value={searchKeyword}
      onChange={handleSearch}
    />
  </InputGroup>
  </Col>
  }
  <Col md={6} lg={4} className={isMobile ? 'mt-2 text-center' : ''}>
  <InputGroup>
    <InputGroup.Prepend style={{ height: '50%' }}>
      <InputGroup.Text id="pagination-addon" style={{ paddingBottom: '4px', paddingTop: '3px' }}>
      Entries per page
      </InputGroup.Text>
    </InputGroup.Prepend>
    <FormControl
      style={{ height: '50%' }}
      as="select"
      className="mr-sm-2"
      value={pageSize}
      onChange={(e) => {
        setPageSize(e.target.value)
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </FormControl>
  </InputGroup>
  </Col>
  <Col style={{ height: '50%' }}>
    {
      newDataLoading && <>&nbsp; <MiniLoader/> </>
    }
  </Col>
  </Row>
  <br/>
<Table striped bordered hover responsive {...getTableProps()}>
 <thead>
   {headerGroups.map(headerGroup => (
     <tr {...headerGroup.getHeaderGroupProps()}>
       {headerGroup.headers.map(column => (
         <th {...column.getHeaderProps(column.getSortByToggleProps())}>
           {column.render('Header')}
            &nbsp;
                {
                column.canSort
                  ? column.isSorted
                      ? column.isSortedDesc
                          ? <>
                    <i className='fa fa-sort-down' style={{ cursor: 'pointer' }}/>
                    </>
                          : <>
                    <i className='fa fa-sort-up' style={{ cursor: 'pointer' }}/>
                    </>
                      : <i className='fa fa-sort' style={{ cursor: 'pointer', opacity: 0.6 }}/>
                  : ''}
                {column.canFilter ? column.render('Filter') : ''}
         </th>
       ))}
     </tr>
   ))}
 </thead>
 <tbody {...getTableBodyProps()}>
   {page.map(row => {
     prepareRow(row)
     return (
       <tr {...row.getRowProps()}>
         {row.cells.map(cell => {
           return (
             <td {...cell.getCellProps()}>
               {cell.render('Cell')}
             </td>
           )
         })}
       </tr>
     )
   })}
 </tbody>
</Table>
{newDataLoading && <div className='text-center'> <MiniLoader/> </div>}
<Row className={isMobile ? 'text-center' : ''}>
<Col md={8} className={isMobile ? 'mt-2 text-center order-md-2' : 'order-md-2'}>
  <Pagination className={isMobile ? 'justify-content-center' : 'float-right'}>
    <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage}/>
      <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage}/>
      {pageOptions.length <= 2 * maxPaginationOneSide + 1
        ? pageOptions.map((num) => <Pagination.Item key={num} active={num === pageIndex} onClick={() => gotoPage(num)}>
        {num + 1}
      </Pagination.Item>)
        : indexes.map((num) => <Pagination.Item key={num} active={num === pageIndex} onClick={() => gotoPage(num)}>
        {num + 1}
      </Pagination.Item>) }
      <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage}/>
    <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}/>
  </Pagination>
</Col>
{
  downloadCSV && <Col md={4} className={isMobile ? 'mt-2 text-center order-md-1' : 'order-md-1'}>
  <Button onClick={downloadCSV} disabled={csvDownloading}>
    <i className='fa fa-download'/>  Download as CSV
    {csvDownloading && <>&nbsp;<MiniLoader/></>}
  </Button>
</Col>
}
</Row>
</div>
}

TableWithPagination.propTypes = {
  searchKeyword: PropTypes.string,
  handleSearch: PropTypes.func,
  searchLabel: PropTypes.string,
  pageSize: PropTypes.number,
  setPageSize: PropTypes.func,
  newDataLoading: PropTypes.bool,
  getTableBodyProps: PropTypes.object,
  downloadCSV: PropTypes.func,
  csvDownloading: PropTypes.bool,
  gotoPage: PropTypes.func,
  pageCount: PropTypes.number,
  pageIndex: PropTypes.number,
  nextPage: PropTypes.func,
  prepareRow: PropTypes.func,
  previousPage: PropTypes.func,
  canNextPage: PropTypes.bool,
  canPreviousPage: PropTypes.bool,
  maxPaginationOneSide: PropTypes.number,
  page: PropTypes.array,
  getTableProps: PropTypes.func,
  headerGroups: PropTypes.array,
  pageOptions: PropTypes.array,
  indexes: PropTypes.array
}

export default TableWithPagination
