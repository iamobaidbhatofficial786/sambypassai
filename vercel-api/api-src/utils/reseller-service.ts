import { supabase } from './supabase';
import { PostgrestError } from '@supabase/supabase-js';

export interface Reseller {
  id: string;
  reseller_name: string;
  company_name?: string | null;
  telegram_username?: string | null;
  whatsapp_number?: string | null;
  support_email?: string | null;
  website?: string | null;
  logo_url?: string | null;
  status: 'active' | 'disabled';
  created_at: string;
  updated_at: string;
}

/** CRUD operations */
export async function listResellers(search?: string): Promise<{ data: Reseller[]; error: PostgrestError | null }> {
  let query = supabase.from('resellers').select('*');
  if (search) {
    query = query.ilike('reseller_name', `%${search}%`).or(`company_name.ilike.%${search}%`);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  return { data: (data as Reseller[]) || [], error };
}

export async function getReseller(id: string): Promise<{ data: Reseller | null; error: PostgrestError | null }> {
  const { data, error } = await supabase.from('resellers').select('*').eq('id', id).single();
  return { data: data as Reseller | null, error };
}

export async function createReseller(payload: Omit<Reseller, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: Reseller | null; error: PostgrestError | null }> {
  const { data, error } = await supabase.from('resellers').insert(payload).select('*').single();
  return { data: data as Reseller | null, error };
}

export async function updateReseller(id: string, payload: Partial<Omit<Reseller, 'id' | 'created_at' | 'updated_at'>>): Promise<{ data: Reseller | null; error: PostgrestError | null }> {
  const { data, error } = await supabase.from('resellers').update(payload).eq('id', id).select('*').single();
  return { data: data as Reseller * null, error };
}

export async function toggleResellerStatus(id: string, enable: boolean): Promise<{ data: Reseller | null; error: PostgrestError | null }> {
  const status = enable ? 'active' : 'disabled';
  const { data, error } = await supabase.from('resellers').update({ status }).eq('id', id).select('*').single();
  return { data: data as Reseller | null, error };
}

export async function deleteReseller(id: string): Promise<{ error: PostgrestError | null }> {
  const { error } = await supabase.from('resellers').delete().eq('id', id);
  return { error };
}

export async function generateLicenseForReseller(resellerId: string, licensePayload: any): Promise<{ data: any; error: PostgrestError | null }> {
  const payload = { ...licensePayload, reseller_id: resellerId };
  const { data, error } = await supabase.from('licenses').insert(payload).select('*').single();
  return { data, error };
}
