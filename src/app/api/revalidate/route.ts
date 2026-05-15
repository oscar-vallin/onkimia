import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * API Route para revalidación on-demand desde Sanity webhooks
 * 
 * Configurar en Sanity:
 * 1. Settings → API → Webhooks
 * 2. URL: https://tu-dominio.com/api/revalidate
 * 3. Secret: mismo valor que SANITY_REVALIDATE_SECRET
 * 4. Trigger on: Create, Update, Delete
 */

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      slug?: { current: string };
    }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    // Validar firma del webhook
    if (!isValidSignature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 },
      );
    }

    // Validar que el body tenga el tipo de documento
    if (!body?._type) {
      return NextResponse.json(
        { message: 'Bad Request: Missing _type' },
        { status: 400 },
      );
    }

    // Revalida el tag específico del tipo de documento
    revalidateTag(body._type, 'max');
    
    // También revalida tag genérico "sanity" para fetches no taggeados específicamente
    revalidateTag('sanity', 'max');

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      type: body._type,
    });
  } catch (err: unknown) {
    console.error('Error revalidating:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 },
    );
  }
}

// Made with Bob
