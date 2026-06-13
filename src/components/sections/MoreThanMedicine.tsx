import Link from 'next/link';

interface Service {
  title: string;
  link?: string;
  linkText?: string;
}

interface MoreThanMedicineProps {
  titleLine1: string;
  titleUnderlined: string;
  titleSuffix: string;
  description: string;
  services: Service[];
}

export function MoreThanMedicine({
  titleLine1,
  titleUnderlined,
  titleSuffix,
  description,
  services,
}: MoreThanMedicineProps) {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-onkimia">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: title + description */}
          <div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-tight mb-8">
              {titleLine1}{' '}
              <em className="italic text-teal-soft not-italic">{titleUnderlined}</em>
              {titleSuffix && ` ${titleSuffix}`}
            </h2>
            <p className="text-gray-warm text-lg leading-relaxed">{description}</p>
          </div>

          {/* Right: services list */}
          {services.length > 0 && (
            <ul className="space-y-1">
              {services.map((service, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 py-3 border-b border-line last:border-b-0"
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-teal flex-shrink-0 mt-2.5"
                    aria-hidden="true"
                  />
                  <span className="text-ink text-base leading-relaxed">
                    {service.title}
                    {service.link && service.linkText && (
                      <>
                        {' '}
                        <Link
                          href={service.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-teal hover:text-teal-soft underline underline-offset-2 transition-colors"
                        >
                          {service.linkText}
                        </Link>
                      </>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
