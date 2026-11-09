
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隱私權政策 | Privacy Policy | Jio TWgether',
  description: 'Jio TWgether 揪團啦！隱私權政策',
};

export default function PrivacyPage() {
  return (
    <main style={{
      maxWidth: 820,
      margin: '0 auto',
      padding: '60px 24px',
      lineHeight: 1.9,
      color: '#333'
    }}>
      <h1>隱私權政策 | Privacy Policy</h1>
      <p><strong>Jio TWgether 揪團啦！</strong></p>
      <p>最後更新：2026 年 11 月 9 日</p>

      <h2>中文版</h2>
      <p>
        Jio TWgether（揪團啦！）致力於保護活動參加者的個人資料。
        本政策說明我們如何蒐集、使用、儲存及保護您的資訊。
      </p>

      <h3>一、蒐集的資料</h3>
      <p>
        報名活動時，我們會蒐集姓名、電子郵件地址及相關報名紀錄。
        為維護網站安全，我們也可能處理必要的技術資訊，
        例如 IP 位址的雜湊值。
      </p>

      <h3>二、資料使用目的</h3>
      <p>
        個人資料僅用於活動報名管理、報名確認、
        活動異動通知及其他必要的活動聯繫。
        我們不會寄送行銷電子報。
      </p>

      <h3>三、第三方服務</h3>
      <p>
        我們使用 Supabase 儲存報名資料、
        Vercel 提供網站服務，並計畫使用
        Google Gmail API 寄送活動通知。
        相關服務提供者可能依其政策處理提供服務所需的資訊。
        我們不會出售您的個人資料。
      </p>

      <h3>四、資料保留與刪除</h3>
      <p>
        我們僅在活動管理、必要聯繫及法律要求所需期間保留資料。
        您可以透過 Email 或 Instagram 私訊要求查詢、更正或刪除資料。
        為保障資料安全，我們可能需要確認您的身分。
        我們會在合理期間內處理請求，但依法須保留的資料除外。
      </p>

      <h3>五、資料安全</h3>
      <p>
        我們採取合理的技術及管理措施保護個人資料，
        但任何網路服務均無法保證絕對安全。
      </p>

      <h3>六、政策更新</h3>
      <p>
        我們可能因服務或法律要求的變更更新本政策，
        並於網站公布更新版本。
      </p>

      <h3>七、聯絡方式</h3>
      <p>
        Email：<a href="mailto:jiotwgether@gmail.com">
          jiotwgether@gmail.com
        </a>
        <br />
        Instagram：<a
          href="https://www.instagram.com/jiotwgether/"
          target="_blank"
          rel="noopener noreferrer"
        >@jiotwgether</a>（歡迎私訊我們）
      </p>

      <hr style={{ margin: '48px 0' }} />

      <h2>English Version</h2>
      <p>Last updated: November 9, 2026</p>
      <p>
        Jio TWgether is committed to protecting the personal
        information of event participants. This policy explains
        how we collect, use, store, and protect your information.
      </p>

      <h3>1. Information We Collect</h3>
      <p>
        We collect your name, email address, and registration
        records when you register for an event. We may also
        process limited technical information, such as hashed
        IP addresses, to maintain website security.
      </p>

      <h3>2. How We Use Information</h3>
      <p>
        We use personal information only for event registration
        management, registration confirmations, event updates,
        and essential event-related communications.
        We do not send marketing newsletters.
      </p>

      <h3>3. Third-Party Services</h3>
      <p>
        We use Supabase for registration data storage,
        Vercel for website hosting, and plan to use
        Google Gmail API for event-related emails.
        Service providers may process information necessary
        to deliver their services under their policies.
        We do not sell personal information.
      </p>

      <h3>4. Data Retention and Deletion</h3>
      <p>
        We retain personal information only as reasonably
        necessary for event administration, essential
        communications, and legal requirements.
        You may request access, correction, or deletion
        through email or Instagram direct message.
        We may verify your identity before processing requests.
        We will respond within a reasonable period, subject
        to applicable legal retention requirements.
      </p>

      <h3>5. Data Security</h3>
      <p>
        We take reasonable technical and organizational
        measures to protect personal information.
        However, no internet-based service is completely secure.
      </p>

      <h3>6. Policy Updates</h3>
      <p>
        We may update this policy to reflect changes
        in our services or legal requirements.
        Updated versions will be published on our website.
      </p>

      <h3>7. Contact Us</h3>
      <p>
        Email：<a href="mailto:jiotwgether@gmail.com">
          jiotwgether@gmail.com
        </a>
        <br />
        Instagram：<a
          href="https://www.instagram.com/jiotwgether/"
          target="_blank"
          rel="noopener noreferrer"
        >@jiotwgether</a> (Feel free to DM us.)
      </p>
    </main>
  );
}
