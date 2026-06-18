import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const key = process.env.SNIPCART_SECRET_KEY;

  // If no secret key configured, assume in-stock (graceful degradation)
  if (!key) return NextResponse.json({ stock: null, inStock: true, manageable: false });

  const res = await fetch(
    `https://app.snipcart.com/api/products?userDefinedId=${encodeURIComponent(slug)}`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(key + ':').toString('base64')}`,
        Accept: 'application/json',
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return NextResponse.json({ stock: null, inStock: true, manageable: false });

  const data = await res.json();
  const product = data.items?.[0];
  if (!product) return NextResponse.json({ stock: null, inStock: true, manageable: false });

  return NextResponse.json({
    stock:      product.stock ?? null,
    inStock:    !product.manageable || product.stock > 0,
    manageable: product.manageable ?? false,
  });
}
