'use client';

import { useState, useTransition, useEffect } from 'react';
import Script from 'next/script';
import { useTranslations, useLocale } from 'next-intl';
import { Loader2, CheckCircle2, AlertCircle, X, Upload, FileText } from 'lucide-react';
import { submitJobApplication } from '@/lib/actions/jobApplication';
import { getLocalized } from '@/sanity/lib/localization';
import { MAX_FILE_SIZE_BYTES } from '@/lib/schemas/jobApplication';
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
  const [cvError, setCvError] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);

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
    return () => {
      if (window.turnstile && widgetId) window.turnstile.reset(widgetId);
    };
  }, [turnstileReady]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setCvFile(null);
      setCvError(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setCvError(tErrors('cv.tooLarge'));
      setCvFile(null);
      e.target.value = '';
      return;
    }
    if (file.type !== 'application/pdf') {
      setCvError(tErrors('cv.invalidType'));
      setCvFile(null);
      e.target.value = '';
      return;
    }
    setCvError(null);
    setCvFile(file);
  };

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await submitJobApplication(state, formData);
      setState(result);
      setShowModal(true);
      if (result.ok) {
        const form = document.getElementById('job-application-form') as HTMLFormElement | null;
        form?.reset();
        setCvFile(null);
        setSelectedVacancyId('spontaneous');
      }
    });
  };

  const getFieldError = (field: string): string | undefined => {
    if (!state?.errors) return undefined;
    const errorKey = state.errors[field as keyof typeof state.errors];
    if (!errorKey) return undefined;
    return tErrors(errorKey);
  };

  const inputClass =
    'w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-neutral-50 disabled:cursor-not-allowed';

  return (
    <>
      <form
        id="job-application-form"
        action={handleSubmit}
        className="space-y-6"
        noValidate
      >
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
          <label htmlFor="vacancyId" className="block text-sm font-medium text-neutral-800 mb-1.5">
            {t('vacancy.label')}
            <span className="text-accent-500" aria-hidden="true"> *</span>
          </label>
          <select
            id="vacancyId"
            name="vacancyId"
            value={selectedVacancyId}
            onChange={(e) => setSelectedVacancyId(e.target.value)}
            disabled={isPending}
            className={inputClass}
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
            <label htmlFor="customJobDescription" className="block text-sm font-medium text-neutral-800 mb-1.5">
              {t('jobDescription.label')}
            </label>
            <textarea
              id="customJobDescription"
              name="customJobDescription"
              rows={3}
              maxLength={2000}
              disabled={isPending}
              className={inputClass}
              placeholder={t('jobDescription.placeholder')}
            />
          </div>
        )}

        {/* ─── Ciudad + Área ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-neutral-800 mb-1.5">
              {t('city.label')}
              <span className="text-accent-500" aria-hidden="true"> *</span>
            </label>
            <select
              id="city"
              name="city"
              required
              disabled={isPending || (!isSpontaneous && !!selectedVacancy)}
              className={inputClass}
              defaultValue=""
            >
              <option value="" disabled>{t('city.placeholder')}</option>
              <option value="guadalajara">Guadalajara</option>
              <option value="colima">Colima</option>
            </select>
            {getFieldError('city') && (
              <p role="alert" className="mt-1.5 text-sm text-red-600">{getFieldError('city')}</p>
            )}
          </div>

          <div>
            <label htmlFor="area" className="block text-sm font-medium text-neutral-800 mb-1.5">
              {t('area.label')}
              <span className="text-accent-500" aria-hidden="true"> *</span>
            </label>
            <select
              id="area"
              name="area"
              required
              disabled={isPending || (!isSpontaneous && !!selectedVacancy)}
              className={inputClass}
              defaultValue=""
            >
              <option value="" disabled>{t('area.placeholder')}</option>
              {AREAS.map((area) => (
                <option key={area} value={area}>
                  {tAreas(area)}
                </option>
              ))}
            </select>
            {getFieldError('area') && (
              <p role="alert" className="mt-1.5 text-sm text-red-600">{getFieldError('area')}</p>
            )}
          </div>
        </div>

        {/* ─── Nombre + Apellidos ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral-800 mb-1.5">
              {t('firstName.label')}
              <span className="text-accent-500" aria-hidden="true"> *</span>
            </label>
            <input
              type="text" id="firstName" name="firstName" required maxLength={50}
              disabled={isPending} placeholder={t('firstName.placeholder')}
              className={inputClass}
            />
            {getFieldError('firstName') && (
              <p role="alert" className="mt-1.5 text-sm text-red-600">{getFieldError('firstName')}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral-800 mb-1.5">
              {t('lastName.label')}
              <span className="text-accent-500" aria-hidden="true"> *</span>
            </label>
            <input
              type="text" id="lastName" name="lastName" required maxLength={80}
              disabled={isPending} placeholder={t('lastName.placeholder')}
              className={inputClass}
            />
            {getFieldError('lastName') && (
              <p role="alert" className="mt-1.5 text-sm text-red-600">{getFieldError('lastName')}</p>
            )}
          </div>
        </div>

        {/* ─── Email + Teléfono ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-800 mb-1.5">
              {t('email.label')}
              <span className="text-accent-500" aria-hidden="true"> *</span>
            </label>
            <input
              type="email" id="email" name="email" required maxLength={150}
              disabled={isPending} autoComplete="email" placeholder={t('email.placeholder')}
              className={inputClass}
            />
            {getFieldError('email') && (
              <p role="alert" className="mt-1.5 text-sm text-red-600">{getFieldError('email')}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-800 mb-1.5">
              {t('phone.label')}
              <span className="text-accent-500" aria-hidden="true"> *</span>
            </label>
            <input
              type="tel" id="phone" name="phone" required maxLength={20}
              disabled={isPending} autoComplete="tel" placeholder={t('phone.placeholder')}
              className={inputClass}
            />
            {getFieldError('phone') && (
              <p role="alert" className="mt-1.5 text-sm text-red-600">{getFieldError('phone')}</p>
            )}
          </div>
        </div>

        {/* ─── Fecha de nacimiento ─── */}
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-neutral-800 mb-1.5">
            {t('birthDate.label')}
            <span className="text-accent-500" aria-hidden="true"> *</span>
          </label>
          <input
            type="date" id="birthDate" name="birthDate" required
            disabled={isPending} className={inputClass}
          />
          {getFieldError('birthDate') && (
            <p role="alert" className="mt-1.5 text-sm text-red-600">{getFieldError('birthDate')}</p>
          )}
        </div>

        {/* ─── Cuéntanos sobre ti ─── */}
        <div>
          <label htmlFor="aboutYou" className="block text-sm font-medium text-neutral-800 mb-1.5">
            {t('aboutYou.label')}
            <span className="text-accent-500" aria-hidden="true"> *</span>
          </label>
          <textarea
            id="aboutYou" name="aboutYou" required rows={5} maxLength={3000}
            disabled={isPending} placeholder={t('aboutYou.placeholder')}
            className={inputClass}
          />
          {getFieldError('aboutYou') && (
            <p role="alert" className="mt-1.5 text-sm text-red-600">{getFieldError('aboutYou')}</p>
          )}
        </div>

        {/* ─── Upload CV ─── */}
        <div>
          <label className="block text-sm font-medium text-neutral-800 mb-1.5">
            {t('cv.label')}
            <span className="text-accent-500" aria-hidden="true"> *</span>
          </label>
          <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 hover:border-accent-500 transition-colors">
            <input
              type="file" id="cv" name="cv" accept="application/pdf" required
              disabled={isPending} onChange={handleFileChange} className="hidden"
            />
            <label htmlFor="cv" className="cursor-pointer flex flex-col items-center gap-2">
              {cvFile ? (
                <>
                  <FileText className="w-10 h-10 text-accent-500" aria-hidden="true" />
                  <span className="text-sm text-neutral-800 font-medium">{cvFile.name}</span>
                  <span className="text-xs text-neutral-500">
                    {(cvFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10 text-neutral-400" aria-hidden="true" />
                  <span className="text-sm text-neutral-800 font-medium">{t('cv.placeholder')}</span>
                  <span className="text-xs text-neutral-500">{t('cv.hint')}</span>
                </>
              )}
            </label>
          </div>
          {(cvError ?? getFieldError('cv')) && (
            <p role="alert" className="mt-1.5 text-sm text-red-600">
              {cvError ?? getFieldError('cv')}
            </p>
          )}
        </div>

        {/* ─── Aviso de privacidad ─── */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox" id="acceptPrivacy" name="acceptPrivacy" required
            disabled={isPending}
            className="mt-1 w-4 h-4 text-accent-500 border-neutral-300 rounded focus:ring-accent-500 focus:ring-2"
          />
          <label htmlFor="acceptPrivacy" className="text-sm text-neutral-700">
            {t('privacy.label')}{' '}
            <a
              href="/aviso-de-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-600 hover:text-accent-700 underline"
            >
              {t('privacy.linkText')}
            </a>
            <span className="text-accent-500" aria-hidden="true"> *</span>
          </label>
        </div>
        {getFieldError('acceptPrivacy') && (
          <p role="alert" className="text-sm text-red-600 -mt-3">{getFieldError('acceptPrivacy')}</p>
        )}

        {/* ─── Turnstile ─── */}
        <div className="my-2">
          <div id="turnstile-widget-jobs" />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto bg-accent-500 hover:bg-accent-600 disabled:bg-accent-300 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
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
        <JobResultModal ok={state.ok} onClose={() => setShowModal(false)} />
      )}

      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={() => setTurnstileReady(true)}
      />
    </>
  );
}

function JobResultModal({ ok, onClose }: { ok: boolean; onClose: () => void }) {
  const t = useTranslations('jobBoard.modal');

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
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors"
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
          <p className="text-neutral-600 mb-6">
            {ok ? t('success.description') : t('error.description')}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="bg-accent-500 hover:bg-accent-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
