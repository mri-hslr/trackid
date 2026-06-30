// src/content/copy.js
// ALL text content lives here — never hardcode strings in JSX.
// Swap language, tone, or finalize copy later by editing this one file.

export const COPY = {
  hero: {
    wordmark: 'TrakID',
    tagline: 'Beautiful enough to wear. Smart enough to never lose.', // TBD, placeholder
    scrollCue: 'Scroll to explore',
    // Info panel content for the scroll-driven showcase sequence
    showcase: {
      productName: 'The Classic Teardrop',
      description: 'Sterling silver. Lab-grown sapphire. GPS within.',
      features: [
        'Real-Time GPS',
        'SOS Emergency',
        'Water Resistant',
      ],
    },
    showcaseSecondary: {
      productName: 'Designed for Life',
      description: 'Aerospace-grade materials. Magnetic charging. Built to withstand childhood.',
      features: [
        'IP67 Water Resistant',
        'Magnetic Snap Charge',
        'Impact Resistant',
      ],
    },
  },

  fork: {
    eyebrow: 'Choose your path',
    headline: 'Two ways to protect what matters.',
    institutionalTitle: 'Schools & Institutions',
    institutionalSubtitle: 'Placeholder — pilot programme framing TBD',
    institutionalCopy: 'Built for administrators evaluating safety at scale.',
    institutionalCta: 'Talk to our team',
    familyTitle: 'A Pendant, Not a Gadget',
    familySubtitle: 'Placeholder — gifting framing TBD',
    familyCopy: 'Built for parents who want their child to actually wear it.',
    familyCta: 'Explore the collection',
  },

  complianceCase: {
    eyebrow: 'The problem with trackers',
    headline: 'A tracker a child refuses to wear protects no one.',
    body: 'Placeholder — compliance/retention argument TBD.',
    stats: [
      { value: '—', label: 'Placeholder stat 1' }, // TODO: confirm stat
      { value: '—', label: 'Placeholder stat 2' }, // TODO: confirm stat
    ],
  },

  engineeringCredibility: {
    eyebrow: 'Built to last',
    headline: 'Engineering you can trust.',
    founders: [
      {
        name: 'Founder Name',       // TODO: replace with real name
        role: 'Co-Founder & CEO',   // TODO: replace with real role
        credential: 'Placeholder credential — one-line bio TBD.',
        photo: null,                // placeholder — path added to assets.js when ready
      },
    ],
    specs: [
      { icon: 'MapPin',        label: 'GPS Tracking' },
      { icon: 'Radio',         label: 'LTE Connectivity' },
      { icon: 'ShieldAlert',   label: 'SOS Emergency' },
      { icon: 'ShieldCheck',   label: 'Safe Zone Alerts' },
      { icon: 'Droplets',      label: 'Water Resistant' },
      { icon: 'BatteryFull',   label: 'Long Battery Life' },
      { icon: 'Magnet',        label: 'Magnetic Charging' },
      { icon: 'Minimize2',     label: 'Compact & Durable' },
    ],
    pressLogos: [], // empty until press logos exist
  },

  institutionalAsk: {
    eyebrow: 'Get started',
    headline: 'Request a Pilot Programme',
    subtitle: 'Talk to our team about bringing TrakID to your institution.',
    successMessage: 'Thank you. Our team will be in touch shortly.',
    errorRequired: 'This field is required.',
    submitLabel: 'Submit Request',
  },

  anatomy: {
    eyebrow: 'The collection',
    headline: 'Crafted with intention.',
    collectionItems: [
      {
        id: 'classicTeardrop',
        name: 'The Classic Teardrop',
        description: 'Placeholder — classic teardrop description TBD.',
        motifNotes: ['Sapphire setting', 'Sterling silver'],
      },
      {
        id: 'sweetheartFiligree',
        name: 'The Sweetheart Filigree',
        description: 'Placeholder — sweetheart filigree description TBD.',
        motifNotes: ['Filigree detailing', 'Rose gold accent'],
      },
      {
        id: 'wiseOwl',
        name: 'The Wise Owl',
        description: 'Placeholder — wise owl description TBD.',
        motifNotes: ['Owl silhouette', 'Antique finish'],
      },
      {
        id: 'pathFinder',
        name: 'The Path Finder',
        description: 'Placeholder — path finder description TBD.',
        motifNotes: ['Compass rose', 'Brushed steel'],
      },
    ],
  },

  peaceOfMind: {
    eyebrow: 'Peace of mind, visualized',
    headline: 'See where they are. Know they\'re safe.',
    demoStates: {
      live: { label: 'Live Location', description: 'Real-time GPS tracking.' },
      safeZone: { label: 'Safe Zone Alert', description: 'Alerts when boundaries are crossed.' },
      sos: { label: 'SOS Triggered', description: 'Immediate emergency notification.' },
    },
  },

  invitation: {
    eyebrow: 'Join us',
    headline: 'Shop the Collection',
    subtitle: 'Placeholder — gifting angle / grandparent framing TBD.',
    successMessage: 'You\'re on the list. We\'ll be in touch.',
    errorRequired: 'This field is required.',
    submitLabel: 'Join the Waitlist',
  },

  closing: {
    brandStatement: 'TrakID',
    tagline: 'Beautiful enough to wear. Smart enough to never lose.',
    footerColumns: [
      {
        heading: 'Product',
        links: [
          { label: 'The Collection', href: '#anatomy' },
          { label: 'How It Works', href: '#reveal' },
          { label: 'Safety Features', href: '#peace-of-mind' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'About', href: '#about' },
          { label: 'Contact', href: '#contact' },
          { label: 'Press', href: '#press' },
        ],
      },
      {
        heading: 'Legal',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
        ],
      },
    ],
    socialLinks: [
      { label: 'Instagram', href: '#', icon: 'Instagram' },
      { label: 'Twitter', href: '#', icon: 'Twitter' },
      { label: 'LinkedIn', href: '#', icon: 'Linkedin' },
    ],
    copyright: '© 2026 TrakID. All rights reserved.',
  },

  reveal: {
    eyebrow: 'Under the surface',
    annotations: [
      { key: 'gps', label: 'GPS Antenna' },
      { key: 'battery', label: 'Battery' },
      { key: 'pcb', label: 'PCB' },
      { key: 'shell', label: 'Shell' },
    ],
  },
};
