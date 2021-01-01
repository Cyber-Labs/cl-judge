import React from 'react'
import { Popover, Form, OverlayTrigger } from 'react-bootstrap'
import PropTypes from 'prop-types'

function ColumnFilter (props) {
  const { column, optionList, title } = props
  const { filterValue, setFilter } = column
  const options = React.useMemo(() => {
    return [...optionList]
  }, [])
  return (
    <OverlayTrigger trigger="click" placement="right" rootClose overlay={ <Popover id="popover-courses">
    <Popover.Title as="h4">{title}</Popover.Title>
    <Popover.Content>
    <Form>
      {options.map(({ value, label }) => (
        <Form.Check
        key={value}
        value={value}
        type='checkbox'
        id={`checkbox-${value}`}
        label={label}
        checked={filterValue && filterValue.some((val) => val === value.toString())}
        onChange={(e) => {
          const selectedValue = e.target.value
          let newFilterValue
          if (filterValue && filterValue.some((val) => val === selectedValue)) {
            newFilterValue = filterValue.filter((val) => val !== selectedValue)
          } else {
            newFilterValue = filterValue ? [...filterValue, selectedValue] : [selectedValue]
          }
          setFilter(newFilterValue)
        }}
      />
      ))}
    </Form>
    </Popover.Content>
  </Popover> }>
      <i className='fa fa-filter' style={{ cursor: 'pointer' }}/>
    </OverlayTrigger>
  )
}

ColumnFilter.propTypes = {
  column: PropTypes.shape({
    filterValue: PropTypes.any,
    setFilter: PropTypes.func.isRequired
  }),
  optionList: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    label: PropTypes.string
  })),
  title: PropTypes.string.isRequired
}

export default ColumnFilter
