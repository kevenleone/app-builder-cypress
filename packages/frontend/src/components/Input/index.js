import ClayDatePicker from '@clayui/date-picker'
import ClayForm, { ClayInput, ClaySelectWithOption, ClayToggle } from '@clayui/form'
import React from 'react'

import LocalizedInput from '../LocalizedInput'
import MultiInput from '../MultiSelect'
const spritemap = require('@clayui/css/lib/images/icons/icons.svg')

const InputGroup = ({ children, label }) => (
  <ClayForm.Group>
    <label>{label}</label>
    {children}
  </ClayForm.Group>
)

function Input ({ label, ...rest }) {
  return (
    <InputGroup label={label}>
      <ClayInput {...rest} />
    </InputGroup>
  )
}

const ClayDatePickerWithState = ({ label, ...props }) => {
  const [value, setValue] = React.useState('')

  return (
    <InputGroup label={label}>
      <ClayDatePicker
        {...props}
        onValueChange={setValue}
        spritemap={spritemap}
        value={value}
      />
    </InputGroup>
  )
}

const Select = ({ label, options = [], ...props }) => {
  return (
    <InputGroup label={label}>
      <ClaySelectWithOption
        {...props}
        aria-label="Select Label"
        options={options}></ClaySelectWithOption>
    </InputGroup>
  )
}

const MultiInputSelection = ({ label, ...props }) => {
  return (
    <InputGroup label={label}>
      <MultiInput {...props} />
    </InputGroup>
  )
}

const Toggle = (props) => (
  <InputGroup>
    <ClayToggle {...props} />
  </InputGroup>
)

export {
  Input, LocalizedInput, Select, ClayDatePickerWithState, MultiInputSelection, Toggle
}
