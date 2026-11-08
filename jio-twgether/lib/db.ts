import {createClient} from '@supabase/supabase-js';
export function publicDb(){return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{auth:{persistSession:false}})}
export function serverDb(){return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false}})}
export type Event={id:string;title:string;description:string;category:string;location:string;starts_at:string;ends_at:string;price_cents:number;capacity:number;status:string;image_url:string|null;created_at:string};
