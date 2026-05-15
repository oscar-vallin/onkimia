'use client';

import { useState, useTransition, useEffect } from 'react';
import Script from 'next/script';
import { useTranslations } from 'next-intl';
import { submitContactForm } from '@/lib/actions/contact';
import type { ContactFormState } from '@/lib/schemas/contact';
import { Loader2, CheckCircle2, AlertCircle, X } from 'lucide-react';


export function ContactForm() {
  const t = useTranslations('contact.form');
  const tErrors = useTranslations('contact.errors');
  const [state, setState] = useState<ContactFormState | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [turnstileReady, setTurnstileReady] = useState(false);

  useEffect(() => {
    if (!turnstileReady || !window.turnstile) return;

    const widgetId = window.turnstile.render('#turnstile-widget', {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
      callback: () => {
        // Token se inserta automáticamente en el form via input hidden por el widget
      },
      'error-callback': () => {
        console.error('[Turnstile] Widget error');
      },
      'expired-callback': () => {
        console.warn('[Turnstile] Token expired');
      },
      theme: 'light',
    });

    return () => {
      if (window.turnstile && widgetId) {
        window.turnstile.reset(widgetId);
      }
    };
  }, [turnstileReady]);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await submitContactForm(state, formData);
      setState(result);
      setShowModal(true);

      if (result.ok) {
        const form = document.getElementById('contact-form') as HTMLFormElement | null;
        form?.reset();
      }
    });
  };

  const getFieldError = (field: string): string | undefined => {
    if (!state?.errors) return undefined;
    const errorKey = state.errors[field as keyof typeof state.errors];
    if (!errorKey) return undefined;
    return tErrors(errorKey);
  };

  return (
    <>
      <form
        id="contact-form"
        action={handleSubmit}
        className="space-y-5"
        noValidate
      >
        {/* Honeypot oculto — los bots lo llenan, humanos no */}
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
            <span className="text-accent-500" aria-hidden="true"> *</span>
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
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-neutral-50 disabled:cursor-not-allowed"
            placeholder={t('name.placeholder')}
          />
          {getFieldError('name') && (
            <p id="name-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {getFieldError('name')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-800 mb-1.5">
            {t('email.label')}
            <span className="text-accent-500" aria-hidden="true"> *</span>
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
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-neutral-50 disabled:cursor-not-allowed"
            placeholder={t('email.placeholder')}
            autoComplete="email"
          />
          {getFieldError('email') && (
            <p id="email-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {getFieldError('email')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-neutral-800 mb-1.5">
            {t('phone.label')}
            <span className="text-accent-500" aria-hidden="true"> *</span>
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
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent disabled:bg-neutral-50 disabled:cursor-not-allowed"
            placeholder={t('phone.placeholder')}
            autoComplete="tel"
          />
          {getFieldError('phone') && (
            <p id="phone-error" role="alert" className="mt-1.5 text-sm text-red-600">
              {getFieldError('phone')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-neutral-800 mb-1.5">
            {t('comment.label')}
            <span className="text-accent-500" aria-hidden="true"> *</span>
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
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-y disabled:bg-neutral-50 disabled:cursor-not-allowed"
            placeholder={t('comment.placeholder')}
          />
          {getFieldError('comment') && (
            <p id="comment-error" role="alert" className="mt-1.5 text-sm text-red-600">
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
          <p id="privacy-error" role="alert" className="text-sm text-red-600 -mt-3">
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
  onClose: () => void;
}

function ResultModal({ ok, onClose }: ResultModalProps) {
  const t = useTranslations('contact.modal');

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
