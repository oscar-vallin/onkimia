import { revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * API Route for on-demand revalidation from Sanity webhooks
 *
 * Configure in Sanity:
 * 1. Settings → API → Webhooks
 * 2. URL: https://your-domain.com/api/revalidate
 * 3. Secret: same value as SANITY_REVALIDATE_SECRET
 * 4. Trigger on: Create, Update, Delete
 */

/**
 * Document types whose tags the app fetches with (see src/sanity/queries.ts and
 * the `tags` passed to sanityFetch). Adding a new schema means adding it here,
 * otherwise its webhook is rejected and the page keeps serving stale content.
 */
const REVALIDATABLE_TYPES = new Set([
  'siteSettings',
  'doctor',
  'testimonial',
  'faq',
  'insurance',
  'jobPosting',
  'aboutPage',
  'serviciosPage',
  'endosPage',
  'procedure',
  'service',
  'privacyPolicy',
  'socioComercial',
]);

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      slug?: { current: string };
    }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    );

    // Validate the webhook signature
    if (!isValidSignature) {
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 },
      );
    }

    // Validate that the body has a document type
    if (!body?._type) {
      return NextResponse.json(
        { message: 'Bad Request: Missing _type' },
        { status: 400 },
      );
    }

    // Only revalidate types the app actually queries. Without this allowlist an
    // arbitrary _type creates junk tags in the cache store.
    if (!REVALIDATABLE_TYPES.has(body._type)) {
      console.warn('[Revalidate] Unknown _type, ignored:', body._type);
      return NextResponse.json(
        { message: `Unknown _type: ${body._type}`, revalidated: false },
        { status: 400 },
      );
    }

    // Revalidate the specific tag for this document type
    revalidateTag(body._type, 'max');

    // Also revalidate the generic "sanity" tag for fetches without a specific tag
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
