import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
}

export function SEO({ title, description }: SEOProps) {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Default title from translations or hardcoded
    const baseTitle = 'Panadería Ávila';
    const finalTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    document.title = finalTitle;

    // Meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        metaDescription.setAttribute('content', description);
        document.head.appendChild(metaDescription);
      }
    }

    // Set HTML lang attribute
    document.documentElement.lang = i18n.language || 'es';

  }, [title, description, i18n.language]);

  return null;
}

/**
 * Structured Data for Local Business
 */
export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Panadería Ávila",
    "image": "https://bakery-shop.example.com/logo.png",
    "@id": "",
    "url": "https://bakery-shop.example.com",
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
