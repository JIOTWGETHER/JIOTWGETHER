
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { serverDb } from '../../../lib/db';
import { sendRegistrationConfirmation } from '../../../lib/mail';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const ip = process.env.VERCEL === '1'
      ? req.headers.get('x-vercel-forwarded-for')
      : null;

    const secret = process.env.RATE_LIMIT_SECRET;

    if (!ip || !secret || secret.length < 32) {
      return NextResponse.json(
        { message: '報名服務暫時無法使用，請稍後再試' },
        { status: 503 }
      );
    }

    const ipHash = createHmac('sha256', secret)
      .update(ip)
      .digest('hex');

    const db = serverDb();

    const { data: allowed, error: rateError } = await db.rpc(
      'check_registration_rate_limit',
      { p_ip_hash: ipHash }
    );

    if (rateError) {
      return NextResponse.json(
        { message: '報名服務暫時無法使用，請稍後再試' },
        { status: 503 }
      );
    }

    if (allowed !== true) {
      return NextResponse.json(
        { message: '操作過於頻繁，請稍後再試' },
        { status: 429 }
      );
    }

    const b = await req.json();

    if (b.website) {
      return NextResponse.json(
        { message: '已收到' },
        { status: 200 }
      );
    }

    const name = String(b.name || '').trim();
    const email = String(b.email || '').trim().toLowerCase();
    const eventId = String(b.eventId || '');

    if (
      name.length < 1 ||
      name.length > 80 ||
      email.length > 200 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !/^[0-9a-f-]{36}$/i.test(eventId)
    ) {
      return NextResponse.json(
        { message: '請檢查填寫資料' },
        { status: 400 }
      );
    }

    const { data, error } = await db.rpc(
      'register_for_event',
      {
        p_event_id: eventId,
        p_name: name,
        p_email: email
      }
    );

    if (error) {
      return NextResponse.json(
        { message: '暫時無法報名，請稍後再試' },
        { status: 500 }
      );
    }

    if (data !== 'ok') {
      const message =
        data === 'full' ? '活動已額滿' :
        data === 'duplicate' ? '此 Email 已報名' :
        data === 'closed' ? '活動目前未開放報名' :
        '無法報名';

      return NextResponse.json(
        { message },
        { status: 409 }
      );
    }

    // 報名成功後，讀取活動資訊
    const { data: event, error: eventError } = await db
      .from('events')
      .select('title, starts_at, location')
      .eq('id', eventId)
      .single();

    let emailSent = false;

    if (!eventError && event) {
      try {
        const eventDate = new Date(
          event.starts_at
        ).toLocaleString('zh-TW', {
          timeZone: 'America/New_York',
          dateStyle: 'full',
          timeStyle: 'short'
        });

        await sendRegistrationConfirmation({
          name,
          email,
          eventTitle: event.title,
          eventDate,
          eventLocation: event.location
        });

        emailSent = true;
      } catch (mailError) {
        console.error(
          'Registration confirmation email failed:',
          mailError
        );
      }
    } else {
      console.error(
        'Failed to retrieve event for confirmation email:',
        eventError
      );
    }

    // 寄信失敗不會取消已成功的報名
    return NextResponse.json({
      message: emailSent
        ? '報名成功！確認信已寄出，請查看你的 Email。'
        : '報名成功！但確認信暫時無法寄出，請保留活動資訊。',
      emailSent
    });

  } catch (error) {
    console.error('Registration request failed:', error);

    return NextResponse.json(
      { message: '無效的請求' },
      { status: 400 }
    );
  }
}
