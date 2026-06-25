interface AppBannerProps {
  title: string;
  description: string;
  appStoreLabel: string;
  googlePlayLabel: string;
}

export function AppBanner({ title, description, appStoreLabel, googlePlayLabel }: AppBannerProps) {
  return (
    <section className="bg-gray-50 py-10 md:py-14">
      <div className="container-onkimia">
        <div className="bg-white border border-black/[0.07] rounded-3xl px-8 py-7 md:px-10 md:py-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">

          {/* Icon */}
          <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="font-serif text-xl text-primary mb-1">{title}</p>
            <p className="text-secondary text-sm leading-relaxed max-w-xl">{description}</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <a
              href="https://apps.apple.com/mx/app/onkimia/id6446001299"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-primary text-white text-sm font-medium px-5 py-3 rounded-xl hover:bg-primary/85 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={`Onkimia en ${appStoreLabel}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
              </svg>
              {appStoreLabel}
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=mx.com.center_onkimia&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-primary text-white text-sm font-medium px-5 py-3 rounded-xl hover:bg-primary/85 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              aria-label={`Onkimia en ${googlePlayLabel}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.18 23.76c.3.17.65.19.98.07l13.3-7.68-2.83-2.83-11.45 10.44zM.5 1.41C.19 1.74 0 2.24 0 2.9v18.2c0 .66.19 1.16.51 1.49l.08.08L10.36 12.7v-.23L.58 1.33l-.08.08zM20.49 10.46l-2.89-1.67-3.16 3.16 3.16 3.16 2.91-1.68c.83-.48.83-1.26-.02-1.97zM3.18.24L16.47 7.92l-2.83 2.83L2.2.31C2.53.19 2.88.07 3.18.24z"/>
              </svg>
              {googlePlayLabel}
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
