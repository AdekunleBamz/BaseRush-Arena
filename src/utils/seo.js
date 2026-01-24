/**
 * SEO Metadata Utility
 * Generate meta tags for pages
 */

const SITE_NAME = 'BaseRush Arena'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://baserush.xyz'
const DEFAULT_IMAGE = `${SITE_URL}/images/og-image.png`

/**
 * Default metadata
 */
export const defaultMeta = {
  title: 'BaseRush Arena - Web3 Prediction Game on Base',
  description: 'Join the ultimate Web3 prediction game on Base Network. Make predictions, stake ETH, earn rewards, and compete on the leaderboard.',
  keywords: [
    'Web3',
    'blockchain',
    'prediction game',
    'Base Network',
    'Ethereum',
    'DeFi',
    'gaming',
    'crypto',
    'staking',
    'rewards',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_IMAGE,
        width: 1200,
        height: 630,
        alt: 'BaseRush Arena',
      },
    ],
  },
  twitter: {
    handle: '@baserush',
    site: '@baserush',
    cardType: 'summary_large_image',
  },
}

/**
 * Generate page-specific metadata
 * @param {object} options - Metadata options
 */
export function generateMeta(options = {}) {
  const {
    title,
    description = defaultMeta.description,
    path = '',
    image = DEFAULT_IMAGE,
    noIndex = false,
  } = options

  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : defaultMeta.title

  const url = `${SITE_URL}${path}`

  return {
    title: fullTitle,
    description,
    keywords: defaultMeta.keywords.join(', '),
    openGraph: {
      ...defaultMeta.openGraph,
      title: fullTitle,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      ...defaultMeta.twitter,
      title: fullTitle,
      description,
      images: [image],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

/**
 * Generate JSON-LD structured data
 */
export function generateJsonLd(type, data) {
  const schemas = {
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: defaultMeta.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    
    game: {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: SITE_NAME,
      description: defaultMeta.description,
      url: SITE_URL,
      applicationCategory: 'Game',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'ETH',
      },
      ...data,
    },
    
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: (data?.items || []).map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
      sameAs: [
        'https://twitter.com/baserush',
        'https://discord.gg/baserush',
      ],
      ...data,
    },
  }

  return schemas[type] || null
}

/**
 * Canonical URL helper
 */
export function getCanonicalUrl(path = '') {
  return `${SITE_URL}${path}`
}

/**
 * Generate hreflang tags for internationalization
 */
export function generateHrefLangTags(path, locales = ['en']) {
  return locales.map((locale) => ({
    rel: 'alternate',
    hrefLang: locale,
    href: `${SITE_URL}/${locale}${path}`,
  }))
}

export default {
  defaultMeta,
  generateMeta,
  generateJsonLd,
  getCanonicalUrl,
  generateHrefLangTags,
  SITE_NAME,
  SITE_URL,
}
