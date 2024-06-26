import {
  EventHandlerModel,
  FormBuilderOptions,
  FormFieldModel,
  FormFieldTypeModel,
  FormSettingModel,
} from './models';

import { environment } from './environments/environment';
import {
  createFormElement,
  toggleErrorMessage,
  validateInput,
} from './util.function';

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
    // if custom fields are provided
    if (options?.data) {
      this.setupForm(options, options.data);
    }
    // if custom fields not provided
    else {
      const qString =
        '?formId=' + options.formId + '&portalId=' + options.portalId;
      const URL = environment.api_url + options.formId + '.json' + qString;
      fetch(URL, {
        mode: 'cors',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((fields: FormFieldModel[]) => {
          this.setupForm(options, fields);
        })
        .catch((error) => {
          this.triggerEvent('init', { status: false, error });
          console.error(
            'There was a problem fetching or building the form:',
            error,
          );
        });
    }
  }

  private setupForm(options: FormBuilderOptions, fields: FormFieldModel[]) {
    this.settings = fields;
    const payload = Object.assign({}, options, { fields });
    this.createForm(payload);
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
    const form = document.createElement('form');
    form.id = settings.formId;
    form.setAttribute('novalidate', '');
    this.setupHiddenFields(settings, form);
    settings.fields.forEach((field) => this.createField(field, form));
    this.handleFormSubmit(form);
    this.container.appendChild(form);
    this.handleEventListner();
    this.triggerEvent('init', { status: true, form });
  }

  private submitForm(payload) {
    const URL = this.options.submitUrl
      ? this.options.submitUrl
      : environment.save_url;
    return fetch(URL, {
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
      this.saveSubmission(form);
    });
  }

  private saveSubmission(form) {
    const payload = new FormData(form);
    this.submitForm(payload)
      .then((data) => {
        form.reset();
        this.triggerEvent('afterSubmit', {
          data,
          success: true,
        });
      })
      .catch((error) => {
        this.triggerEvent('afterSubmit', {
          error,
          success: false,
        });
      });
  }

  private handleEventListner(): void {
    this.container
      .querySelectorAll('input, textarea, select')
      .forEach((field) => {
        const fieldItem = field as FormFieldTypeModel;
        field.addEventListener('input', () => this.validateField(fieldItem));
        field.addEventListener('change', () => this.validateField(fieldItem));
        field.addEventListener('blur', () => this.validateField(fieldItem));
      });
  }

  private validateForm(): boolean {
    let formValid = true;
    const list = this.container.querySelectorAll('input, textarea, select');

    list.forEach((field) => {
      const fieldItem = field as FormFieldTypeModel;
      if (!this.validateField(fieldItem)) {
        formValid = false;
      }
    });
    return formValid;
  }

  private validateField(field: FormFieldTypeModel): boolean {
    let formValid = true;
    const firstName = field.getAttribute('name');
    const settings = this.settings.find((setting) => setting.key === firstName);
    if (!settings) return true;

    const errorMessage = validateInput(field.value, settings.validations);
    toggleErrorMessage(field, errorMessage);
    if (errorMessage) {
      formValid = false;
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
