// lib/odoo/jobs.ts

import { odooCreate } from "./client";

export interface JobPayload {
  name:     string;
  email:    string;
  phone?:   string;
  message?: string;
}

export async function createApplicant(data: JobPayload): Promise<number> {
  return odooCreate("hr.applicant", {
    partner_name:  data.name,
    email_from:    data.email,
    partner_phone: data.phone   ?? "",
    description:   data.message ?? "",
  });
}