const TestBase = require('../../test.base')

class FormView extends TestBase {
  constructor (config = {
    newObject: false
  }) {
    super(config)
    this.config = config
  }

  setTitle (value) {
    it('Put the Title', () => {
      cy.get('.app-builder-root').within(() => {
        cy.get('.tbar-item.tbar-item-expand input').type(value)
      })
    })
  }

  _composeFields (parent, { addField, fatherSelector = '', languageId, value }) {
    let doAction = true
    if (languageId && value) {
      const lang = this.normalizeLang(languageId)
      describe('Language', () => {
        this.selectLanguage(lang)
        this.setTitle(value)
      })
    } else {
      if (!fatherSelector) {
        this.setTitle(this.getLocalizedValue(parent.name))
      }
      doAction = false
    }

    parent.fieldTypes.filter(({ type }) => type).map((field, index) => {
      const isScrollDown = index >= 2
      const { name, type } = field
      describe(`Should handle ${name} Field and Fill Values`, () => {
        if (addField) {
          it('add field on DataLayout', () => {
            cy.get(`[data-field-type-name="${type}"]`).dblclick()
          })
        } else {
          it('Click on Field on Layout', () => {
            cy.get(`.ddm-form-builder-wrapper [data-field-name="${field.config.id}"]`).eq(0).click()
          })
        }

        it(`Scroll ${isScrollDown ? 'Down' : 'Up'}`, () => {
          cy.scrollTo(isScrollDown ? 'bottom' : 'top')
        })

        this._fieldCompose(field, {
          doAction,
          fatherSelector,
          languageId
        })

        it('Dispose', () => {
          cy.get(`${fatherSelector} .sidebar-header button`).eq(0).click()
        })
      })
    })
  }

  getLocalizedConfig (config, lang) {
    const newConfigs = {
      ...config
    }
    Object.keys(config).forEach((key) => {
      const value = config[key]
      if (typeof value === 'object') {
        newConfigs[key] = this.getLocalizedPrefenceValue(value, lang)
      }
    })
    return newConfigs
  }

  _deleteAllFieldsFromObject () {
    cy.get('.custom-object-field').each(() => {
      cy.get('.field-type-remove-icon button').eq(0).click({ force: true })

      cy.get('.modal.show button.btn-primary').click()
    })
  }

  _fieldCompose (field, { doAction, fatherSelector, languageId }) {
    const {
      displayType,
      help,
      inline,
      label,
      multiple,
      options = [],
      placeholder,
      predefinedValue,
      predefinedOptions,
      repeatable,
      required,
      showAsSwitcher,
      showLabel = true
    } = this.getLocalizedConfig(field.config, languageId)

    const {
      ddmDisplayStyle,
      ddmInline,
      ddmLabel,
      ddmMultiple,
      ddmOptions,
      ddmPlaceholder,
      ddmPredefinedValue,
      ddmRepeatable,
      ddmRequired,
      ddmShowAsSwitcher,
      ddmShowLabel,
      ddmTip
    } = this.selectors

    const withAdvancedField = predefinedValue || showLabel || repeatable || inline || predefinedOptions

    const applySelector = (selector) => {
      return fatherSelector ? `${fatherSelector} ${selector}` : selector
    }

    const changeTab = (index) => {
      it('Changing tab', () => {
        cy.get('.component-tbar.ddm-form-tabs.tbar li').eq(index).click()
      })
    }

    const setInputValue = (selector, value, id) => {
      it(`Typing [${value}] on [${id}]`, () => {
        cy.get(`${applySelector(selector)} input`).eq(0)
          .clear()
          .should('not.have.value')
          .type(value)
          .should('have.value', value)
      })
    }

    const setChecked = (selector, id) => {
      if (doAction) {
        it(`Mark [${id}] as [checked]`, () => {
          cy.get(`${applySelector(selector)} input`)
            .should('not.be.checked')
            .check()
            .should('be.checked')
        })
      }
    }

    const setUnchecked = (selector, id) => {
      if (doAction) {
        it(`Mark [${id}] as [unchecked]`, () => {
          cy.get(`${applySelector(selector)} input`)
            .should('be.checked')
            .uncheck()
            .should('not.be.checked')
        })
      }
    }

    if (label) {
      it(`Typing [${label}] on [Label]`, () => {
        cy.get(`${ddmLabel} input.ddm-field-text`)
          .clear()
          .type(label)
          .should('have.value', label)
      })
    }

    if (placeholder) {
      setInputValue(ddmPlaceholder, placeholder, 'placeholder')
    }

    if (help) {
      setInputValue(ddmTip, help, 'help')
    }

    if (doAction && displayType === 'multiple') {
      it('Marking [multiple] as [checked]', () => {
        cy.get(`${ddmDisplayStyle}`).within(() => {
          cy.get('input')
            .eq(1)
            .should('not.be.checked')
            .click()
            .should('be.checked')
        })
      })
    }

    if (options && options.length) {
      it('Typing [options]', () => {
        cy.get(ddmOptions).within(() => {
          cy.get('.ddm-field-options').should('have.length', 2)
          options.forEach((option, index) => {
            cy.get('.ddm-field-options').eq(index).find('.form-group input').eq(0).clear().type(option)
          })
        })
      })
    }

    if (required) {
      setChecked(ddmRequired, 'required')
    }

    if (showAsSwitcher) {
      setChecked(ddmShowAsSwitcher, 'showAsSwitcher')
    }

    if (withAdvancedField) {
      changeTab(1)

      it('Get the Name', () => {
        cy.get(`${this.selectors.ddmName} input`).then((doc) => {
          field.config.id = doc.val()
        })
      })

      if (predefinedValue) {
        setInputValue(ddmPredefinedValue, predefinedValue, 'predefinedValue')
      }

      if (repeatable) {
        setChecked(ddmRepeatable, 'repeatable')
      }

      if (!showLabel) {
        setUnchecked(ddmShowLabel, 'showLabel')
      }

      if (multiple) {
        setChecked(ddmMultiple, 'multiple')
      }

      if (inline) {
        setChecked(ddmInline, 'inline')
      }

      if (predefinedOptions) {
        it(`Select the [predefinedValue] as ${predefinedOptions}`, () => {
          cy.get(`${ddmPredefinedValue} .select-field-trigger`).click()
          cy.get(`.dropdown-menu.show button[label="${predefinedOptions}"]`).click()
        })
      }
    }
  }

