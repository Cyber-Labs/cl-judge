import React, { useEffect, useState, useCallback } from 'react'
import Loading from '../../../components/common/Loading'
import baseUrl from '../../../shared/baseUrl'
import ManageQuestions from '../../../components/manage/questions/index'
import AdminNavbar from '../../../components/common/AdminNavbar/index'
import {
  Row, Col, Form,
  FormControl,
  InputGroup,
  Dropdown,
  Pagination
} from 'react-bootstrap'
import Error from '../../../components/common/Error'
import CustomBadge from '../../../components/common/customBadge'
import withPrivateRoute from '../../../components/utils/withPrivateRoute'
import PropTypes from 'prop-types'
import DropdownPersist from '../../../components/common/DropdownPersist'

const maxPaginationOneSide = 3

const ManageQuestionsPage = (props) => {
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState([])
  const [error, setError] = useState('')
  const [constraints, setConstraints] = useState({
    search: '',
    difficulty: 3,
    tags: []
  })
  const [sortBy, setSortBy] = useState({
    id: false,
    name: false
  })
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(0)
  const [perPageSize, setPerPageSize] = useState(10)
  const [availableTags, setAvailableTags] = useState([])
  const [pageOptions, setPageOptions] = useState([])

  const { isLoggedIn, user } = props
  const { access_token: accessToken } = user

  const { search, difficulty, tags } = constraints
  const isConstraints = Boolean(search || (difficulty >= 0 && difficulty < 3) || tags.length)

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

  useEffect(() => {
    setLoading(true)

    fetch(`${baseUrl}/tags`)
      .then(async (res) => {
        const { success, error, results } = await res.json()
        if (success) {
          setError('')
          setAvailableTags(results)
        } else {
          setAvailableTags([])
          setError(error.sqlMessage || error)
        }
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
        setAvailableTags([])
      })
  }, [])

  useEffect(() => {
    setPage(1)
  }, [constraints])

  useEffect(() => {
    if (!availableTags.length && questions.length) {
      return
    }

    setLoading(true)

    let url = `${baseUrl}/questions/editor_questions?`

    if (search) { url += `search=${search}&` }

    if (difficulty >= 0 && difficulty < 3) {
      url += `difficulty=${difficulties[+difficulty].toLowerCase()}&`
    }

    if (tags.length) {
      tags.forEach(tag => {
        url += `tag_ids[]=${tag.id}&`
      })
    }

    if (page) {
      url += `page=${page}&`
    }

    if (perPageSize) {
      url += `per_page_size=${perPageSize}&`
    }

    const sort = []

    Object.entries(sortBy).forEach(([field, sortOrder]) => {
      sortOrder && sort.push({ id: field, desc: sortOrder === 'DESC' })
    })

    if (sort.length) {
      url += `sort=${JSON.stringify(sort)}`
    }

    const reqHeaders = new Headers()
    reqHeaders.append('access_token', accessToken)
    const requestOptions = {
      method: 'GET',
      headers: reqHeaders
    }

    fetch(url, requestOptions)
      .then(async (res) => {
        const { success, error, results } = await res.json()
        if (success) {
          setError('')
          setQuestions(results.questions)
          setPageCount(results.page_count)
        } else {
          setQuestions([])
          setPageCount(0)
          setError(error.sqlMessage || error)
        }
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
        setQuestions([])
        setPageCount(0)
      })
  }, [constraints, page, perPageSize, sortBy])

  const handleSort = useCallback((field) => {
    setPage(1)
    setSortBy(prev => {
      const newVal = { ...prev }
      newVal[field] = prev[field] ? prev[field] === 'ASC' ? 'DESC' : false : 'ASC'
      return newVal
    })
  }, [])

  const difficultyTypeMap = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }

  const difficulties = ['Easy', 'Medium', 'Hard']

  const badgeVariants = ['primary', 'success', 'danger', 'info', 'warning', 'dark']

  const canPreviousPage = page - 1 > 0
  const canNextPage = page + 1 <= pageCount

  return (
      <>
        <AdminNavbar
            user={user}
            isLoggedIn={isLoggedIn}
            activeNav="questions"
        />
        <div className="container mt-3">
              <Row>
                <Col md={3} className="mt-1">
                    <Form inline>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="search-addon">
                                    <span className="fa fa-search" />
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                                style={{ height: '50%' }}
                                type="text"
                                placeholder="Search by title"
                                className="mr-sm-2"
                                value={search}
                                onChange={(e) => {
                                  setPage(1)
                                  setConstraints(prev => ({ ...prev, search: e.target.value }))
                                }}
                            />
                        </InputGroup>
                    </Form>
                </Col>
                <Col>
                  <div className="mt-1 rowselect" style={{ float: 'right', marginRight: '10px' }}>
                    <InputGroup>
                      <FormControl
                        as="select"
                        className="ml-sm-2"
                        value={perPageSize}
                        onChange={(e) => {
                          setPage(1)
                          setPerPageSize(e.target.value)
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </FormControl>
                      <InputGroup.Append>
                        <InputGroup.Text id="pagination-addon" style={{ paddingBottom: '4px', paddingTop: '3px' }}>
                        Rows per page
                        </InputGroup.Text>
                      </InputGroup.Append>
                    </InputGroup>
                  </div>
                  <DropdownPersist
                    className="mt-1"
                    style={{
                      float: 'right',
                      marginLeft: '10px',
                      marginRight: '10px'
                    }}
                    title={
                      <span>Tags <i className="fa fa-caret-down"></i> </span>
                    }
                    variant="info"
                    onSelect={(key) => {
                      const selected = tags.some(t => t.id === availableTags[key].id)
                      setPage(1)
                      if (selected) {
                        setConstraints(prev => ({
                          ...prev,
                          tags: prev.tags.filter((tag) => tag.id !== availableTags[key].id)
                        }))
                      } else {
                        setConstraints(prev => ({
                          ...prev,
                          tags: [...prev.tags, availableTags[key]]
                        }))
                      }
                    }}
                  >
                    <div className='taglist'>
                      {availableTags.map((tag, idx) => {
                        const selected = tags.some(t => t.id === tag.id)
                        return <Dropdown.Item
                          key={idx}
                          eventKey={idx}
                          title={tag.description}
                        >
                          <div style={{ color: 'black' }}>
                            {tag.name}
                            {selected ? <>&nbsp; <i className='text-success fa fa-check'/> </> : '' }
                          </div>
                        </Dropdown.Item>
                      }
                      )}
                    </div>
                  </DropdownPersist>
                  <DropdownPersist
                    className="mt-1"
                    style={{ display: 'inline-block', float: 'right' }}
                    title={
                      <span>Difficulty <i className="fa fa-caret-down"></i> </span>
                    }
                    variant="warning"
                    onSelect={(key) => {
                      setPage(1)
                      setConstraints(prev => ({ ...prev, difficulty: +key }))
                    }}
                  >
                    <Dropdown.Item eventKey="0">
                      Easy {difficulty === 0 && <>&nbsp; <i className='text-success fa fa-check'/> </>}
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="1">
                      Medium {difficulty === 1 && <>&nbsp; <i className='text-success fa fa-check'/> </>}
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="2">
                      Hard {difficulty === 2 && <>&nbsp; <i className='text-success fa fa-check'/> </>}
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="3">
                      All {difficulty === 3 && <>&nbsp; <i className='text-success fa fa-check'/> </>}
                    </Dropdown.Item>
                  </DropdownPersist>
                </Col>
              </Row>
              {isConstraints &&
                  <Row className='mt-3'>
                  <Col xs={12}>
                    {Object.entries(constraints).map(([type, constraint], idx) => {
                      if (constraint !== '') {
                        if (type !== 'tags') {
                          let variant = 'success'
                          if (type === 'difficulty') {
                            if (difficulty >= 3 || difficulty < 0) {
                              return null
                            }
                            constraint = difficulties[+constraint]
                            variant = difficultyTypeMap[constraint.toLowerCase()]
                          }
                          return (
                              <CustomBadge
                                key={`difficulty-${idx}`}
                                message={constraint}
                                variant={variant}
                                crossBtn
                                onClose={() => {
                                  setPage(1)
                                  setConstraints(prev => {
                                    const newVal = { ...prev }
                                    newVal[`${type}`] = type === 'difficulty' ? 3 : ''
                                    return newVal
                                  })
                                }}
                              />
                          )
                        } else {
                          return (
                            <span key={'tag'}>
                              {constraint.map((tag, idx) => (
                                  <CustomBadge
                                    key={`tag-${tag.id}`}
                                    message={tag.name}
                                    variant={badgeVariants[tag.name.length % badgeVariants.length]}
                                    crossBtn
                                    onClose={() => {
                                      setPage(1)
                                      setConstraints(prev => ({
                                        ...prev,
                                        tags: [...prev.tags.slice(0, idx), ...prev.tags.slice(idx + 1)]
                                      }))
                                    }}
                                    description={tag.description}
                                  />
                              ))}
                            </span>
                          )
                        }
                      } else {
                        return null
                      }
                    })}
                    </Col>
                  </Row>
              }
            {loading && <Loading />}
            {!loading && error && <Error message={error}></Error>}
            {!loading && !error &&
                <ManageQuestions
                    questions={questions}
                    sortBy={sortBy}
                    handleSort={handleSort}
                />
            }
            <br />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <style jsx>{`
              .taglist {
                height: 250px !important;
                overflow-y: scroll !important;
              }      
              .rowselect {
                width: 90% !important;
              }
              @media only screen and (min-width: 438px)
              {
                .rowselect {
                  width: auto !important;
                }          
              }
            `}</style>
        </div>
    </>
  )
}

ManageQuestionsPage.propTypes = {
  isLoggedIn: PropTypes.bool,
  user: PropTypes.shape({
    username: PropTypes.string,
    access_token: PropTypes.string,
    isAdmin: PropTypes.number
  })
}

export default withPrivateRoute(ManageQuestionsPage)
