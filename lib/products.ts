export type Product = {
  slug: string;
  name: string;            // full display name e.g. "Deep Connections Pillow"
  titleTop: string;        // first line of the detail <h2>
  titleBottom: string;     // second line (pink span)
  category: string;        // e.g. "Intimacy · Physical" (marketplace card)
  price: number;
  priceStr: string;        // "$89"
  priceNote: string;
  tagline: string;
  desc: string;
  features: { title: string; body: string }[];
  badges: string[];
  cover: string;           // main / card image path
  thumbs: string[];        // thumbnail strip (incl. cover)
  snipcartDescription: string;
  why: {
    titleTop: string;
    titleBottom: string;
    desc: string;
    stats: { n: string; l: string }[];
  };
  related: string[];       // slugs of 3 related products
};

export const PRODUCTS: Record<string, Product> = {
  'deep-connections-pillow': {
    slug: 'deep-connections-pillow',
    name: 'Deep Connections Pillow',
    titleTop: 'Deep Connections',
    titleBottom: 'Pillow',
    category: 'Intimacy · Physical',
    price: 89,
    priceStr: '$89',
    priceNote: '',
    tagline: 'Better angles. Deeper connection.',
    desc: 'The Deep Connections Pillow is a precision-engineered intimacy positioning cushion designed to reduce strain, open up new angles, and make every experience more comfortable and connected. Because how you position your body changes everything about how you feel.',
    features: [
      { title: 'Ergonomic Design', body: 'Contoured shape supports the body naturally — reducing pressure points and fatigue so you can stay fully present' },
      { title: 'Premium Materials', body: 'High-density foam core with a soft, removable, washable cover' },
      { title: 'Discreet Packaging', body: 'Delivered in plain, unmarked packaging — your privacy is protected' },
      { title: 'Versatile Use', body: 'Works for solo practice, partner play, massage, and relaxation' },
    ],
    badges: [],
    cover: '/marketplace/deep_connections_pillow/COVER_PronePillow_v002.png',
    thumbs: [
      '/marketplace/deep_connections_pillow/COVER_PronePillow_v002.png',
      '/marketplace/deep_connections_pillow/BED_PronePillow_003.png',
      '/marketplace/deep_connections_pillow/BED_PronePillow_004.png',
      '/marketplace/deep_connections_pillow/hf_20260611_052742_78e9e426-f234-41fa-9c3f-4d8b1b02f076.png',
    ],
    snipcartDescription: 'Premium ergonomic positioning pillow for deeper comfort and connection',
    why: {
      titleTop: 'Comfort Is',
      titleBottom: 'Connection.',
      desc: 'Physical discomfort is one of the most overlooked barriers to intimacy. When your body is properly supported, you can be fully present — more relaxed, more open, more connected. The Deep Connections Pillow was designed with that intention.',
      stats: [
        { n: 'HD', l: 'Foam Core' },
        { n: '360°', l: 'Body Support' },
        { n: '1', l: 'Washable Cover' },
        { n: '∞', l: 'Better Moments' },
      ],
    },
    related: ['love-blanket', 'matchmaker-candle', 'coconu-lube', 'raunchier-together'],
  },

  'love-blanket': {
    slug: 'love-blanket',
    name: 'The Love Blanket',
    titleTop: 'The Love',
    titleBottom: 'Blanket',
    category: 'Comfort · Physical',
    price: 79,
    priceStr: '$79',
    priceNote: '',
    tagline: 'Wrap yourself in warmth. Share something real.',
    desc: "The Love Blanket is designed for closeness — whether you're winding down together, deepening a connection ritual, or simply craving comfort that feels like a full-body embrace. Luxuriously soft, intentionally weighted, and made for the moments that matter most.",
    features: [
      { title: 'Ultra-Soft Fabric', body: 'A premium plush weave that gets softer with every wash — made to be lived in' },
      { title: 'Generous Size', body: 'Large enough to share — designed with couples in mind, perfect for two' },
      { title: 'Calming Weight', body: 'Gentle pressure that soothes the nervous system and invites presence' },
      { title: 'Ritual-Ready', body: 'A grounding anchor for your intimacy rituals, bedtime connection, or post-session warmth' },
    ],
    badges: ['⚡ Ultra-Soft'],
    cover: '/marketplace/the_love_blanket/COVER_TheLoveBlanket_v001_cover.jpg',
    thumbs: [
      '/marketplace/the_love_blanket/COVER_TheLoveBlanket_v001_cover.jpg',
      '/marketplace/the_love_blanket/TheLoveBlanket_002a.jpg',
      '/marketplace/the_love_blanket/TheLoveBlanket_002b.jpg',
      '/marketplace/the_love_blanket/TheLoveBlanket_003.jpg',
      '/marketplace/the_love_blanket/TheLoveBlanket_004.jpg',
      '/marketplace/the_love_blanket/TheLoveBlanket_005.webp',
      '/marketplace/the_love_blanket/TheLoveBlanket_006.jpg',
      '/marketplace/the_love_blanket/TheLoveBlanket_007.jpg',
      '/marketplace/the_love_blanket/TheLoveBlanket_010.jpg',
    ],
    snipcartDescription: 'Ultra-soft blanket designed to deepen connection and wrap couples in warmth',
    why: {
      titleTop: 'Touch Is',
      titleBottom: 'Connection.',
      desc: 'Physical warmth and closeness activate the bonding hormone oxytocin — the science of touch is real. The Love Blanket creates a shared cocoon that lowers defenses, invites vulnerability, and helps partners feel genuinely close.',
      stats: [
        { n: '2×', l: 'Softer With Every Wash' },
        { n: 'XL', l: 'Couples Size' },
        { n: '1', l: 'Shared Ritual' },
        { n: '∞', l: 'Cozy Nights' },
      ],
    },
    related: ['deep-connections-pillow', 'matchmaker-candle', 'sexy-time-candle', 'raunchier-together'],
  },

  'coconu-lube': {
    slug: 'coconu-lube',
    name: 'Coconu Lube',
    titleTop: 'Coconu',
    titleBottom: 'Lube',
    category: 'Wellness · Physical',
    price: 32,
    priceStr: '$32',
    priceNote: '',
    tagline: 'Natural. Body-safe. Deeply luxurious.',
    desc: 'Coconu is a premium natural lubricant made with organic coconut oil and plant-based ingredients. Silky smooth, long-lasting, and completely body-safe — crafted for people who take their pleasure as seriously as everything else in their life.',
    features: [
      { title: 'Organic Ingredients', body: 'Made with organic virgin coconut oil — no parabens, no petrochemicals, no compromise' },
      { title: 'Long-Lasting Formula', body: "Silky texture that doesn't dry out — stays smooth throughout" },
      { title: 'pH Balanced', body: "Formulated to support your body's natural chemistry" },
      { title: 'Versatile Use', body: 'Works for massage, moisturizing, and intimate play' },
    ],
    badges: ['⚡ 100% Natural', '⚡ Body-Safe Formula'],
    cover: '/marketplace/coconu_lube/COVER_COCONUT_Lube_v001.jpg',
    thumbs: [
      '/marketplace/coconu_lube/COVER_COCONUT_Lube_v001.jpg',
      '/marketplace/coconu_lube/COCONUT_Lube_001.webp',
      '/marketplace/coconu_lube/COCONUT_Lube_002.webp',
      '/marketplace/coconu_lube/COCONUT_Lube_003.webp',
      '/marketplace/coconu_lube/COCONUT_Lube_004.webp',
      '/marketplace/coconu_lube/COCONUT_Lube_005.webp',
      '/marketplace/coconu_lube/COCONUT_Lube_006.webp',
      '/marketplace/coconu_lube/COCONUT_Lube_007.webp',
      '/marketplace/coconu_lube/COCONUT_Lube_008.webp',
      '/marketplace/coconu_lube/COCONUT_Lube_009.webp',
    ],
    snipcartDescription: 'Natural coconut oil-based personal lubricant, body-safe and luxurious',
    why: {
      titleTop: 'Your Body',
      titleBottom: 'Deserves Better.',
      desc: 'Most lubricants are full of synthetics and harsh chemicals. Coconu is different — crafted with ingredients you can actually trust, delivering a naturally luxurious experience without compromise.',
      stats: [
        { n: '100%', l: 'Natural' },
        { n: '0', l: 'Harsh Chemicals' },
        { n: 'pH', l: 'Balanced Formula' },
        { n: '∞', l: 'Smoother Moments' },
      ],
    },
    related: ['matchmaker-candle', 'sexy-time-candle', 'deep-connections-pillow', 'raunchier-together'],
  },

  'matchmaker-candle': {
    slug: 'matchmaker-candle',
    name: 'Matchmaker Candle',
    titleTop: 'Matchmaker',
    titleBottom: 'Candle',
    category: 'Wellness · Physical',
    price: 38,
    priceStr: '$38',
    priceNote: '',
    tagline: 'Light it. Let it melt. Feel everything.',
    desc: 'The Matchmaker Candle is a dual-purpose luxury candle that burns beautifully and melts into a warm, silky massage oil. Light it to set the mood. Pour it to deepen the touch. Two experiences. One intention.',
    features: [
      { title: 'Massage Oil Candle', body: 'Burns at a low temperature — safe to pour directly onto skin as warm massage oil' },
      { title: 'Clean Ingredients', body: 'Made with soy wax, coconut oil, and skin-nourishing botanicals — no harsh additives' },
      { title: 'Intoxicating Scent', body: 'A warm, sensual fragrance that transforms any room into a sanctuary' },
      { title: 'Long Burn Time', body: 'Up to 40 hours of burn time — enough for many deeply intentional evenings' },
    ],
    badges: ['⚡ Massage Candle', '⚡ Skin-Safe Formula'],
    cover: '/marketplace/matchmaker_candle/COVER_Matchmaker_Candle.png',
    thumbs: [
      '/marketplace/matchmaker_candle/COVER_Matchmaker_Candle.png',
      '/marketplace/matchmaker_candle/Matchmaker_Candle_001.webp',
      '/marketplace/matchmaker_candle/Matchmaker_Candle_002.webp',
      '/marketplace/matchmaker_candle/Matchmaker_Candle_003.webp',
      '/marketplace/matchmaker_candle/Matchmaker_Candle_004.webp',
      '/marketplace/matchmaker_candle/Matchmaker_Candle_005.webp',
      '/marketplace/matchmaker_candle/Matchmaker_Candle_006.webp',
      '/marketplace/matchmaker_candle/Matchmaker_Candle_007.webp',
    ],
    snipcartDescription: 'Premium sensual massage candle that melts into warm body oil',
    why: {
      titleTop: 'Ambiance Is',
      titleBottom: 'Foreplay.',
      desc: 'The right environment activates the senses before anything else happens. The Matchmaker Candle creates that environment — warm light, an intoxicating scent, and a touch of ritual that signals: this moment matters.',
      stats: [
        { n: '40h', l: 'Burn Time' },
        { n: '2-in-1', l: 'Candle + Oil' },
        { n: '100%', l: 'Skin-Safe' },
        { n: '∞', l: 'Sensual Evenings' },
      ],
    },
    related: ['sexy-time-candle', 'coconu-lube', 'love-blanket', 'deep-connections-pillow'],
  },

  'raunchier-together': {
    slug: 'raunchier-together',
    name: 'Raunchier Together',
    titleTop: 'Raunchier',
    titleBottom: 'Together',
    category: 'Game · Physical',
    price: 42,
    priceStr: '$42',
    priceNote: '',
    tagline: 'Play bold. Connect deeper.',
    desc: 'Raunchier Together is an adult card game designed to ignite desire, spark real conversation, and bring couples closer through bold, playful exploration. No filters. No judgment. Just you, your partner, and a whole lot of fun.',
    features: [
      { title: 'Bold Prompts', body: 'Cards range from flirtatious and fun to deeply intimate — designed to push your comfort zone in the best way' },
      { title: 'Multiple Modes', body: 'Play as dares, conversation starters, or intimate challenges — you set the tone' },
      { title: 'Premium Card Stock', body: 'Thick, durable cards with a matte finish — built to last for many nights of play' },
      { title: 'Expert Designed', body: 'Created in collaboration with intimacy coaches and relationship experts' },
    ],
    badges: ['⚡ For Couples'],
    cover: '/marketplace/raunchier_together_cardgame/Cover_CardGame.png',
    thumbs: [
      '/marketplace/raunchier_together_cardgame/Cover_CardGame.png',
      '/marketplace/raunchier_together_cardgame/CardGame_001.webp',
      '/marketplace/raunchier_together_cardgame/CardGame_002.webp',
      '/marketplace/raunchier_together_cardgame/CardGame_003.webp',
      '/marketplace/raunchier_together_cardgame/CardGame_004.webp',
      '/marketplace/raunchier_together_cardgame/CardGame_005.webp',
    ],
    snipcartDescription: 'Bold adult card game for couples — play bold, connect deeper',
    why: {
      titleTop: 'Play Is',
      titleBottom: 'Intimacy.',
      desc: 'Couples who play together stay together. Raunchier Together removes the awkwardness of "what do we do tonight" and replaces it with bold, guided exploration — making connection feel effortless and exciting.',
      stats: [
        { n: '50+', l: 'Bold Cards' },
        { n: '3', l: 'Play Modes' },
        { n: '1', l: 'Night to Remember' },
        { n: '∞', l: 'Possibilities' },
      ],
    },
    related: ['love-blanket', 'matchmaker-candle', 'sexy-time-candle', 'coconu-lube'],
  },

  'sexy-time-candle': {
    slug: 'sexy-time-candle',
    name: 'Sexy Time Candle',
    titleTop: 'Sexy Time',
    titleBottom: 'Candle',
    category: 'Wellness · Physical',
    price: 34,
    priceStr: '$34',
    priceNote: '',
    tagline: 'Set the scene. Own the moment.',
    desc: 'The Sexy Time Candle is a hand-poured premium soy candle with a bold, intoxicating scent profile crafted specifically for intimate moments. Light it before, during, or after — it belongs in every ritual.',
    features: [
      { title: 'Hand-Poured Soy Wax', body: 'Made in small batches with a clean-burning soy wax blend — no toxins, no synthetic paraffin' },
      { title: 'Signature Scent', body: 'A bold, sensual fragrance that lingers without overwhelming — designed for intimate spaces' },
      { title: 'Long Burn Time', body: 'Up to 50 hours of burn time — your ritual, extended' },
      { title: 'Reusable Vessel', body: 'Comes in a premium glass vessel you can repurpose long after the candle is done' },
    ],
    badges: ['⚡ Soy Wax Blend', '⚡ Hand-Poured'],
    cover: '/marketplace/sexy_time_candle/COVER_Candle.jpg',
    thumbs: [
      '/marketplace/sexy_time_candle/COVER_Candle.jpg',
      '/marketplace/sexy_time_candle/Candle_001.webp',
      '/marketplace/sexy_time_candle/Candle_002.webp',
      '/marketplace/sexy_time_candle/Candle_003.webp',
      '/marketplace/sexy_time_candle/Candle_004.webp',
    ],
    snipcartDescription: 'Hand-poured soy wax candle with a signature sensual scent',
    why: {
      titleTop: 'Scent Is',
      titleBottom: 'Memory.',
      desc: 'Scent is the most powerful sense tied to emotion and memory. The Sexy Time Candle creates an olfactory anchor for your most intimate moments — so every time you light it, your body remembers.',
      stats: [
        { n: '50h', l: 'Burn Time' },
        { n: '100%', l: 'Soy Wax' },
        { n: '1', l: 'Signature Scent' },
        { n: '∞', l: 'Intimate Evenings' },
      ],
    },
    related: ['matchmaker-candle', 'coconu-lube', 'love-blanket', 'raunchier-together'],
  },
};

export const PRODUCT_SLUGS = Object.keys(PRODUCTS);
