// lib/odoo/contact.ts

import { odooCreate } from './client';

export interface ContactPayload {
  name:    string;
  email:   string;
  phone:   string;
  comment: string;
}

export async function createLead(data: ContactPayload): Promise<number> {
  return odooCreate('crm.lead', {
    name:         `Web — ${data.name}`,
    contact_name: data.name,
    email_from:   data.email,
    phone:        data.phone,
    description:  data.comment,
    type:         'lead',
  });
}