
import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';
import { serverDb } from '../../../lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // 僅在 Vercel 部署環境接受 Vercel 提供的 IP 標頭
    const ip = process.env.VERCEL === '1'
      ? req.headers.get('x-vercel-forwarded-for')
      : null;

    const secret = process.env.RATE_LIMIT_SECRET;

    // 無法安全識別 IP 時，不允許報名
    if (!ip || !secret || secret.length < 32) {
      return NextResponse.json(
        { message: '報名服務暫時無法使用，請稍後再試' },
        { status: 503 }
      );
    }

    // 使用 HMAC 避免直接儲存原始 IP
    const ipHash = createHmac('sha256', secret)
      .update(ip)
      .digest('hex');

    const db = serverDb();

    // 檢查 10 分鐘內的請求次數
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

    // 隱藏欄位：降低簡單機器人提交
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

    return NextResponse.json({
      message: '報名成功！請保留活動資訊；主辦方會透過 Email 聯絡你。'
    });

  } catch {
    return NextResponse.json(
      { message: '無效的請求' },
      { status: 400 }
    );
  }
}
