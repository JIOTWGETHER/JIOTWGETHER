import {publicDb,Event} from '../lib/db';import {loadDesign} from '../lib/site-server';import SitePreview from './site-preview';
export const dynamic='force-dynamic';
export default async function Home(){const [{data},design]=await Promise.all([publicDb().from('events').select('*').in('status',['published','full']).order('starts_at',{ascending:true}),loadDesign()]);return <SitePreview design={design} events={(data||[]) as Event[]}/>}
