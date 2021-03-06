const baseUrl = 'http://localhost:8080'
const defaultLanguageId = 'en_US'

const languages = {
  en_US: { key: 'en_US', value: 'English (United States' },
  ar_SA: { key: 'ar_SA', value: 'Arabic (Saudi Arabia)' },
  ca_ES: { key: 'ca_ES', value: 'Catalan (Spain)' },
  zh_CN: { key: 'zh_CN', value: 'Chinese (China)' },
  nl_NL: { key: 'nl_NL', value: 'Dutch (Netherlands)' },
  fi_FI: { key: 'fi_FI', value: 'Finnish (Finland)' },
  fr_FR: { key: 'fr_FR', value: 'French (France)' },
  de_DE: { key: 'de_DE', value: 'German (Germany)' },
  hu_HU: { key: 'hu_HU', value: 'Hungarian (Hungary)' },
  ja_JP: { key: 'ja_JP', value: 'Japanese (Japan)' },
  pt_BR: { key: 'pt_BR', value: 'Portuguese (Brazil)' },
  es_ES: { key: 'es_ES', value: 'Spanish (Spain)' },
  sv_SE: { key: 'sv_SE', value: 'Swedish (Sweden)' }
}

module.exports = {
  baseUrl,
  defaultLanguageId,
  fieldTypes: [
    {
      config: {
        displayType: 'multiple',
        help: 'Its recommended inform the School Name',
        label: 'School Name',
        placeholder: 'School name here',
        predefinedValue: 'Keven',
        repeatable: true,
        required: true
      },
      name: 'Text',
      type: 'text'
    },
    {
      config: {
        help: 'Student Grade',
        label: 'School Grade',
        multiple: true,
        options: ['First Grade', 'Second Grade', 'Third Grade'],
        repeatable: true,
        required: true
      },
      name: 'Select from List',
      type: 'select'
    },
    {
      config: {
        help: 'Self Care',
        label: 'Self Care',
        options: ['First aid', 'Health Package', 'Playground'],
        repeatable: true,
        required: true
      },
      name: 'Single Selection',
      type: 'radio'
    },
    {
      config: {
        help: 'Basic Toolkit',
        inline: true,
        label: 'Basic Toolkit',
        options: ['Pencil', 'Pen', 'Eraser', 'Notebook'],
        repeatable: true,
        required: true
      },
      name: 'Multiple Selection',
      type: 'checkbox_multiple'
    },
    {
      config: {
        help: 'Student Born Date',
        label: 'Student Born',
        repeatable: true,
        required: true
      },
      name: 'Date',
      type: 'date'
    },
    {
      config: {
        help: 'Student Grade',
        label: 'School Grade',
        repeatable: true,
        required: true
      },
      name: 'Numeric',
      type: 'numeric'
    },
    { name: 'Fields Group' },
    { name: 'Upload', type: 'document_library' }
  ],
  languages,
  languageId: defaultLanguageId.replace('_', '-'),
  modules: {
    accountSettings: `${baseUrl}/group/control_panel/manage?p_p_id=com_liferay_my_account_web_portlet_MyAccountPortlet&p_p_lifecycle=0&p_p_auth=68JLVPmH`,
    instance: `${baseUrl}/group/control_panel/manage?p_p_id=com_liferay_configuration_admin_web_portlet_InstanceSettingsPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&_com_liferay_configuration_admin_web_portlet_InstanceSettingsPortlet_mvcRenderCommandName=%2Fview_configuration_screen&_com_liferay_configuration_admin_web_portlet_InstanceSettingsPortlet_configurationScreenKey=language`,
    object: `${baseUrl}/group/guest/~/control_panel/manage?p_p_id=com_liferay_app_builder_web_internal_portlet_ObjectsPortlet&p_p_lifecycle=0&p_p_state=maximized&p_p_mode=view&p_p_auth=cIaiVlKB%2F#/`
  }
}
