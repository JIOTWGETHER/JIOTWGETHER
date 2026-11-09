
import { NextResponse } from 'next/server';
import { getAdmin } from '../../../lib/admin';
import { serverDb } from '../../../lib/db';
import { normalizeDesign } from '../../../lib/site';

export async function POST(req: Request) {
  if (!(await getAdmin())) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    if (!['draft', 'published'].includes(body.target)) {
      return NextResponse.json(
        { error: 'Invalid target' },
        { status: 400 }
      );
    }

    const design = normalizeDesign(body.design);
    const db = serverDb();

    const { error } = await db
      .from('site_designs')
      .upsert({
        id: body.target,
        content: design,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      return NextResponse.json(
        { error: 'Database unavailable' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
