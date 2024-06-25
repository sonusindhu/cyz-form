import {
  DropdownItemModel,
  FieldAttributeModel,
  FormFieldModel,
  FormFieldTypeModel,
  InputValidationModel,
  SelectOptionModel,
} from './models';

export function getUniqueId() {
  return (Math.random() + 1).toString(36).substring(7);
}

export function createInputElement(
  settings: FormFieldModel,
  attributes: FieldAttributeModel,
) {
  const input = document.createElement('input');
  input.name = settings.key;
  input.setAttribute('type', settings.type);
  for (const key in attributes) {
    input.setAttribute(key, attributes[key]);
  }
  setValidations(input, settings.validations);
  return input;
}

export function createHiddenElement(settings: FormFieldModel) {
  const input = document.createElement('input');
  input.name = settings.key;
  input.value = settings.defaultValue ? settings.defaultValue : '';
  input.setAttribute('type', 'hidden');
  return input;
}

export function createCheckboxElement(
  settings: FormFieldModel,
  attributes: FieldAttributeModel,
) {
  const input = document.createElement('input');
  input.name = settings.key;
  input.id = getUniqueId();
  input.setAttribute('type', settings.type);
  for (const key in attributes) {
    input.setAttribute(key, attributes[key]);
  }
  setValidations(input, settings.validations);
  const label = document.createElement('label');
  label.setAttribute('for', input.id);
  label.appendChild(input);
  label.append(settings.label);
  return label;
}

export function createTextAreaElement(
  settings: FormFieldModel,
  attributes: FieldAttributeModel,
): HTMLTextAreaElement {
  const textarea = document.createElement('textarea');
  textarea.name = settings.key;
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
  select.name = settings.key;
  setOption(select, { value: '', label: '--Select ' + settings.label + '--' });
  settings.values?.forEach((item) => setOption(select, item));
  return select;
}

export function setOption(
  select: HTMLSelectElement,
  item: SelectOptionModel,
): void {
  const option = document.createElement('option');
  option.value = item.value;
  option.textContent = item.label;
  select.appendChild(option);
}

