
import { NextResponse } from 'next/server';
import { getAdmin } from '../../../lib/admin';
import { sendRegistrationConfirmation } from '../../../lib/mail';

export const runtime = 'nodejs';

export async function POST() {
  const admin = await getAdmin();

  if (!admin) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (admin.email?.toLowerCase() !== 'jiotwgether@gmail.com') {
    return NextResponse.json(
      { message: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    await sendRegistrationConfirmation({
      name: 'Jio TWgether Test',
      email: 'jiotwgether@gmail.com',
      eventTitle: 'Gmail 自動寄信測試',
      eventDate: '測試信件，非正式活動',
      eventLocation: 'Boston, MA',
    });

    return NextResponse.json({
      message: 'Gmail 已接受測試信件，請檢查收件匣。',
    });
  } catch (error) {
    console.error('Gmail test failed:', error);

    return NextResponse.json(
      { message: '測試信寄送失敗，請查看 Vercel Logs。' },
      { status: 500 }
    );
  }
}
