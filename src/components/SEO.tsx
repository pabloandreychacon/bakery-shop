import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export function SEO({
  title,
  description,
  keywords,
  image = '/favicon.png',
  url,
}: SEOProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const baseTitle = 'Panadería Ávila';
    const finalTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    const defaultDescription = 'Creando productos de panadería artesanales con pasión y tradición desde 2010';
    const baseUrl = 'https://avilapanaderia.netlify.app';

    document.title = finalTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name'
      let meta = document.head.querySelector(`meta[${attr}="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attr, name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    const finalDescription = description || defaultDescription;
    setMeta('description', finalDescription);
    if (keywords) setMeta('keywords', keywords);
    setMeta('og:title', finalTitle, true);
    setMeta('og:description', finalDescription, true);
    setMeta('og:image', image, true);
    setMeta('og:url', url || baseUrl, true);
    setMeta('og:type', 'website', true);
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDescription);
    setMeta('twitter:card', 'summary_large_image');

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || baseUrl);

    document.documentElement.lang = i18n.language || 'es';
  }, [title, description, keywords, image, url, i18n.language]);

  return null;
}

export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Panadería Ávila",
    "image": "https://avilapanaderia.netlify.app/logo.png",
    "@id": "",
    "url": "https://avilapanaderia.netlify.app",
    "telephone": "+506 8888 8888",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle Principal",
      "addressLocality": "San José",
      "postalCode": "10101",
      "addressCountry": "CR"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "07:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Sunday",
        "opens": "08:00",
        "closes": "17:00"
      }
    ]
  };

  return (
    <script type="application/ld+json">
      {JSON.stringify(schema)}
    </script>
  );
}