export function createRadioElement(
  settings: FormFieldModel,
  attributes: FieldAttributeModel,
): HTMLDivElement {
  const radioContainer = document.createElement('div');
  radioContainer.classList.add('radio-group');

  const mainlabel = document.createElement('label');
  mainlabel.textContent = settings.label;
  radioContainer.appendChild(mainlabel);

  settings.values?.forEach((val, index) => {
    const input = document.createElement('input');
    input.id = `${settings.key}-${index}`;
    input.name = settings.key;
    input.value = val.value;
    input.setAttribute('type', 'radio');

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
  input.name = settings.key;
  input.setAttribute('type', settings.key);
  input.textContent = settings.label;
  return input;
}

export function validateInput(
  inputValue,
  validations?: InputValidationModel[],
): string | null {
  if (!validations || validations.length === 0) return null;

  for (const validation of validations) {
    const { key, value, message } = validation;
    let msg: string | null = null;

    switch (key) {
      case 'required':
        if (value === 'true' && !inputValue.trim()) {
          msg = message || 'This field is required.';
        }
        break;
      case 'maxlength':
        if (inputValue.length > parseInt(value)) {
          msg = message || `Maximum length is ${value} characters.`;
        }
        break;
      case 'pattern': {
        const regex = new RegExp(value);
        if (!regex.test(inputValue)) {
          msg = message || 'Please enter a valid input.';
        }
        break;
      }
      case 'min':
        if (
          !isNaN(parseFloat(inputValue)) &&
          parseFloat(inputValue) < parseFloat(value)
        ) {
          msg = message || `Minimum value is ${value}.`;
        }
        break;
      case 'max':
        if (
          !isNaN(parseFloat(inputValue)) &&
          parseFloat(inputValue) > parseFloat(value)
        ) {
          msg = message || `Maximum value is ${value}.`;
        }
        break;
      /* Add more validation rules as needed */
    }

    if (msg) {
      return msg;
    }
  }

  return null;
}
export function setValidations(
  input: FormFieldTypeModel,
  validations?: InputValidationModel[],
) {
  if (validations && validations.length > 0) {
    for (let i = 0; i < validations.length; i++) {
      const item = validations[i];
      input.setAttribute(item.key, item.value);
    }
  }
}

export function createCustomOptions(
  settings: DropdownItemModel[],
  selectedValue?,
) {
  const optionsItem = document.createElement('div');
  optionsItem.classList.add('select-items');
  settings.forEach((option) => {
    const item = document.createElement('div');
    item.classList.add('select-item');
    if (selectedValue == option.value) {
      item.classList.add('active');
    }
    item.textContent = option.label;
    item.dataset.value = option.value;
    optionsItem.appendChild(item);
  });
  return optionsItem;
}

export function createCustomSelect(settings: FormFieldModel) {
  // create container for custom select
  const customSelect = document.createElement('div');
  customSelect.classList.add('custom-select');

  // create a select
  const selected = document.createElement('div');
  selected.classList.add('select-selected');
  selected.textContent = settings.label;

  // create select item container
  const items = document.createElement('div');
  items.classList.add('select-items-content');

  // create searchable input for select item
  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.classList.add('select-search');
  searchInput.setAttribute('placeholder', 'Search...');
  items.appendChild(searchInput);

  // create hidden element
  const hiddenInput = createHiddenElement(settings);
  // setup validation
  setValidations(hiddenInput, settings.validations);
  customSelect.appendChild(hiddenInput);

  // create custom select item list
  if (settings.values) {
    const optionItem = createCustomOptions(settings.values);
    optionEventLister(optionItem, items, selected, hiddenInput);
    items.appendChild(optionItem);
  }

  selected.addEventListener('click', function (e) {
    e.stopPropagation();
    e.preventDefault();
    items.classList.toggle('show');
    function handleDocumentClick($event) {
      const target = $event.target as Element;
      if (items.classList.contains('show') && !items.contains(target)) {
        searchInput.value = '';
        items.classList.remove('show');
        hiddenInput.dispatchEvent(new Event('change'));
        handleItemSearch(items, searchInput, settings, hiddenInput, selected);
      }
    }
    if (items.classList.contains('show')) {
      document.addEventListener('click', handleDocumentClick);
    } else {
      searchInput.value = '';
      handleItemSearch(items, searchInput, settings, hiddenInput, selected);
      hiddenInput.dispatchEvent(new Event('change'));
    }
  });

  searchInput.addEventListener('input', () =>
    handleItemSearch(items, searchInput, settings, hiddenInput, selected),
  );
  customSelect.appendChild(selected);
  customSelect.appendChild(items);
  return customSelect;
}

function handleItemSearch(
  items: HTMLDivElement,
  searchInput: HTMLInputElement,
  settings: FormFieldModel,
  hiddenInput: HTMLInputElement,
  selected: HTMLDivElement,
) {
  items.querySelector('.select-items')?.remove();
  const searchText = searchInput.value.toLowerCase();
  let list = settings.values;
  if (searchText) {
    list = list?.filter((i) => i.label.toLowerCase().includes(searchText));
  }
  if (list) {
    const optionItem = createCustomOptions(list, hiddenInput.value);
    optionEventLister(optionItem, items, selected, hiddenInput);
    items.appendChild(optionItem);
  }
}

export function optionEventLister(
  optionItem: HTMLDivElement,
  items: HTMLDivElement,
  selected: HTMLDivElement,
  hiddenInput: HTMLInputElement,
) {
  optionItem.addEventListener('click', function ($event) {
    items.querySelector('.select-item.active')?.classList.remove('active');
    const selectedItem = $event.target as HTMLElement;
    selectedItem.classList.add('active');
    selected.textContent = selectedItem.textContent;
    const selectedValue = selectedItem.dataset.value;
    hiddenInput.value = selectedValue ? selectedValue : '';
    items.classList.remove('show');
    hiddenInput.dispatchEvent(new Event('change'));
  });
}

export function createFormElement(
  setting: FormFieldModel,
): HTMLElement | undefined {
  const { key, label, type } = setting;
  let element!: Element;

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
    case 'custom-select':
      element = createCustomSelect(setting);
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

export function toggleErrorMessage(
  field: FormFieldTypeModel,
  errorMessage: string | null,
) {
  const formField = field.closest('.form-field');
  formField?.querySelector('.error')?.remove();
  if (errorMessage) {
    const errorElement = document.createElement('div');
    errorElement.classList.add('error');
    errorElement.style.color = '#f00';
    errorElement.textContent = errorMessage;
    formField?.appendChild(errorElement);
  }
}
