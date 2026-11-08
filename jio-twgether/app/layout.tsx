import './globals.css';import Link from 'next/link';
export const metadata={title:'Jio TWgether｜揪團啦！',description:'波士頓台灣人的小小聚會。離家很遠，也可以離彼此近一點。'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="zh-Hant"><body><header><nav><Link href="/"><strong>☀️ Jio TWgether｜揪團啦！</strong></Link><div><Link href="/">首頁</Link><Link href="/#events">近期活動</Link><Link href="/#about">關於我們</Link><Link href="/admin">管理後台</Link></div></nav></header><main>{children}</main><footer>🇹🇼 Jio TWgether · Boston　♡ 離家很遠，也可以離彼此近一點。</footer></body></html>}
