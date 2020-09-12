import Button from '@clayui/button'
import ClayPanel from '@clayui/panel'
import React, { useContext, useState } from 'react'

import AppContext, { actions as Actions } from '../../../../AppContext'
import EmptyState from '../../../../components/EmptyState'
import { LocalizedInput } from '../../../../components/Input'
import Table from '../../../../components/Table'
import FieldModal from './FieldModal'

const spritemap = require('@clayui/css/lib/images/icons/icons.svg')

const ObjectModule = () => {
  const [{ scenario: { formView } }, dispatch] = useContext(AppContext)
  const [initialState, setInitialState] = useState()
  const [editIndex, setEditIndex] = useState()
  const [visible, setVisible] = useState(false)
  const [state, setState] = useState(formView)

  const renderChecked = (value) => value ? 'X' : '-'
  const renderLocalized = (value) => typeof value === 'string' ? value : JSON.stringify(value)

  const columns = [
    { key: 'type', value: 'Field Type' },
    { key: 'label', render: renderLocalized, value: 'Label' },
    { key: 'predefinedValue', render: renderLocalized, value: 'Predefined Value' },
    { key: 'placeholder', render: renderLocalized, value: 'Placeholder' },
    { key: 'repeatable', render: renderChecked, value: 'Repeatable' },
    { key: 'inline', render: renderChecked, value: 'Inline' },
    { key: 'multiple', render: renderChecked, value: 'Multiple' },
    { key: 'showAsSwitcher', render: renderChecked, value: 'Show as Switcher' },
    { key: 'showLabel', render: renderChecked, value: 'Show Label' }
  ]

  const onChange = (name, value) => {
    const newState = {
      ...state,
      [name]: value
    }
    setState(newState)
    dispatch({ payload: newState, type: Actions.SYNC_FORM_VIEW })
  }

  const actions = [{
    action: ({ id, originalItem }) => {
      setInitialState(originalItem)
      setVisible(true)
      setEditIndex(id)
    },
    name: 'Edit'
  },
  {
    name: 'divider'
  },
  {
    action: ({ originalItem }) => {
      dispatch({
        payload: {
          ...formView,
          fieldTypes: [...formView.fieldTypes, originalItem]
        },
        type: Actions.SYNC_FORM_VIEW
      })
    },
    name: 'Duplicate'
  }, {
    action: (item) => {
      dispatch({
        payload: {
          ...formView,
          fieldTypes: formView.fieldTypes.filter((_, index) => index !== item.id)
        },
        type: Actions.SYNC_FORM_VIEW
      })
    },
    name: 'Remove'
  }]

  const fieldTypes = formView.fieldTypes
    .map((value, id) => ({ id, ...value.config, ...value, originalItem: value }))

  const AddButton = () => <Button onClick={setVisible}>Add Field Type</Button>

  return (
    <>
      <ClayPanel
        displayTitle={'Form View'}
        displayType="unstyled"
        spritemap={spritemap}
      >
        <ClayPanel.Body>
          <LocalizedInput
            name="name"
            defaultValue={formView.name}
            onChange={onChange}
            label="Name"
          />

          {fieldTypes.length
            ? <Table
              actions={actions}
              columns={columns}
              items={fieldTypes} /> : <EmptyState>
              <AddButton />
            </EmptyState>
          }

          {(Boolean(fieldTypes.length)) && <AddButton />}

        </ClayPanel.Body>
      </ClayPanel>
      <FieldModal
        editIndex={editIndex}
        visible={visible}
        setVisible={() => {
          setVisible(!visible)
          setInitialState()
          setEditIndex()
        }}
        initialState={initialState}
      />
    </>
  )
}

export default ObjectModule
