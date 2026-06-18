/**
 * Sync inventory to Snipcart's product catalog.
 *
 * Run:
 *   SNIPCART_SECRET_KEY=your_key node scripts/sync-snipcart-inventory.mjs
 *
 * Or with .env.local loaded:
 *   node --env-file=.env.local scripts/sync-snipcart-inventory.mjs
 *
 * Edit INVENTORY below to set / restock quantities, then re-run anytime.
 * After the first run, you can also manage stock directly in:
 *   Snipcart Dashboard → Catalog → Products
 */

// ─── Edit stock quantities here ────────────────────────────────────────────
const INVENTORY = {
  'deep-connections-pillow': 20,
  'love-blanket':            20,
  'coconu-lube':             50,
  'matchmaker-candle':       30,
  'raunchier-together':      25,
  'sexy-time-candle':        30,
};

// ─── Product metadata (mirrors lib/products.ts) ───────────────────────────
const PRODUCTS = {
  'deep-connections-pillow': {
    name: 'Deep Connections Pillow',
    price: 89.00,
    description: 'An ergonomic positioning pillow designed to deepen physical and emotional intimacy',
  },
  'love-blanket': {
    name: 'The Love Blanket',
    price: 79.00,
    description: 'Ultra-soft blanket designed to deepen connection and wrap couples in warmth',
  },
  'coconu-lube': {
    name: 'Coconu Lube',
    price: 32.00,
    description: 'Natural coconut oil-based personal lubricant, body-safe and luxurious',
  },
  'matchmaker-candle': {
    name: 'Matchmaker Candle',
    price: 38.00,
    description: 'Premium sensual massage candle that melts into warm body oil',
  },
  'raunchier-together': {
    name: 'Raunchier Together',
    price: 42.00,
    description: 'Bold adult card game for couples — play bold, connect deeper',
  },
  'sexy-time-candle': {
    name: 'Sexy Time Candle',
    price: 34.00,
    description: 'Hand-poured soy wax candle with a signature sensual scent',
  },
};

const SITE = 'https://www.joinmodernbond.com';
const API  = 'https://app.snipcart.com/api';

const SECRET_KEY = process.env.SNIPCART_SECRET_KEY;
if (!SECRET_KEY) {
  console.error('❌  SNIPCART_SECRET_KEY is not set.');
  console.error('   Run: node --env-file=.env.local scripts/sync-snipcart-inventory.mjs');
  process.exit(1);
}

const authHeader = `Basic ${Buffer.from(SECRET_KEY + ':').toString('base64')}`;

async function snipcart(path, method = 'GET', body = null) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path} → HTTP ${res.status}: ${text}`);
  return text ? JSON.parse(text) : null;
}

async function syncProduct(slug, stock) {
  const meta = PRODUCTS[slug];
  if (!meta) { console.warn(`⚠  No metadata for ${slug} — skipping`); return; }

  const payload = {
    userDefinedId:          slug,
    name:                   meta.name,
    price:                  meta.price,
    url:                    `${SITE}/products/${slug}`,
    description:            meta.description,
    stock,
    manageable:             true,
    allowOutOfStockPurchases: false,
  };

  // Check if product already exists in catalog
  const list = await snipcart(`/products?userDefinedId=${encodeURIComponent(slug)}`);
  const existing = list?.items?.[0];

  if (existing) {
    await snipcart(`/products/${existing.token}`, 'PUT', {
      stock,
      manageable:             true,
      allowOutOfStockPurchases: false,
    });
    console.log(`✓  Updated  ${slug.padEnd(30)} stock: ${existing.stock} → ${stock}`);
  } else {
    await snipcart('/products', 'POST', payload);
    console.log(`✓  Created  ${slug.padEnd(30)} stock: ${stock}`);
  }
}

async function main() {
  console.log('Syncing inventory to Snipcart…\n');
  for (const [slug, stock] of Object.entries(INVENTORY)) {
    try {
      await syncProduct(slug, stock);
    } catch (err) {
      console.error(`✗  Failed   ${slug}: ${err.message}`);
    }
  }
  console.log('\nDone. Manage stock anytime at: Snipcart → Catalog → Products');
}

main();
