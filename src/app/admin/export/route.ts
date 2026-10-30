import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServer, isSupabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const COLS: [string, string][] = [
  ['created_at', 'Reçu le'],
  ['kind', 'Type'],
  ['status', 'Statut'],
  ['name', 'Nom'],
  ['phone', 'Téléphone'],
  ['email', 'Email'],
  ['subject', 'Objet'],
  ['consult_type', 'Type de consultation'],
  ['consult_date', 'Date souhaitée'],
  ['consult_time', 'Créneau'],
  ['message', 'Message'],
  ['admin_note', 'Note interne'],
];

function cell(v: unknown) {
  let s = v === null || v === undefined ? '' : String(v);
  // Neutralise les formules Excel injectées (=, +, -, @)
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: NextRequest) {
  if (!isSupabaseConfigured) return new NextResponse('Base non configurée', { status: 503 });
  const supabase = await createSupabaseServer();
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (!isAdmin) return new NextResponse('Accès refusé', { status: 403 });

  const statut = req.nextUrl.searchParams.get('statut');
  const type = req.nextUrl.searchParams.get('type');
  let q = supabase.from('requests').select('*').order('created_at', { ascending: false });
  if (statut) q = q.eq('status', statut);
  if (type) q = q.eq('kind', type);
  const { data, error } = await q;
  if (error) return new NextResponse('Erreur', { status: 500 });

  const lines = [COLS.map(([, h]) => cell(h)).join(';')];
  for (const r of (data ?? []) as Record<string, unknown>[]) {
    lines.push(
      COLS.map(([k]) => cell(k === 'created_at' ? new Date(String(r[k])).toLocaleString('fr-FR') : r[k])).join(';')
    );
  }
  // BOM UTF-8 + séparateur « ; » pour une ouverture directe dans Excel en français
  const body = '﻿' + lines.join('\r\n');
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="pur-essence-demandes-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
