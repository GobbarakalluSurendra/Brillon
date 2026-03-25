import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, name, type, image }) {
  // Use default fallback values for SEO if not provided
  const seoTitle = title ? `${title} | EventHub` : 'EventHub — Discover Extraordinary Events';
  const seoDescription = description || 'Discover and register for extraordinary events — conferences, workshops, and networking.';
  const seoType = type || 'website';
  const siteName = name || 'EventHub';
  
  // Default image can match your logo or main hero image
  // Replace with actual absolute URL once deployed
  const seoImage = image || '/event-hub-logo.png'; 

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      
      {/* Open Graph tags (Facebook, LinkedIn, etc.) */}
      <meta property="og:type" content={seoType} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter Card tags */}
      <meta name="twitter:creator" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
}
