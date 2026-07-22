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
  eyebrow: "Compliance Case",

  headline: "A tracker a child refuses to wear protects no one.",

  body:
    "Traditional GPS trackers are often removed, forgotten or hidden. TrakID is designed as premium jewellery that children actually choose to wear.",

  statistic: {
    value: "XX%",
    title: "Higher Daily Wear Compliance",
    subtitle: "Compared with traditional GPS trackers",
  },

  valueCards: [
    {
      title: "Acceptance",
      description: "Designed to feel familiar and desirable.",
    },
    {
      title: "Daily Wear",
      description: "Comfort encourages consistent everyday use.",
    },
    {
      title: "Continuous Safety",
      description: "Protection only works when it's worn.",
    },
  ],

  journey: [
    "Removed",
    "Hidden",
    "Forgotten",
    "Always Worn",
  ],

  comparison: [
    {
      traditional: "Looks like a gadget",
      trakid: "Looks like jewellery",
    },
    {
      traditional: "Bulky to wear",
      trakid: "Comfortable all day",
    },
    {
      traditional: "Frequently removed",
      trakid: "Children wear it voluntarily",
    },
    {
      traditional: "Lower compliance",
      trakid: "Higher compliance",
    },
  ],

  benefits: [
    {
      title: "Looks Like Jewellery",
      description:
        "Designed as an accessory children enjoy wearing.",
    },
    {
      title: "Children Actually Wear It",
      description:
        "Comfortable, familiar and easy to wear every day.",
    },
    {
      title: "Better Compliance",
      description:
        "Higher wear time leads to more reliable protection.",
    },
  ],

  quote:
    "When children wear it by choice, protection becomes continuous.",
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
  eyebrow: "Chapter Four — The Companions",

  headline: "Crafted for every personality.",

  collectionItems: [
    {
      id: "classicTeardrop",

      name: "Classic Teardrop",

      description:
        "Timeless elegance inspired by simplicity. Designed to blend seamlessly into everyday life while quietly carrying intelligent protection.",

      motifNotes: [
        {
          title: "Sapphire Accent",
          description: "Inspired by calm, clarity and confidence.",
        },
        {
          title: "Sterling Finish",
          description: "Elegant craftsmanship with lasting durability.",
        },
        {
          title: "Smooth Contours",
          description: "Comfortable enough for everyday wear.",
        },
      ],
    },

    {
      id: "sweetheartFiligree",

      name: "Sweetheart Filigree",

      description:
        "Delicate filigree patterns celebrate love, warmth and family, creating a pendant children are proud to wear.",

      motifNotes: [
        {
          title: "Heart Motif",
          description: "A symbol of care and connection.",
        },
        {
          title: "Filigree Detail",
          description: "Intricate craftsmanship inspired by heirloom jewellery.",
        },
        {
          title: "Rose Gold Accent",
          description: "Adds warmth and timeless elegance.",
        },
      ],
    },

    {
      id: "wiseOwl",

      name: "Wise Owl",

      description:
        "Inspired by wisdom and guidance, combining playful character with refined craftsmanship.",

      motifNotes: [
        {
          title: "Owl Silhouette",
          description: "Represents wisdom and protection.",
        },
        {
          title: "Feather Texture",
          description: "Adds subtle handcrafted detailing.",
        },
        {
          title: "Antique Finish",
          description: "Classic styling with modern technology inside.",
        },
      ],
    },

    {
      id: "pathFinder",

      name: "Path Finder",

      description:
        "A modern interpretation of the compass, symbolising confidence, exploration and always finding the way home.",

      motifNotes: [
        {
          title: "Compass Rose",
          description: "Guidance in every direction.",
        },
        {
          title: "Brushed Steel",
          description: "Clean, modern and durable.",
        },
        {
          title: "Explorer Design",
          description: "Created for curious young adventurers.",
        },
      ],
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

  // -----------------------------------------------------------------
  // STORY MODE — chapter copy for the linear narrative flow.
  // Each chapter has a `marker` (mono eyebrow) rendered by ChapterMarker.
  // -----------------------------------------------------------------
  story: {
    // Kinetic copy — lines are arrays of segments so specific words can be
    // wrapped in sticker chips: { t: 'word', sticker: 'gold'|'pink'|'ghost' }.
    moment: {
      marker: 'Chapter Two — The Moment',
      day: 'A Tuesday',
      clock: [{ t: '3:42', sticker: 'gold' }, { t: 'PM' }],
      lines: [
        [{ t: 'The bell rang at' }, { t: '3:30.', sticker: 'ghost' }],
        [{ t: 'It’s 3:42, and she isn’t' }, { t: 'home', sticker: 'pink' }, { t: 'yet.' }],
        [{ t: 'Twelve minutes is nothing.' }],
        [{ t: 'Twelve minutes is' }, { t: 'everything.', sticker: 'gold' }],
      ],
      resolution:
        'Every parent knows this silence. We built TrakID so it never has to last longer than a glance.',
      resolutionAccents: ['never', 'a', 'glance.'],
      bridge: 'But a tracker only works if it’s there —',
    },

    belief: {
      marker: 'Chapter Three — The Truth',
      headline: [
        { t: 'A tracker a child' },
        { t: 'refuses', sticker: 'pink' },
        { t: 'to wear protects' },
        { t: 'no one.', sticker: 'gold' },
      ],
      body:
        'Gadgets get removed. Hidden in backpacks. Forgotten on dressers. So we didn’t build a better gadget — we built something children ask to put on.',
      bodyAccents: ['ask', 'to', 'put', 'on.'],
      journey: ['Removed', 'Hidden', 'Forgotten', 'Always worn'],
      quote: 'When children wear it by choice, protection becomes continuous.',
    },

    watchedOver: {
      marker: 'Chapter Five — The Day, Watched Over',
      headline: 'The same Tuesday. This time, you’re there.',
      subhead:
        'One quiet dot on a map, from the front door and back to it. No calls. No refreshing. Just knowing.',
      events: [
        { time: '8:02 AM',  title: 'Leaves home',        description: 'The day begins. Her pendant wakes with her.', state: 'live' },
        { time: '8:14 AM',  title: 'Arrives at school',  description: 'Inside the safe zone. You get one gentle note, then silence.', state: 'safe' },
        { time: '3:42 PM',  title: 'The bell has rung',  description: 'The moment that used to be silence. Now it’s a dot, drifting home.', state: 'moving' },
        { time: '3:58 PM',  title: 'A detour',           description: 'She stops at a friend’s house. You see it. You breathe. You let her be a kid.', state: 'detour' },
        { time: '4:26 PM',  title: 'Home',               description: 'The door closes. The map goes quiet. So does the worry.', state: 'home' },
      ],
      sos: {
        label: 'And if she ever needs you',
        description: 'One long press on the pendant sends an SOS with live location — instantly, to every guardian.',
      },
      mapLabels: { home: 'Home', school: 'School', friend: 'Friend’s house', safeZone: 'Safe zone' },
    },

    invitation: {
      marker: 'Chapter Seven — The Beginning',
      headline: 'Every story like this begins with a choice.',
      subhead: 'Tell us whose story you’re writing.',
      audiences: {
        family: {
          label: 'For My Family',
          headline: 'Give them the pendant. Keep the peace of mind.',
          subtitle: 'Join the waitlist — or gift a TrakID to a grandchild, niece, or nephew.',
          submitLabel: 'Join the Waitlist',
          successMessage: 'You’re on the list. We’ll be in touch soon.',
        },
        institution: {
          label: 'For My School',
          headline: 'Bring TrakID to your institution.',
          subtitle: 'Pilot programmes for schools that take wearability as seriously as safety.',
          submitLabel: 'Request a Pilot',
          successMessage: 'Thank you. Our team will be in touch shortly.',
        },
      },
      errorRequired: 'This field is required.',
    },

    chapters: {
      reveal:  'Chapter One — The Secret',
      anatomy: 'Chapter Four — The Companions',
      proof:   'Chapter Six — The Promise, Kept',
      closing: 'Epilogue',
    },

    // Interlude — the particle pendant (OSOS-key-style pinned sequence).
    // Each statement tints the constellation: silver → gold → safe green.
    constellation: {
      marker: 'Interlude — The Constellation',
      statements: [
        { label: 'The Object', text: 'One pendant. Everything that matters, inside.',  color: 'silver' },
        { label: 'The Craft',  text: 'Crafted to be worn. Engineered to watch over.',  color: 'gold' },
        { label: 'The Calm',   text: 'So the only thing you feel is peace of mind.',   color: 'safe' },
      ],
    },
  },

  reveal: {
    eyebrow: 'Chapter One — The Secret',
    annotations: [
      { key: 'gps', label: 'GPS Antenna' },
      { key: 'battery', label: 'Battery' },
      { key: 'pcb', label: 'PCB' },
      { key: 'shell', label: 'Shell' },
    ],
  },
};
