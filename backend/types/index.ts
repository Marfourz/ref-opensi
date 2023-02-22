export type NotificationRequestHeaders = {
  api_key?: string;
};

export enum NotificationProviderList {
  bomboo = 'bomboo',
}

export class Payload<Data, Options> {
  data: Data;
  options?: Options;
  provider?: NotificationProviderList;
}

export class PagiationPayload<Data> {
  data: Data;
  count?: number;
}

export interface ConsumerEmailForm {
  email: string;
  object: string;
  body: string;
  sender: string;
}

export type EmailPayload = Payload<ConsumerEmailForm, any>;

export type SmsPayload = Payload<ConsumerSmsForm, any>;

export interface ContactInfo {
  email: string;
  name?: string;
}

export type EmailContact = ContactInfo[] | string;

export interface ConsumerSmsForm {
  sender: string;
  body: string;
  to: string;
}

export interface SmsContact {
  msisdn: string;
  country_code?: string;
}

export interface ConsumerMailMessage {
  theme?: any;
  subject?: string;
  title: string;
  name?: string;
  greeting?: string;
  salutation?: string;
  intro?: string | string[];
  outro?: string | string[];
  action?: ConsumerIntructionForm | ConsumerIntructionForm[]
}

export interface ConsumerIntructionForm {
  instructions: string;
  text: string;
  link: string;
  color?: string;
}
