import React from 'react'
import PropTypes from 'prop-types'
import ManageQuestionsListItem from './questionsListItem'
import {
  ListGroupItem, Row, Col
} from 'react-bootstrap'

const ManageQuestions = ({ questions, sortBy, handleSort }) => (
    <>
        <ListGroupItem
          style={{
            backgroundColor: '#f2f2f2'
          }}
        >
          <Row>
            <Col lg={1}>
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
            <Col lg={6}>
              <b className="hover-cursor-pointer" onClick={() => handleSort('name')}>
                Name
                &nbsp;
                {sortBy.name
                  ? sortBy.name === 'ASC'
                      ? <span className="fa fa-caret-down" />
                      : <span className="fa fa-caret-up" />
                  : <span className="fa fa-sort" />}
              </b>
            </Col>
            <Col lg={2} className='text-center'>
              <b>Difficulty</b>
            </Col>
            <Col lg={3} className='text-center'>
                <b>Creator</b>
            </Col>
          </Row>
        </ListGroupItem>
        {questions.map(({ ...question }, idx) => (
          <ManageQuestionsListItem
            key={question.id}
            {...question}
            backgroundColor={idx % 2 === 0 ? 'white' : '#f2f2f2'}
          />
        ))}
        {!questions.length &&
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '25vh' }}>
            Sorry! there are no questions to display
          </div>
        }
    </>
)

ManageQuestions.propTypes = {
  questions: PropTypes.array,
  sortBy: PropTypes.object,
  handleSort: PropTypes.func
}

export default ManageQuestions
