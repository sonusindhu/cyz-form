let CyzForm = (function () {
  const GET_FORM_URL = 'http://localhost:4202/';
  const SUBMIT_URL =
    '`https://apiqa.warehouseorchestrator.com/api/submitrequest`';
  function CyzForm() {
    function validateInput(input, validationRules) {
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

    function createInputElement(settings, attributes) {
      const input = document.createElement('input');
      input.setAttribute('type', settings.type);
      input.setAttribute('name', settings.key);
      for (const key in attributes) {
        input.setAttribute(key, attributes[key]);
      }
      return input;
    }

    function createTextAreaElement(settings, attributes) {
      const textarea = document.createElement('textarea');
      textarea.setAttribute('name', settings.key);
      for (const key in attributes) {
        textarea.setAttribute(key, attributes[key]);
      }
      return textarea;
    }

    function createSelectElement(values) {
      const select = document.createElement('select');
      values.forEach((val) => {
        const option = document.createElement('option');
        option.setAttribute('value', val.value);
        option.textContent = val.label;
        select.appendChild(option);
      });
      return select;
    }

    function createFormElement(setting, form) {
      const { key, label, type, values } = setting;
      let element;

      const container = document.createElement('div'); // Create container for field
      container.classList.add('form-field');

      if (type === 'text' || type === 'number') {
        element = createInputElement(setting, { placeholder: label });
      } else if (type === 'textarea') {
        element = createTextAreaElement(setting, { placeholder: label });
      } else if (type === 'checkbox') {
        element = createInputElement(setting, { placeholder: label });
      } else if (type === 'checklist') {
        // Implement createChecklistElement
      } else if (type === 'radio') {
        // Implement createRadioElement
      } else if (type === 'select') {
        element = createSelectElement(values);
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
      }

      if (element) {
        container.appendChild(element);
      }

      if (element && (type === 'text' || type === 'textarea')) {
        element.addEventListener('input', () => {
          const inputs = Array.from(
            container.querySelectorAll('input, textarea, select'),
          );
          let isValid = true;
          inputs.forEach(
            (input) => (isValid = validateInput(input, setting.validation)),
          );
          const submitButton = container.querySelector(`button[type='submit']`);
          submitButton.disabled = !isValid;
        });
      }

      return container;
    }

    async function getFormFields(options) {
      const qString =
        '?formId=' + options.formId + '&portalId=' + options.portalId;
      const URL = GET_FORM_URL + 'assets/settings.json' + qString;
      // APIURL?formId=${options.formId}&portalId=${options.portalId}
      try {
        const response = await fetch(URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return await response.json();
      } catch (error) {
        console.error(
          'There was a problem fetching or building the form:',
          error,
        );
        throw new Error('API failed');
      }
    }

    async function createForm(settings) {
      const form = document.createElement('form');
      form.setAttribute('id', settings.formId);

      settings.fields.forEach((field) => {
        const formElement = createFormElement(field, form);
        if (formElement) {
          form.appendChild(formElement);
        }
      });

      settings.selector.appendChild(form);

      return form;
    }

    async function submitForm(URL, payload) {
      return fetch(URL, {
        method: 'post',
        // body: JSON.stringify(payload),
        body: payload,
      });
    }

    function create(options) {
      let valid = false;
      let eventHandlers = {};
      let element = undefined;

      if (options.selector) {
        element =
          typeof options.selector === 'string'
            ? document.querySelector(options.selector)
            : options.selector;
      } else {
        const container = document.createElement('div');
        container.classList.add('form-container');
        if (document?.currentScript) {
          element = document.currentScript.insertAdjacentElement(
            'afterend',
            container,
          );
        }
      }

      if (!element) {
        throw new Error(`Container not found.`);
      }

      function triggerEvent(eventName, ...args) {
        const handlers = eventHandlers[eventName];
        if (handlers) {
          handlers.forEach((handler) => handler(...args));
        }
      }

      function handleSubmitEvent(form) {
        form.addEventListener('submit', ($event) => {
          $event.preventDefault();
          triggerEvent.call(this, 'beforeSubmit', form);

          // form submit code
          // const payload = {};
          // for (var [key, value] of new FormData(form).entries()) {
          //   console.log(key, value);
          //   payload[key] = value;
          // }

          const payload = new FormData(form);

          console.log(payload);
          submitForm(SUBMIT_URL, payload)
            .then((response) => {
              if (response.ok) {
                return response.json();
              }
              throw new Error('Something went wrong');
            })
            .then((data) => {
              triggerEvent.call(this, 'afterSubmit', {
                data,
                success: true,
              });
            })
            .catch((error) => {
              triggerEvent.call(this, 'afterSubmit', {
                error,
                success: false,
              });
            });
        });
      }

      const load = async () => {
        const fields = await getFormFields(options);
        const form = await createForm({
          ...options,
          fields,
          selector: element,
        });
        handleSubmitEvent.call(this, form);
      };
      load();

      function on(eventName, callback) {
        if (!eventHandlers[eventName]) {
          eventHandlers[eventName] = [];
        }
        eventHandlers[eventName].push(callback);
      }
      return {
        element,
        valid,
        options,
        on,
      };
    }

    return {
      create,
    };
  }
  return new CyzForm();
})();

window.CyzForm = CyzForm;