  title () {
    it('Verify if title is empty and fill value', () => {
      cy.get('.app-builder-upper-toolbar').within(() => {
        cy.get('input').should('be.empty').type(`Liferay FormView ${this.faker.random.number()}`)
      })
    })

    it('Verify if default language is en-US', () => {
      cy.get('.localizable-dropdown .btn-section').contains(this.constants.languageId)
    })
  }

  sidebarLeft () {
    describe('Sidebar Left', () => {
      const [firstFieldType] = this.config.formView.fieldTypes
      it('Object name should be shown', () => {
        cy.get('.data-layout-builder-sidebar form h3').contains(this.config.object.name)
      })

      if (this.config.object.newObject) {
        it('Should show empty state', () => {
          cy.get('.empty.sidebar-body').should('be.visible')
        })

        this.config.formView.fieldTypes.map(({ name: field }, index) => {
          it(`Add ${field} on Sidebar`, () => {
            cy.get('.custom-object-dropdown button').click()

            cy.get('.custom-object-dropdown-menu.show').within(() => {
              cy.get('button').eq(index).click()
            })

            cy.get('.sidebar-body .custom-object-field').eq(index).contains(field)
            cy.get('div[data-field-name="label"] input').should('have.value', field)
          })
        })

        it(`Should have ${this.config.formView.fieldTypes.length} Types on The List`, () => {
          cy.get('.sidebar-body .custom-object-field').should('have.length', this.config.formView.fieldTypes.length)
        })

        it('Should search for Liferay and found nothing', () => {
          cy.get('.custom-object-sidebar-header').within(() => {
            cy.get('button').eq(0).click()
            cy.get('input').should('not.have.value').type('Liferay').should('have.value', 'Liferay').as('input-search')
          })

          cy.get('.sidebar-body .custom-object-field').should('have.length', 0)
        })

        // it(`Should search for ${firstFieldType.name} and found matching value`, () => {
        //   cy.get('.custom-object-sidebar-header input')
        //     .clear()
        //     .type(firstFieldType.name)
        //     .should('have.value', firstFieldType.name)
        //   cy.get('.sidebar-body .custom-object-field').should('have.length', 1)
        // })

        it('Should back to list FieldTypes', () => {
          cy.get('.custom-object-sidebar-header').within(() => {
            cy.get('button').eq(1).click()
          })
        })

        it('Should remote all fields from object', () => {
          this._deleteAllFieldsFromObject()
        })
      }
    })
  }

  sidebarRight (parent = this.config.formView, isFieldSet) {
    const fatherSelector = isFieldSet ? '.fieldset-modal' : ''
    describe('Sidebar Right', () => {
      if (this.config.object.newObject) {
        it('Search for Liferay as Field and Found Nothing', () => {
          cy
            .wait(1000)
            .get(`${fatherSelector} .sidebar-header input `)
            .as('search-input')
            .should('be.empty')
            .type('Liferay')
            .should('have.value', 'Liferay')
          cy.get('.tab-pane .field-type').should('not.exist')
          cy.get('@search-input').clear()
        })
        this._composeFields(parent, { fatherSelector })
      }
    })
  }

  runPipeline () {
    const name = this.config.formView.name
    beforeEach(() => {
      cy.wait(100)
    })

    // this.sidebarLeft()
    this.sidebarRight()
    // this.managementTitle(name, this.config.portal)

    const fieldSet = this.config.fieldset
    if (fieldSet) {
      describe('Create FieldSet', () => {
        it('Open FieldSet section', () => {
          cy.get('.nav-underline .nav-item').eq(1).click()
          this.emptyState()
          cy.get('.add-fieldset').click()
        })

        it('Put the title', () => {
          cy.get('.fieldset-modal .modal-header input').type(fieldSet.name)
        })

        this._composeFields(fieldSet, {
          fatherSelector: '.fieldset-modal'
        })
      })
    }

    // describe('Should set title and Form in multiple languages', () => {
    //   Object.keys(name).forEach((languageId) => {
    //     if (languageId !== this.getDefaultLanguageId()) {
    //       const value = this.getLocalizedPrefenceValue(name, languageId)
    // this._composeFields(this.config.formView, {
    //   addField: false,
    //   languageId,
    //   value
    // })
    //     }
    //   })
    // })

    // describe('Submit', () => {
    //   it('Submit FormView', () => {
    //     cy.get('.app-builder-upper-toolbar button.btn-primary').click()
    //   })

    //   it('Validate ListView', () => {
    //     this.validateListView(name)
    //   })
    // })
  }

  run () {
    this.runPipeline()
  }
}

module.exports = FormView