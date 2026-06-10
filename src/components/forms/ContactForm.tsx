'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { submitContactForm } from '@/lib/actions/contact';
import { contactFormSchema } from '@/lib/schemas/contact';
import type { ContactFormState } from '@/lib/schemas/contact';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';


export function ContactForm() {
  const t = useTranslations('contact.form');
  const tErrors = useTranslations('contact.errors');
  const [state, setState] = useState<ContactFormState | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [inlineErrors, setInlineErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileWidgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!turnstileReady || !window.turnstile) return;

    const widgetId = window.turnstile.render('#turnstile-widget', {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
      callback: () => {},
      'error-callback': () => {
        console.error('[Turnstile] Widget error');
      },
      'expired-callback': () => {
        console.warn('[Turnstile] Token expired');
      },
      theme: 'light',
    });

    turnstileWidgetId.current = widgetId;

    return () => {
      if (window.turnstile && widgetId) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [turnstileReady]);

  // Validate a single field on blur and set inline error
  function validateField(name: keyof typeof contactFormSchema.shape, value: string | boolean) {
    const singleField = contactFormSchema.pick({ [name]: true } as Record<typeof name, true>);
    const result = singleField.safeParse({ [name]: value });
    if (!result.success) {
      const issue = result.error.issues[0];
      const msgKey = issue.message as string;
      let msg: string;
      try {
        // Try to resolve translation key (e.g. "name.tooShort")
        msg = tErrors(msgKey as Parameters<typeof tErrors>[0]);
      } catch {
        msg = msgKey;
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

  // Server-state errors (after submit)
  const getFieldError = (field: string): string | undefined => {
    // Inline error takes priority while typing; after submit show server error
    if (inlineErrors[field]) return inlineErrors[field];
    if (!state?.errors) return undefined;
    const errorKey = state.errors[field as keyof typeof state.errors];
    if (!errorKey) return undefined;
    return tErrors(errorKey as Parameters<typeof tErrors>[0]);
  };

  const handleSubmit = (formData: FormData) => {
    // Run full local validation before submitting to catch any untouched fields
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      comment: formData.get('comment') as string,
      acceptPrivacy: formData.get('acceptPrivacy') === 'on',
    };

    const result = contactFormSchema.omit({ _honeypot: true }).safeParse(rawData);
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (!newErrors[fieldName]) {
          let msg: string;
          try {
            msg = tErrors(issue.message as Parameters<typeof tErrors>[0]);
          } catch {
            msg = issue.message;
          }
          newErrors[fieldName] = msg;
        }
      });
      setInlineErrors(newErrors);

      // Auto-scroll to first error
      const firstField = Object.keys(newErrors)[0];
      if (firstField && formRef.current) {
        const el = formRef.current.querySelector(`[name="${firstField}"]`) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.focus();
        }
      }
      return;
    }

    setInlineErrors({});
    startTransition(async () => {
      const result = await submitContactForm(state, formData);
      setState(result);
      setShowModal(true);

      // Reset Turnstile on every submit — success or failure — because the
      // token is consumed by Cloudflare on the first verification attempt.
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current);
      }

      if (result.ok) {
        const form = document.getElementById('contact-form') as HTMLFormElement | null;
        form?.reset();
      }
    });
  };

  const fieldClass = (name: string) =>
    `w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-neutral-50 disabled:cursor-not-allowed ${
      getFieldError(name)
        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
        : 'border-neutral-300 focus:border-accent-500 focus:ring-accent-100'
    }`;

  return (
    <>
      <form
        id="contact-form"
        ref={formRef}
        action={handleSubmit}
        className="space-y-5"
        noValidate
      >
        {/* Honeypot oculto */}
        <div
          aria-hidden="true"
          className="absolute opacity-0 pointer-events-none"
          style={{ position: 'absolute', left: '-9999px' }}
        >
          <label htmlFor="_honeypot">Leave this empty</label>
          <input
            type="text"
            id="_honeypot"
            name="_honeypot"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-800 mb-1.5">
            {t('name.label')}
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            maxLength={100}
            disabled={isPending}
            aria-invalid={!!getFieldError('name')}
            aria-describedby={getFieldError('name') ? 'name-error' : undefined}
            onBlur={(e) => validateField('name', e.target.value)}
            className={fieldClass('name')}
            placeholder={t('name.placeholder')}
          />
          {getFieldError('name') && (
            <p id="name-error" role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              {getFieldError('name')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-800 mb-1.5">
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
            aria-invalid={!!getFieldError('email')}
            aria-describedby={getFieldError('email') ? 'email-error' : undefined}
            onBlur={(e) => validateField('email', e.target.value)}
            className={fieldClass('email')}
            placeholder={t('email.placeholder')}
            autoComplete="email"
          />
          {getFieldError('email') && (
            <p id="email-error" role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              {getFieldError('email')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-800 mb-1.5">
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
            aria-invalid={!!getFieldError('phone')}
            aria-describedby={getFieldError('phone') ? 'phone-error' : undefined}
            onBlur={(e) => validateField('phone', e.target.value)}
            className={fieldClass('phone')}
            placeholder={t('phone.placeholder')}
            autoComplete="tel"
          />
          {getFieldError('phone') && (
            <p id="phone-error" role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              {getFieldError('phone')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-neutral-800 mb-1.5">
            {t('comment.label')}
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
          <textarea
            id="comment"
            name="comment"
            required
            rows={5}
            maxLength={2000}
            disabled={isPending}
            aria-invalid={!!getFieldError('comment')}
            aria-describedby={getFieldError('comment') ? 'comment-error' : undefined}
            onBlur={(e) => validateField('comment', e.target.value)}
            className={fieldClass('comment') + ' resize-y'}
            placeholder={t('comment.placeholder')}
          />
          {getFieldError('comment') && (
            <p id="comment-error" role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              {getFieldError('comment')}
            </p>
          )}
        </div>

        {/* Aviso de privacidad — LFPDPPP */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="acceptPrivacy"
            name="acceptPrivacy"
            required
            disabled={isPending}
            aria-invalid={!!getFieldError('acceptPrivacy')}
            aria-describedby={getFieldError('acceptPrivacy') ? 'privacy-error' : undefined}
            onChange={(e) => validateField('acceptPrivacy', e.target.checked)}
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
            <span className="text-red-500 ml-1" aria-hidden="true">*</span>
          </label>
        </div>
        {getFieldError('acceptPrivacy') && (
          <p id="privacy-error" role="alert" className="text-sm text-red-600 -mt-3 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            {getFieldError('acceptPrivacy')}
          </p>
        )}

        {/* Cloudflare Turnstile widget */}
        <div className="my-2">
          <div id="turnstile-widget" />
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
        <ResultModal
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

interface ResultModalProps {
  ok: boolean;
  errorMessage?: string;
  onClose: () => void;
}

const KNOWN_ERROR_KEYS = ['turnstile', 'rateLimit', 'email', 'unexpected'] as const;
type KnownErrorKey = typeof KNOWN_ERROR_KEYS[number];

function ResultModal({ ok, errorMessage, onClose }: ResultModalProps) {
  const t = useTranslations('contact.modal');
  const tErrors = useTranslations('contact.errors');

  function getErrorDescription(): string {
    if (!errorMessage) return t('error.description');
    const key = errorMessage.startsWith('error.') ? errorMessage.slice('error.'.length) : errorMessage;
    if ((KNOWN_ERROR_KEYS as readonly string[]).includes(key)) {
      return tErrors(key as KnownErrorKey);
    }
    return t('error.description');
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
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

          <h2 id="modal-title" className="text-2xl mb-3">
            {ok ? t('success.title') : t('error.title')}
          </h2>

          <p className="text-neutral-600 mb-6">
            {ok ? t('success.description') : getErrorDescription()}
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
