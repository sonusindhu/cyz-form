import {
  EventHandlerModel,
  FormBuilderOptions,
  FormFieldModel,
  FormSettingModel,
} from './models';

import { environment } from './environments/environment';
import { createFormElement, validateInput } from './util.function';

export class FormBuilder {
  private container: HTMLElement;
  private eventHandlers: EventHandlerModel = {};

  private settings!: FormFieldModel[];

  constructor(
    private element: string | HTMLElement,
    private options: FormBuilderOptions,
  ) {
    if (typeof element === 'string') {
      this.container = document.querySelector(element) as HTMLElement;
    } else {
      this.container = element;
    }

    if (!this.container) {
      throw new Error(`Container not found.`);
    }

    this.buildForm(options);
  }

  static create(options: FormBuilderOptions) {
    let element: HTMLElement | undefined = undefined;
    if (options.selector) {
      element =
        typeof options.selector === 'string'
          ? (document.querySelector(options.selector) as HTMLElement)
          : options.selector;
    } else {
      const container = document.createElement('div');
      container.classList.add('form-container');
      if (document?.currentScript) {
        element = document.currentScript.insertAdjacentElement(
          'afterend',
          container,
        ) as HTMLElement;
      }
    }

    if (!element) {
      throw new Error(`Container not found.`);
    }

    const form = new FormBuilder(element, options);
    return {
      container: form.container,
      options: form.options,
      on: form.on.bind(form),
    };
  }

  private buildForm(options: FormBuilderOptions): void {
    const qString =
      '?formId=' + options.formId + '&portalId=' + options.portalId;
    const URL =
      environment.api_url + 'assets/' + options.formId + '.json' + qString;
    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((fields: FormFieldModel[]) => {
        this.settings = fields;
        const payload = Object.assign({}, options, { fields });
        this.createForm(payload);
      })
      .catch((error) => {
        this.triggerEvent('init', { status: false, error });
        console.error(
          'There was a problem fetching or building the form:',
          error,
        );
      });
  }

  private setupHiddenFields(settings: FormSettingModel, form: HTMLFormElement) {
    const formId = {
      type: 'hidden',
      key: 'formId',
      label: 'Form Id',
      defaultValue: settings.formId,
    };
    this.createField(formId, form);

    const tenantId = {
      type: 'hidden',
      key: 'tenantId',
      label: 'Tenant Id',
      defaultValue: settings.portalId,
    };
    this.createField(tenantId, form);
  }

  private createField(field: FormFieldModel, form: HTMLFormElement) {
    const formElement = createFormElement(field);
    if (formElement) {
      form.appendChild(formElement);
    }
  }

  private createForm(settings: FormSettingModel) {
    const form = document.createElement('form') as HTMLFormElement;
    form.setAttribute('id', settings.formId);
    form.setAttribute('novalidate', '');
    this.setupHiddenFields(settings, form);
    settings.fields.forEach((field) => this.createField(field, form));
    this.handleFormSubmit(form);
    this.container.appendChild(form);
    this.handleEventListner();
    this.triggerEvent.call(this, 'init', { status: false, form });
  }

  private submitForm(payload) {
    return fetch(environment.save_url, {
      method: 'post',
      body: payload,
    }).then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Something went wrong');
    });
  }

  private handleFormSubmit(form: HTMLFormElement) {
    form.addEventListener('submit', ($event) => {
      $event.preventDefault();
      const formValid = this.validateForm();
      if (!formValid) return;

      this.triggerEvent('beforeSubmit', form);

      /* form submit code */
      const payload = new FormData(form);
      this.submitForm(payload)
        .then((data) => {
          form.reset();
          this.triggerEvent.call(this, 'afterSubmit', {
            data,
            success: true,
          });
        })
        .catch((error) => {
          this.triggerEvent.call(this, 'afterSubmit', {
            error,
            success: false,
          });
        });
    });
  }

  private handleEventListner(): void {
    this.container
      .querySelectorAll('input, textarea, select')
      .forEach((field) => {
        const fieldItem = field as
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement;
        field.addEventListener('input', () => this.validateField(fieldItem));
        field.addEventListener('change', () => this.validateField(fieldItem));
        field.addEventListener('blur', () => this.validateField(fieldItem));
      });
  }

  private validateForm(): boolean {
    let formValid = true;
    const list = this.container.querySelectorAll('input, textarea, select');

    list.forEach((field) => {
      const fieldItem = field as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement;
      if (!this.validateField(fieldItem)) {
        formValid = false;
      }
    });
    return formValid;
  }

  validateField(
    field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  ): boolean {
    let formValid = true;
    const firstName = field.getAttribute('name');
    const settings = this.settings.find((setting) => setting.key === firstName);
    if (!settings) return true;

    const errorMessage = validateInput(field.value, settings.validations);
    if (errorMessage) {
      formValid = false;
      const hasError = field.parentElement?.querySelector('.error');
      if (!hasError) {
        const errorElement = document.createElement('div');
        errorElement.classList.add('error');
        errorElement.style.color = '#f00';
        errorElement.textContent = errorMessage;
        field.parentElement?.appendChild(errorElement);
      }
    } else {
      field.parentElement?.querySelector('.error')?.remove();
    }
    return formValid;
  }

  private triggerEvent(eventName: string, ...args: unknown[]): void {
    const handlers = this.eventHandlers[eventName];
    if (handlers) {
      handlers.forEach((handler) => handler(...args));
    }
  }

  private on(
    eventName: string,
    callback: (...args: unknown[]) => unknown,
  ): void {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(callback);
  }
}
