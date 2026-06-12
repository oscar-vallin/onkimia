'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import Script from 'next/script';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, CheckCircle2, AlertCircle, X, Upload, FileText } from 'lucide-react';
import { submitJobApplication } from '@/lib/actions/jobApplication';
import { getLocalized } from '@/sanity/lib/localization';
import { MAX_FILE_SIZE_BYTES, jobApplicationFormSchema, validateCvFile } from '@/lib/schemas/jobApplication';
import type { JobApplicationFormState } from '@/lib/schemas/jobApplication';
import type { JobPosting } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';


const AREAS = [
  'cuentas-por-pagar',
  'facturacion',
  'tesoreria',
  'boutique',
  'cobranza',
  'cotizaciones',
  'desarrollo-organizacional',
  'servicios-generales',
  'mercadotecnia',
  'tecnologias-de-la-informacion',
  'enlace-con-aseguradoras',
  'direccion-operativa',
  'atencion-al-paciente',
  'atencion-medica',
  'enfermeria',
  'administracion',
  'sanidad-y-regulacion',
] as const;

interface JobApplicationFormProps {
  vacancies: JobPosting[];
}

export function JobApplicationForm({ vacancies }: JobApplicationFormProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('jobBoard.form');
  const tErrors = useTranslations('jobBoard.errors');
  const tAreas = useTranslations('jobBoard.areas');

  const [state, setState] = useState<JobApplicationFormState | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [selectedVacancyId, setSelectedVacancyId] = useState('spontaneous');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [inlineErrors, setInlineErrors] = useState<Record<string, string>>({});
  const [turnstileReady, setTurnstileReady] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  const isSpontaneous = selectedVacancyId === 'spontaneous';
  const selectedVacancy = vacancies.find((v) => v._id === selectedVacancyId);

  // Auto-fill city and area when a vacancy is selected
  useEffect(() => {
    if (!selectedVacancy) return;
    const citySelect = document.getElementById('city') as HTMLSelectElement | null;
    const areaSelect = document.getElementById('area') as HTMLSelectElement | null;
    if (citySelect) citySelect.value = selectedVacancy.city;
    if (areaSelect) areaSelect.value = selectedVacancy.area;
  }, [selectedVacancy]);

  useEffect(() => {
    if (!turnstileReady || !window.turnstile) return;
    const widgetId = window.turnstile.render('#turnstile-widget-jobs', {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
      theme: 'light',
    });
    turnstileWidgetId.current = widgetId;
    return () => {
      if (window.turnstile && widgetId) window.turnstile.remove(widgetId);
    };
  }, [turnstileReady]);

  // Validate a single field inline by running the full schema and extracting the relevant error
  function validateField(name: string, value: unknown) {
    // Build a minimal object with only this field to validate
    const partial = jobApplicationFormSchema.safeParse({ [name]: value });
    const fieldError = partial.success
      ? undefined
      : partial.error.issues.find((i) => i.path[0] === name);

    if (fieldError) {
      let msg: string;
      try {
        msg = tErrors(fieldError.message as Parameters<typeof tErrors>[0]);
      } catch {
        msg = fieldError.message;
      }
      setInlineErrors((prev) => ({ ...prev, [name]: msg }));
    } else {
      setInlineErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setCvFile(null);
      setInlineErrors((prev) => { const n = { ...prev }; delete n.cv; return n; });
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setInlineErrors((prev) => ({ ...prev, cv: tErrors('cv.tooLarge') }));
      setCvFile(null);
      e.target.value = '';
      return;
    }
    if (file.type !== 'application/pdf') {
      setInlineErrors((prev) => ({ ...prev, cv: tErrors('cv.invalidType') }));
      setCvFile(null);
      e.target.value = '';
      return;
    }
    setInlineErrors((prev) => { const n = { ...prev }; delete n.cv; return n; });
    setCvFile(file);
  };

  // Merge server errors with inline errors (inline takes priority)
  const getFieldError = (field: string): string | undefined => {
    if (inlineErrors[field]) return inlineErrors[field];
    if (!state?.errors) return undefined;
    const errorKey = state.errors[field as keyof typeof state.errors];
    if (!errorKey) return undefined;
    return tErrors(errorKey as Parameters<typeof tErrors>[0]);
  };

  const handleSubmit = (formData: FormData) => {
    // Client-side pre-submit validation
    const cvErrorKey = validateCvFile(cvFile);
    const rawData = {
      vacancyId: formData.get('vacancyId') as string,
      customJobDescription: (formData.get('customJobDescription') as string) || undefined,
      city: formData.get('city') as string,
      area: formData.get('area') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      birthDate: formData.get('birthDate') as string,
      aboutYou: formData.get('aboutYou') as string,
      acceptPrivacy: formData.get('acceptPrivacy') === 'on',
    };

    const result = jobApplicationFormSchema.omit({ _honeypot: true }).safeParse(rawData);
    const newErrors: Record<string, string> = {};

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!newErrors[field]) {
          let msg: string;
          try {
            msg = tErrors(issue.message as Parameters<typeof tErrors>[0]);
          } catch {
            msg = issue.message;
          }
          newErrors[field] = msg;
        }
      });
    }

    if (cvErrorKey) {
      newErrors.cv = tErrors(cvErrorKey as Parameters<typeof tErrors>[0]);
    }

    if (Object.keys(newErrors).length > 0) {
      setInlineErrors(newErrors);

      // Auto-scroll to first error
      const firstField = Object.keys(newErrors)[0];
      if (firstField && formRef.current) {
        const el = formRef.current.querySelector(
          `[name="${firstField}"], [id="${firstField}-trigger"]`
        ) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }
      return;
    }

    setInlineErrors({});
    startTransition(async () => {
      const result = await submitJobApplication(state, formData);
      setState(result);
      setShowModal(true);

      // Reset Turnstile on every submit — success or failure — because the
      // token is consumed by Cloudflare on the first verification attempt.
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current);
      }

      if (result.ok) {
        const form = document.getElementById('job-application-form') as HTMLFormElement | null;
        form?.reset();
        setCvFile(null);
        setSelectedVacancyId('spontaneous');
      }
    });
  };

  const fieldClass = (name: string) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-cream disabled:cursor-not-allowed ${
      getFieldError(name)
        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
        : 'border-line focus:border-teal focus:ring-teal/10'
    }`;

  const errorMsg = (name: string, id: string) => {
    const err = getFieldError(name);
    if (!err) return null;
    return (
      <p id={id} role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
        {err}
      </p>
    );
  };

  return (
    <>
      <form
        id="job-application-form"
        ref={formRef}
        action={handleSubmit}
        className="space-y-6"
        noValidate
      >
        {/* Nota de campos requeridos */}
        <p className="text-sm text-gray-soft">
          <span className="text-red-500">*</span> {t('requiredFieldsNote')}
        </p>

        {/* Honeypot */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
          <label htmlFor="_honeypot_jobs">Leave empty</label>
          <input
            type="text"
            id="_honeypot_jobs"
            name="_honeypot"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* ─── Vacante ─── */}
        <div>
          <label htmlFor="vacancyId" className="block text-sm font-medium text-ink mb-1.5">
            {t('vacancy.label')}
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <select
            id="vacancyId"
            name="vacancyId"
            value={selectedVacancyId}
            onChange={(e) => {
              setSelectedVacancyId(e.target.value);
              validateField('vacancyId', e.target.value);
            }}
            disabled={isPending}
            className={fieldClass('vacancyId')}
          >
            <option value="spontaneous">{t('vacancy.spontaneous')}</option>
            {vacancies.length > 0 && (
              <optgroup label={t('vacancy.activeGroup')}>
                {vacancies.map((v) => (
                  <option key={v._id} value={v._id}>
                    {getLocalized(v.title, locale)} — {v.city === 'guadalajara' ? 'GDL' : 'Colima'}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* ─── Descripción libre (solo espontánea) ─── */}
        {isSpontaneous && (
          <div>
            <label htmlFor="customJobDescription" className="block text-sm font-medium text-ink mb-1.5">
              {t('jobDescription.label')}
            </label>
            <textarea
              id="customJobDescription"
              name="customJobDescription"
              rows={3}
              maxLength={2000}
              disabled={isPending}
              className={fieldClass('customJobDescription')}
              placeholder={t('jobDescription.placeholder')}
            />
          </div>
        )}

        {/* ─── Ciudad + Área ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-ink mb-1.5">
              {t('city.label')}
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            </label>
            <select
              id="city"
              name="city"
              required
              disabled={isPending || (!isSpontaneous && !!selectedVacancy)}
              aria-invalid={!!getFieldError('city')}
              aria-describedby={getFieldError('city') ? 'city-error' : undefined}
              onChange={(e) => validateField('city', e.target.value)}
              className={fieldClass('city')}
              defaultValue=""
            >
              <option value="" disabled>{t('city.placeholder')}</option>
              <option value="guadalajara">Guadalajara</option>
              <option value="colima">Colima</option>
            </select>
            {errorMsg('city', 'city-error')}
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-ink mb-1.5">
              {t('area.label')}
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            </label>
            <select
              id="area"
              name="area"
              required
              disabled={isPending || (!isSpontaneous && !!selectedVacancy)}
              aria-invalid={!!getFieldError('area')}
              aria-describedby={getFieldError('area') ? 'area-error' : undefined}
              onChange={(e) => validateField('area', e.target.value)}
              className={fieldClass('area')}
              defaultValue=""
            >
              <option value="" disabled>{t('area.placeholder')}</option>
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {tAreas(area)}
                </option>
              ))}
            </select>
            {errorMsg('area', 'area-error')}
          </div>
        </div>

        {/* ─── Nombre + Apellidos ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-ink mb-1.5">
              {t('firstName.label')}
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              maxLength={50}
              disabled={isPending}
              placeholder={t('firstName.placeholder')}
              aria-invalid={!!getFieldError('firstName')}
              aria-describedby={getFieldError('firstName') ? 'firstName-error' : undefined}
              onBlur={(e) => validateField('firstName', e.target.value)}
              className={fieldClass('firstName')}
            />
            {errorMsg('firstName', 'firstName-error')}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-ink mb-1.5">
              {t('lastName.label')}
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              maxLength={80}
              disabled={isPending}
              placeholder={t('lastName.placeholder')}
              aria-invalid={!!getFieldError('lastName')}
              aria-describedby={getFieldError('lastName') ? 'lastName-error' : undefined}
              onBlur={(e) => validateField('lastName', e.target.value)}
              className={fieldClass('lastName')}
            />
            {errorMsg('lastName', 'lastName-error')}
          </div>
        </div>

        {/* ─── Email + Teléfono ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
              {t('email.label')}
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              maxLength={150}
              disabled={isPending}
              autoComplete="email"
              placeholder={t('email.placeholder')}
              aria-invalid={!!getFieldError('email')}
              aria-describedby={getFieldError('email') ? 'email-error' : undefined}
              onBlur={(e) => validateField('email', e.target.value)}
              className={fieldClass('email')}
            />
            {errorMsg('email', 'email-error')}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1.5">
              {t('phone.label')}
              <span className="text-red-500 ml-1" aria-hidden="true">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              maxLength={20}
              disabled={isPending}
              autoComplete="tel"
              placeholder={t('phone.placeholder')}
              aria-invalid={!!getFieldError('phone')}
              aria-describedby={getFieldError('phone') ? 'phone-error' : undefined}
              onBlur={(e) => validateField('phone', e.target.value)}
              className={fieldClass('phone')}
            />
            {errorMsg('phone', 'phone-error')}
          </div>
        </div>

        {/* ─── Fecha de nacimiento ─── */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-ink mb-1.5">
            {t('birthDate.label')}
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <input
            type="date"
            id="birthDate"
            name="birthDate"
            required
            disabled={isPending}
            aria-invalid={!!getFieldError('birthDate')}
            aria-describedby={getFieldError('birthDate') ? 'birthDate-error' : undefined}
            onBlur={(e) => validateField('birthDate', e.target.value)}
            className={fieldClass('birthDate')}
          />
          {errorMsg('birthDate', 'birthDate-error')}
        </div>

        {/* ─── Cuéntanos sobre ti ─── */}
        <div>
          <label htmlFor="aboutYou" className="block text-sm font-medium text-ink mb-1.5">
            {t('aboutYou.label')}
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <textarea
            id="aboutYou"
            name="aboutYou"
            required
            rows={5}
            maxLength={3000}
            disabled={isPending}
            placeholder={t('aboutYou.placeholder')}
            aria-invalid={!!getFieldError('aboutYou')}
            aria-describedby={getFieldError('aboutYou') ? 'aboutYou-error' : undefined}
            onBlur={(e) => validateField('aboutYou', e.target.value)}
            className={fieldClass('aboutYou') + ' resize-y'}
          />
          {errorMsg('aboutYou', 'aboutYou-error')}
        </div>

        {/* ─── Upload CV ─── */}
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">
            {t('cv.label')}
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
              getFieldError('cv')
                ? 'border-red-400 bg-red-50'
                : 'border-line hover:border-teal'
            }`}
          >
            <input
              type="file"
              id="cv"
              name="cv"
              accept="application/pdf"
              required
              disabled={isPending}
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="cv" className="cursor-pointer flex flex-col items-center gap-2">
              {cvFile ? (
                <>
                  <FileText className="w-10 h-10 text-teal" aria-hidden="true" />
                  <span className="text-sm text-ink font-medium">{cvFile.name}</span>
                  <span className="text-xs text-gray-soft">
                    {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-gray-soft" aria-hidden="true" />
                  <span className="text-sm text-ink font-medium">{t('cv.placeholder')}</span>
                  <span className="text-xs text-gray-soft">{t('cv.hint')}</span>
                </>
              )}
            </label>
          </div>
          {getFieldError('cv') && (
            <p role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              {getFieldError('cv')}
            </p>
          )}
        </div>

        {/* ─── Aviso de privacidad ─── */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="acceptPrivacy"
            name="acceptPrivacy"
            required
            disabled={isPending}
            aria-invalid={!!getFieldError('acceptPrivacy')}
            aria-describedby={getFieldError('acceptPrivacy') ? 'privacy-jobs-error' : undefined}
            onChange={(e) => validateField('acceptPrivacy', e.target.checked)}
            className="mt-1 w-4 h-4 text-teal border-line rounded focus:ring-teal focus:ring-2"
          />
          <label htmlFor="acceptPrivacy" className="text-sm text-gray-warm">
            {t('privacy.label')}{' '}
            <a
              href="/aviso-de-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:text-teal-soft underline"
            >
              {t('privacy.linkText')}
            </a>
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
        </div>
        {getFieldError('acceptPrivacy') && (
          <p id="privacy-jobs-error" role="alert" className="text-sm text-red-600 -mt-3 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            {getFieldError('acceptPrivacy')}
          </p>
        )}

        {/* ─── Turnstile ─── */}
        <div className="my-2">
          <div id="turnstile-widget-jobs" />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto bg-teal hover:bg-teal-soft disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>{t('submit.sending')}</span>
            </>
          ) : (
            <span>{t('submit.label')}</span>
          )}
        </button>
      </form>

      {showModal && state && (
        <JobResultModal
          ok={state.ok}
          errorMessage={state.message}
          onClose={() => setShowModal(false)}
        />
      )}

      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={() => setTurnstileReady(true)}
      />
    </>
  );
}

