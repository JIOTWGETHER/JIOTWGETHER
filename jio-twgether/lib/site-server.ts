import {serverDb} from './db';import {defaultDesign,normalizeDesign} from './site';
export async function loadDesign(which:'draft'|'published'='published'){try{const {data,error}=await serverDb().from('site_designs').select('content').eq('id',which).maybeSingle();if(error||!data)return defaultDesign;return normalizeDesign(data.content)}catch{return defaultDesign}}
