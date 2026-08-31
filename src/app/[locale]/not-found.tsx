import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Home, ArrowLeft } from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Número 404 grande */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-cream-2 leading-none select-none">
            404
          </h1>
        </div>

        {/* Mensaje principal */}
        <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
          {t('title')}
        </h2>

        <p className="text-lg text-gray-warm mb-8 max-w-md mx-auto leading-relaxed">
          {t('description')}
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-teal hover:bg-teal-soft text-white font-medium px-6 py-3 rounded-md transition-colors"
          >
            <Home className="w-5 h-5" />
            {t('goHome')}
          </Link>
          
          <BackButton className="inline-flex items-center gap-2 bg-cream hover:bg-cream-2 text-ink font-medium px-6 py-3 rounded-md transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {t('goBack')}
          </BackButton>
        </div>

        {/* Enlaces útiles */}
        <div className="mt-12 pt-8 border-t border-line">
          <p className="text-sm text-gray-soft mb-4">{t('helpfulLinks')}</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link
              href="/nosotros"
              className="text-teal hover:text-teal-soft hover:underline"
            >
              {t('about')}
            </Link>
            <Link
              href="/servicios"
              className="text-teal hover:text-teal-soft hover:underline"
            >
              {t('services')}
            </Link>
            <Link
              href="/contacto"
              className="text-teal hover:text-teal-soft hover:underline"
            >
              {t('contact')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
