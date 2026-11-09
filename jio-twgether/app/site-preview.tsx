
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { SiteDesign } from '../lib/site';
import { Event } from '../lib/db';

export default function SitePreview({
  design: d,
  events = [],
  preview = false
}: {
  design: SiteDesign;
  events?: Event[];
  preview?: boolean;
}) {
  return (
    <div
      className="site-canvas"
      style={{
        background: d.background,
        '--site-accent': d.accent
      } as CSSProperties}
    >
      {d.blocks.filter(b => b.enabled).map(b => (
        <div key={b.id} className={'site-block site-' + b.type}>
          {b.type === 'hero' ? (
            <div className="hero">
              <div className="sun">☀️ 🇹🇼 🧡</div>
              <span className="pill">
                {d.subtitleZh}
                <small>{d.subtitleEn}</small>
              </span>
              <h1>揪團啦！</h1>
              <h2>Jio TWgether</h2>
              <p>
                {d.heroZh}
                <small>{d.heroEn}</small>
              </p>
              <div className="decor">🌷 ☕ 🏸 🎨</div>
              <a className="btn" href="#events">
                探索近期活動 · Explore Events
              </a>
            </div>
          ) : b.type === 'features' ? (
            <section>
              <div className="grid">
                <div className="card">
                  👥 <b>3–5 人小團</b>
                  <p>Small-group gatherings</p>
                </div>
                <div className="card">
                  🧡 <b>一個人也歡迎</b>
                  <p>Come as you are</p>
                </div>
                <div className="card">
                  🗓️ <b>每月約兩場</b>
                  <p>About two events a month</p>
                </div>
              </div>
            </section>
          ) : b.type === 'events' ? (
            <section id="events">
              <h2>近期活動 · Upcoming Events 🌼</h2>

              {events.length === 0 ? (
                <div className="banner">
                  活動籌備中 · Events coming soon!
                  Instagram @jiotwgether
                </div>
              ) : (
                <div className="grid">
                  {events.map(e => (
                    <article className="card" key={e.id}>
                      <div style={{ fontSize: 34 }}>🌿</div>
                      <h3>{e.title}</h3>
                      <p className="muted">
                        📅 {new Date(e.starts_at).toLocaleString(
                          'zh-TW',
                          {
                            timeZone: 'America/New_York',
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          }
                        )}
                      </p>
                      <p>📍 {e.location}</p>
                      <p>
                        👥 {e.capacity} spots ·{' '}
                        {e.price_cents === 0
                          ? '免費 · Free'
                          : `$${(e.price_cents / 100).toFixed(2)}`}
                      </p>
                      {preview ? (
                        <span className="btn">
                          查看詳情 · Details
                        </span>
                      ) : (
                        <Link
                          className="btn"
                          href={`/events/${e.id}`}
                        >
                          查看詳情 · Details
                        </Link>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section id="about">
              <h2>關於我們 · About Us 🧡</h2>
              <div className="banner">
                {d.aboutZh}
                <p>{d.aboutEn}</p>
              </div>
            </section>
          )}
        </div>
      ))}

      {/* 網站頁尾 */}
      <footer
        style={{
          textAlign: 'center',
          padding: '36px 20px',
          marginTop: 40,
          borderTop: '1px solid rgba(100, 70, 50, 0.15)'
        }}
      >
        <h3 style={{ marginBottom: 8 }}>
          Jio TWgether 🧡
        </h3>

        <p style={{ fontSize: 14, marginBottom: 20 }}>
          波士頓台灣人的小小聚會
          <br />
          Small gatherings for Taiwanese in Boston
        </p>

        <nav
          aria-label="Footer navigation"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '12px 24px',
            fontSize: 14
          }}
        >
          <Link href="/privacy">
            隱私權政策 | Privacy Policy
          </Link>

          <a
            href="https://www.instagram.com/jiotwgether/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>

          <a href="mailto:jiotwgether@gmail.com">
            聯絡我們 | Contact
          </a>
        </nav>

        <p
          style={{
            fontSize: 12,
            opacity: 0.65,
            marginTop: 24
          }}
        >
          © 2026 Jio TWgether
        </p>
      </footer>
    </div>
  );
}
