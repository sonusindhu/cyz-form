import {
  FormFieldModel,
  InputValidationModel,
  SelectOptionModel,
  ValidationRulesModel,
} from './models';

export function createInputElement(settings: FormFieldModel, attributes) {
  const input = document.createElement('input');
  input.setAttribute('type', settings.type);
  input.setAttribute('name', settings.key);
  for (const key in attributes) {
    input.setAttribute(key, attributes[key]);
  }
  setValidations(input, settings.validations);
  return input;
}

export function createHiddenElement(settings: FormFieldModel) {
  const input = document.createElement('input');
  input.setAttribute('type', settings.type);
  input.setAttribute('name', settings.key);
  input.value = settings.defaultValue ? settings.defaultValue : '';
  return input;
}

export function createCheckboxElement(settings, attributes) {
  const uniqueId = (Math.random() + 1).toString(36).substring(7);

  const input = document.createElement('input');
  input.setAttribute('type', settings.type);
  input.setAttribute('name', settings.key);
  input.setAttribute('id', uniqueId);
  for (const key in attributes) {
    input.setAttribute(key, attributes[key]);
  }
  setValidations(input, settings.validations);
  const label = document.createElement('label');
  label.setAttribute('for', uniqueId);
  label.appendChild(input);
  label.append(settings.label);
  // label.textContent = settings.label;

  return label;
}

export function createTextAreaElement(settings, attributes) {
  const textarea = document.createElement('textarea');
  textarea.setAttribute('name', settings.key);
  for (const key in attributes) {
    textarea.setAttribute(key, attributes[key]);
  }
  setValidations(textarea, settings.validations);
  return textarea;
}

export function createSelectElement(
  settings: FormFieldModel,
): HTMLSelectElement {
  const select = document.createElement('select');
  setOption(select, { value: '', label: '--Select ' + settings.label + '--' });
  settings.values?.forEach((item) => setOption(select, item));
  return select;
}

export function setOption(select: HTMLSelectElement, item: SelectOptionModel) {
  const option = document.createElement('option');
  option.setAttribute('value', item.value);
  option.textContent = item.label;
  select.appendChild(option);
}

export function createRadioElement(
  settings: FormFieldModel,
  attributes,
): HTMLDivElement {
  const radioContainer = document.createElement('div');
  radioContainer.classList.add('radio-group');

  const mainlabel = document.createElement('label');
  mainlabel.textContent = settings.label;
  radioContainer.appendChild(mainlabel);

  settings.values?.forEach((val, index) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', settings.key);
    input.setAttribute('value', val.value);
    input.setAttribute('id', `${settings.key}-${index}`);

    for (const key in attributes) {
      input.setAttribute(key, attributes[key]);
    }
    setValidations(input, settings.validations);

    const label = document.createElement('label');
    label.setAttribute('for', `${settings.key}-${index}`);
    label.textContent = val.label;

    radioContainer.appendChild(input);
    radioContainer.appendChild(label);
  });

  return radioContainer;
}

export function createButtonElement(settings: FormFieldModel) {
  const input = document.createElement('button');
  input.setAttribute('type', settings.key);
  input.setAttribute('name', settings.key);
  input.textContent = settings.label;
  return input;
}

export function validateInput(
  input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  validationRules?: InputValidationModel[],
): boolean {
  if (!validationRules || validationRules.length === 0) return true;

  for (const validation of validationRules) {
    const { key, value } = validation;
    switch (key) {
      case 'required': {
        if (value === 'true' && !input.value.trim()) {
          return false;
        }
        break;
      }
      case 'maxlength': {
        if (input.value.length > parseInt(value)) {
          return false;
        }
        break;
      }
      case 'pattern': {
        const regex = new RegExp(value);
        if (!regex.test(input.value)) {
          return regex.test(input.value);
        }
        break;
      }
      case 'min': {
        if (parseFloat(input.value) < parseFloat(value)) {
          return false;
        }
        break;
      }
      case 'max': {
        if (parseFloat(input.value) > parseFloat(value)) {
          return false;
        }
        break;
      }
      // Add more validation rules as needed
    }
  }

  return true;
}

export function setValidations(
  input: HTMLInputElement | HTMLTextAreaElement | HTMLElement,
  validations?: InputValidationModel[],
) {
  if (validations && validations.length > 0) {
    for (let i = 0; i < validations.length; i++) {
      const item = validations[i];
      input.setAttribute(item.key, item.value);
    }
  }
}

export function createFormElement(
  setting: FormFieldModel,
  form: HTMLElement,
): HTMLElement | undefined {
  const { key, label, type } = setting;
  let element:
    | HTMLButtonElement
    | HTMLTextAreaElement
    | HTMLSelectElement
    | HTMLInputElement
    | HTMLLabelElement
    | HTMLDivElement
    | undefined;

  switch (type) {
    case 'text':
    case 'number':
      element = createInputElement(setting, { placeholder: label });
      break;
    case 'textarea':
      element = createTextAreaElement(setting, { placeholder: label });
      break;
    case 'checkbox':
      element = createCheckboxElement(setting, { name: key });
      break;
    case 'radio':
      element = createRadioElement(setting, { name: key });
      break;
    case 'select':
      element = createSelectElement(setting);
      break;
    case 'hidden':
      return createHiddenElement(setting);
      break;
    case 'button':
      element = createButtonElement(setting);
      break;
  }

  if (element) {
    const container = document.createElement('div'); // Create container for field
    container.classList.add('form-field');
    container.appendChild(element);
    return container;
  }

  return;
}
