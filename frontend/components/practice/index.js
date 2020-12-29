import React from 'react'
import PropTypes from 'prop-types'
import PracticeListItem from './practiceListItem'
import {
  ListGroupItem, Row, Col
} from 'react-bootstrap'

const Practice = ({ questions, sortBy, handleSort }) => {
  const isMobile = window.innerWidth < 992
  return <>
        <ListGroupItem
          style={{
            backgroundColor: '#f2f2f2'
          }}
          className='mt-3'
        >
          <Row>
            <Col lg={2} className={isMobile ? 'text-center' : ''}>
              <b className="hover-cursor-pointer" onClick={() => handleSort('id')}>
                #
                &nbsp;
                {sortBy.id
                  ? sortBy.id === 'ASC'
                      ? <span className="fa fa-caret-down" />
                      : <span className="fa fa-caret-up" />
                  : <span className="fa fa-sort" />}
              </b>
            </Col>
            <Col lg={7} className={isMobile ? 'text-center' : ''}>
              <b className="hover-cursor-pointer" onClick={() => handleSort('name')}>
                Title
                &nbsp;
                {sortBy.name
                  ? sortBy.name === 'ASC'
                      ? <span className="fa fa-caret-down" />
                      : <span className="fa fa-caret-up" />
                  : <span className="fa fa-sort" />}
              </b>
            </Col>
            <Col lg={3} className='text-center'>
              <b>Difficulty</b>
            </Col>
          </Row>
        </ListGroupItem>
        {questions.map(({ id, name, difficulty }, idx) => (
          <PracticeListItem
            key={id}
            id={id}
            difficulty={difficulty}
            name={name}
            backgroundColor={idx % 2 === 0 ? 'white' : '#f2f2f2'}
            isMobile={isMobile}
          />
        ))}
        {!questions.length &&
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '25vh' }}>
            Sorry! there is no practice content available
          </div>
        }
    </>
}

Practice.propTypes = {
  questions: PropTypes.array,
  sortBy: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.any
  }),
  handleSort: PropTypes.func
}

export default Practice
