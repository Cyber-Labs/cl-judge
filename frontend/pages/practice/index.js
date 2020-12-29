import React, { useEffect, useState, useCallback } from 'react'
import Loading from '../../components/common/Loading'
import baseUrl from '../../shared/baseUrl'
import Practice from '../../components/practice/index'
import {
  ListGroupItem, Row, Col, Form,
  FormControl,
  InputGroup,
  DropdownButton,
  Dropdown,
  Pagination
} from 'react-bootstrap'
import Error from '../../components/common/Error'
import CustomBadge from '../../components/common/customBadge'

const PracticePage = () => {
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

  const { search, difficulty, tags } = constraints
  const isConstraints = Boolean(search || (difficulty >= 0 && difficulty < 3) || tags.length)

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

    let url = `${baseUrl}/questions?`

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

    fetch(url)
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

  const handleSort = useCallback((field) => setSortBy(prev => {
    const newVal = { ...prev }
    newVal[field] = prev[field] ? prev[field] === 'ASC' ? 'DESC' : 'ASC' : 'ASC'
    return newVal
  }), [])

  const difficultyTypeMap = {
    easy: 'success',
    medium: 'warning',
    hard: 'danger'
  }

  const difficulties = ['Easy', 'Medium', 'Hard']

  const badgeVariants = ['primary', 'success', 'danger', 'info', 'warning', 'light']

  return (
    <div className="container mt-3">
      <ListGroupItem>
        <Row>
          <Col md={3}>
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
                  placeholder="Search by Name"
                  className="mr-sm-2"
                  value={search}
                  onChange={(e) => setConstraints(prev => ({ ...prev, search: e.target.value }))}
                />
              </InputGroup>
            </Form>
          </Col>
          <Col md={3} className="mt-1 text-center">
            <DropdownButton
              title="Difficulty"
              variant="warning"
              onSelect={(key) => setConstraints(prev => ({ ...prev, difficulty: +key }))}
            >
              <Dropdown.Item eventKey="0" active={difficulty === 0}>Easy</Dropdown.Item>
              <Dropdown.Item eventKey="1" active={difficulty === 1}>Medium</Dropdown.Item>
              <Dropdown.Item eventKey="2" active={difficulty === 2}>Hard</Dropdown.Item>
              <Dropdown.Item eventKey="3" active={difficulty === 3}>All</Dropdown.Item>
            </DropdownButton>
          </Col>
          <Col md={3} className="mt-1 text-center">
            <DropdownButton
              title="Tags"
              variant="info"
              onSelect={(key) => setConstraints(prev => ({
                ...prev,
                tags: [...prev.tags, availableTags[key]]
              }))}
            >
              {availableTags.map((tag, idx) => (
                <Dropdown.Item
                  key={idx}
                  eventKey={idx}
                  disabled={tags.find(tag1 => tag1.id === tag.id)}
                >
                  {tag.name}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
          <Col md={3} className="mt-1 text-center">
            <DropdownButton
              title="Rows per page"
              variant="success"
              onSelect={(key) => setPerPageSize(+key)}
            >
              <Dropdown.Item eventKey={5} active={perPageSize === 5}>5</Dropdown.Item>
              <Dropdown.Item eventKey={10} active={perPageSize === 10}>10</Dropdown.Item>
              <Dropdown.Item eventKey={15} active={perPageSize === 15}>15</Dropdown.Item>
              <Dropdown.Item eventKey={20} active={perPageSize === 20}>20</Dropdown.Item>
            </DropdownButton>
          </Col>
        </Row>
      </ListGroupItem>
      {isConstraints &&
        <ListGroupItem>
          <Row>
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
                    <Col
                      key={idx}
                      xs={12}
                    >
                      <CustomBadge
                        message={constraint}
                        variant={variant}
                        crossBtn
                        onClose={() => setConstraints(prev => {
                          const newVal = { ...prev }
                          newVal[`${type}`] = type === 'difficulty' ? 3 : ''
                          return newVal
                        })}
                      />
                    </Col>
                  )
                } else {
                  return (
                    <>
                      {constraint.map((tag, idx) => (
                        <Col
                          key={idx}
                          xs={12}
                        >
                          <CustomBadge
                            message={tag.name}
                            variant={badgeVariants[Math.floor(Math.random() * badgeVariants.length)]}
                            crossBtn
                            onClose={() => setConstraints(prev => ({
                              ...prev,
                              tags: [...prev.tags.slice(0, idx), ...prev.tags.slice(idx + 1)]
                            }))}
                          />
                        </Col>
                      ))}
                    </>
                  )
                }
              } else {
                return null
              }
            })}
          </Row>
        </ListGroupItem>
      }
      {loading && <Loading />}
      {!loading && error && <Error message={error}></Error>}
      {!loading && !error &&
        <Practice
          questions={questions}
          sortBy={sortBy}
          handleSort={handleSort}
        />
      }
      <br />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Pagination>
          {new Array(pageCount).fill(0).map((_, idx) => (
            <Pagination.Item
              key={idx}
              active={page === idx + 1}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  )
}

export default PracticePage
