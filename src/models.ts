export interface FormSettingModel extends FormBuilderOptions {
  fields: FormFieldModel[];
}

export interface FormBuilderOptions {
  selector: HTMLElement | string | undefined;
  formId: string;
  portalId: string;
}

export interface FormSettingModelValue {
  label: string;
  value: string;
}

export interface FormFieldModel {
  key: string;
  label: string;
  type: string;
  defaultValue?: string;
  values?: FormSettingModelValue[];
  validations?: InputValidationModel[];
}

export interface ValidationRulesModel {
  required: boolean;
  min: number;
  max: number;
  pattern: RegExp | string;
}

export type FunctionType = (...args: any[]) => unknown;

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
}
