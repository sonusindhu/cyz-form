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
): HTMLElement {
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

export function validateInput(
  input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  validationRules?: ValidationRulesModel,
): boolean {
  if (!validationRules) return true;

  if (validationRules.required && !input.value.trim()) {
    return false;
  }

  if (
    validationRules.min !== undefined &&
    parseFloat(input.value) < validationRules.min
  ) {
    return false;
  }

  if (
    validationRules.max !== undefined &&
    parseFloat(input.value) > validationRules.max
  ) {
    return false;
  }

  if (validationRules.pattern) {
    const regex = new RegExp(validationRules.pattern);
    return regex.test(input.value);
  }

  // Add more validation rules as needed

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
  let element: HTMLElement | HTMLButtonElement | undefined;

  if (type === 'text' || type === 'number') {
    element = createInputElement(setting, { placeholder: label });
  } else if (type === 'textarea') {
    element = createTextAreaElement(setting, { placeholder: label });
  } else if (type === 'checkbox') {
    element = createCheckboxElement(setting, { name: key });
  } else if (type === 'radio') {
    // Implement createRadioElement
    element = createRadioElement(setting, { name: key });
  } else if (type === 'select') {
    element = createSelectElement(setting);
  } else if (type === 'datetime') {
    // Code for datetime input
  } else if (type === 'image') {
    // Code for image input
  } else if (type === 'button') {
    element = document.createElement('button');
    if (element instanceof HTMLButtonElement) {
      element.setAttribute('type', key);
      element.textContent = label;
      // element.disabled = true;

      form.appendChild(element);
    }
  } else if (type === 'hidden') {
    return createHiddenElement(setting);
  }

  if (element) {
    const container = document.createElement('div'); // Create container for field
    container.classList.add('form-field');
    container.appendChild(element);
    return container;
  }

  // if (element && (type === 'text' || type === 'textarea')) {
  //   element.addEventListener('input', () => {
  //     const formValid = this.isFormValid();
  //     const button = this.container.querySelector(
  //       `button[type='submit']`,
  //     ) as HTMLButtonElement;
  //     button.disabled = !formValid;
  //   });
  // }
  return;
}