const KNOWN_JOB_ERROR_KEYS = ['turnstile', 'rateLimit', 'email', 'unexpected'] as const;
type KnownJobErrorKey = typeof KNOWN_JOB_ERROR_KEYS[number];

function JobResultModal({
  ok,
  errorMessage,
  onClose,
}: {
  ok: boolean;
  errorMessage?: string;
  onClose: () => void;
}) {
  const t = useTranslations('jobBoard.modal');
  const tErrors = useTranslations('jobBoard.errors');

  function getErrorDescription(): string {
    if (!errorMessage) return t('error.description');
    const key = errorMessage.startsWith('error.') ? errorMessage.slice('error.'.length) : errorMessage;
    if ((KNOWN_JOB_ERROR_KEYS as readonly string[]).includes(key)) {
      return tErrors(key as KnownJobErrorKey);
    }
    return t('error.description');
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t('close')}
          className="absolute top-4 right-4 text-gray-soft hover:text-ink transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          {ok ? (
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" aria-hidden="true" />
          )}
          <h2 id="job-modal-title" className="text-2xl mb-3">
            {ok ? t('success.title') : t('error.title')}
          </h2>
          <p className="text-gray-warm mb-6">
            {ok ? t('success.description') : getErrorDescription()}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="bg-teal hover:bg-teal-soft text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
