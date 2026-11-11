
import { getAdmin, logout } from '../../lib/admin';
import { serverDb, type Event } from '../../lib/db';
import { redirect } from 'next/navigation';
import { fromZonedTime } from 'date-fns-tz';

export const dynamic = 'force-dynamic';

const TIME_ZONE = 'America/New_York';

function parseBostonTime(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new Error('Invalid date format');
  }

  const date = fromZonedTime(value, TIME_ZONE);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid event date');
  }

  return date;
}

function displayBostonTime(value: string): string {
  return new Date(value).toLocaleString('zh-TW', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default async function Admin() {
  if (!(await getAdmin())) {
    redirect('/admin/login');
  }

  const db = serverDb();

  const { data: events } = await db
    .from('events')
    .select('*')
    .order('starts_at', { ascending: false });

  const { data: regs } = await db
    .from('registrations')
    .select('id,event_id,name,email,created_at')
    .order('created_at', { ascending: false });

  // 建立新活動
  async function create(f: FormData) {
    'use server';

    if (!(await getAdmin())) {
      throw new Error('Unauthorized');
    }

    const starts = String(f.get('starts_at') || '');
    const ends = String(f.get('ends_at') || '');

    // 明確將輸入時間視為波士頓當地時間
    const startDate = parseBostonTime(starts);
    const endDate = parseBostonTime(ends);

    const payload = {
      title: String(f.get('title') || '').trim().slice(0, 150),
      description: String(f.get('description') || '').slice(0, 3000),
      category: String(f.get('category') || ''),
      location: String(f.get('location') || '').slice(0, 200),
      starts_at: startDate.toISOString(),
      ends_at: endDate.toISOString(),
      capacity: Number(f.get('capacity')),
      price_cents: Math.round(Number(f.get('price')) * 100),
      status: 'draft',
    };

    if (
      !payload.title ||
      !payload.location ||
      !Number.isInteger(payload.capacity) ||
      payload.capacity < 1 ||
      payload.capacity > 100 ||
      !Number.isFinite(payload.price_cents) ||
      payload.price_cents < 0 ||
      endDate <= startDate
    ) {
      throw new Error('Invalid event');
    }

    const { error } = await serverDb()
      .from('events')
      .insert(payload);

    if (error) {
      console.error('Create event failed:', error);
      throw new Error('Failed to create event');
    }

    redirect('/admin');
  }

  // 更新活動狀態
  async function change(f: FormData) {
    'use server';

    if (!(await getAdmin())) {
      throw new Error('Unauthorized');
    }

    const id = String(f.get('id') || '');
    const status = String(f.get('status') || '');

    if (
      !['draft', 'published', 'full', 'cancelled'].includes(status)
    ) {
      throw new Error('Invalid status');
    }

    const { error } = await serverDb()
      .from('events')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw new Error('Failed to update event status');
    }

    redirect('/admin');
  }

  // 取消報名
  async function removeRegistration(f: FormData) {
    'use server';

    if (!(await getAdmin())) {
      throw new Error('Unauthorized');
    }

    const id = String(f.get('id') || '');

    const { error } = await serverDb()
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error('Failed to remove registration');
    }

    redirect('/admin');
  }

  // 登出
  async function signout() {
    'use server';

    await logout();
    redirect('/admin/login');
  }

  return (
    <>
      <div className="actions">
        <h1>活動管理後台 🧡</h1>

        <a className="btn" href="/admin/editor">
          🎨 編輯網站 · Edit Website
        </a>

        <form action={signout}>
          <button className="secondary">登出</button>
        </form>
      </div>

      <div className="banner">
        活動建立後預設為草稿，需手動發布。
        所有活動時間均以波士頓時間（ET）為準。
        報名資料只在管理後台顯示。
      </div>

      {/* 新增活動 */}
      <section className="card">
        <h2>＋ 新增活動</h2>

        <form action={create}>
          <div className="grid">
            <div>
              <label>活動名稱</label>
              <input
                name="title"
                required
                maxLength={150}
              />
            </div>

            <div>
              <label>分類</label>
              <select name="category">
                <option>手作</option>
                <option>運動</option>
                <option>戶外</option>
                <option>聚會</option>
              </select>
            </div>

            <div>
              <label>開始時間（波士頓時間）</label>
              <input
                type="datetime-local"
                name="starts_at"
                required
              />
            </div>

            <div>
              <label>結束時間（波士頓時間）</label>
              <input
                type="datetime-local"
                name="ends_at"
                required
              />
            </div>

            <div>
              <label>地點</label>
              <input
                name="location"
                required
                maxLength={200}
              />
            </div>

            <div>
              <label>人數上限</label>
              <input
                name="capacity"
                type="number"
                min="1"
                max="100"
                defaultValue="5"
                required
              />
            </div>

            <div>
              <label>費用（美元）</label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue="0"
                required
              />
            </div>
          </div>

          <label>活動介紹</label>
          <textarea
            name="description"
            required
          />

          <p>
            <button type="submit">
              儲存草稿
            </button>
          </p>
        </form>
      </section>

      {/* 活動列表 */}
      <section>
        <h2>活動列表</h2>

        <div className="grid">
          {(events || []).map((e: Event) => (
            <div className="card" key={e.id}>
              <h3>{e.title}</h3>

              <p>
                📅 {displayBostonTime(e.starts_at)}
              </p>

              <p>📍 {e.location}</p>

              <p>
                狀態：{e.status} · 名額：{e.capacity}
              </p>

              <form action={change} className="actions">
                <input
                  type="hidden"
                  name="id"
                  value={e.id}
                />

                <select
                  name="status"
                  defaultValue={e.status}
                  style={{ width: 160 }}
                >
                  <option value="draft">草稿</option>
                  <option value="published">開放報名</option>
                  <option value="full">額滿</option>
                  <option value="cancelled">取消</option>
                </select>

                <button type="submit">
                  更新狀態
                </button>
              </form>
            </div>
          ))}
        </div>
      </section>

      {/* 報名名單 */}
      <section>
        <h2>報名名單（{regs?.length || 0}）</h2>

        <div className="scroll">
          <table>
            <thead>
              <tr>
                <th>活動</th>
                <th>姓名</th>
                <th>Email</th>
                <th>報名時間</th>
                <th>管理</th>
              </tr>
            </thead>

            <tbody>
              {(regs || []).map(r => (
                <tr key={r.id}>
                  <td>
                    {(events || []).find(
                      e => e.id === r.event_id
                    )?.title || '已刪除活動'}
                  </td>

                  <td>{r.name}</td>
                  <td>{r.email}</td>

                  <td>
                    {new Date(
                      r.created_at
                    ).toLocaleDateString('zh-TW', {
                      timeZone: TIME_ZONE,
                    })}
                  </td>

                  <td>
                    <form action={removeRegistration}>
                      <input
                        type="hidden"
                        name="id"
                        value={r.id}
                      />

                      <button
                        type="submit"
                        className="secondary"
                      >
                        取消報名
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
