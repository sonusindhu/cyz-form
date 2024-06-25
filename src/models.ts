export interface FormSettingModel extends FormBuilderOptions {
  fields: FormFieldModel[];
}

export interface FieldAttributeModel {
  [key: string]: string;
}

export interface FormBuilderOptions {
  selector: HTMLElement | string | undefined;
  formId: string;
  portalId: string;

  data?: FormFieldModel[];
  submitUrl?: string;
}

export interface DropdownItemModel {
  label: string;
  value: string;
}

export interface FormFieldModel {
  key: string;
  label: string;
  type: string;
  defaultValue?: string;
  values?: DropdownItemModel[];
  validations?: InputValidationModel[];
}

export type FunctionType = (...args: unknown[]) => unknown;

export interface EventHandlerModel {
  [eventName: string]: FunctionType[];
}

export interface SelectOptionModel {
  label: string;
  value: string;
}

export interface InputValidationModel {
  key: string;
  value: string;

  message?: string;
}

export type FormFieldTypeModel =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;
