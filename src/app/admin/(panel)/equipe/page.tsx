import { requireAdmin } from '@/lib/admin';
import { imgSrc } from '@/lib/format';
import type { TeamMember } from '@/lib/types';
import { deleteTeamMember, saveTeamMember } from '../../actions';

function MemberForm({ m }: { m?: TeamMember }) {
  return (
    <form action={saveTeamMember} className="admin-form">
      {m && <input type="hidden" name="id" value={m.id} />}
      <input type="hidden" name="photo_url" value={m?.photo_url ?? ''} />
      <div className="grid-3">
        <label>
          Nom
          <input type="text" name="name" required defaultValue={m?.name} />
        </label>
        <label>
          Rôle
          <input type="text" name="role" defaultValue={m?.role} placeholder="Ex. Conseillère bien-être" />
        </label>
        <label>
          Ordre
          <input type="number" name="sort" defaultValue={m?.sort ?? 0} />
        </label>
      </div>
      <div className="btn-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {m?.photo_url && <img src={imgSrc(m.photo_url) ?? ''} alt="" className="img-preview" style={{ width: 64, height: 64 }} />}
        <label style={{ flex: 1 }}>
          Photo
          <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" />
        </label>
        <label className="checks" style={{ display: 'flex' }}>
          <input type="checkbox" name="published" defaultChecked={m?.published ?? true} /> Visible sur le site
        </label>
        <button className="btn primary">{m ? 'Enregistrer' : 'Ajouter'}</button>
      </div>
    </form>
  );
}

export default async function AdminTeam() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from('team').select('*').order('sort');
  const team = (data as TeamMember[]) ?? [];
  return (
    <>
      <h1>Équipe</h1>
      <p className="sub">Affichée sur la page « À propos ». N'ajoutez que des personnes réelles qui ont donné leur accord.</p>
      {team.map((m) => (
        <div key={m.id} className="panel">
          <MemberForm m={m} />
          <form action={deleteTeamMember} style={{ marginTop: '.6rem' }}>
            <input type="hidden" name="id" value={m.id} />
            <button className="btn danger">Supprimer</button>
          </form>
        </div>
      ))}
      <div className="panel">
        <h2 style={{ fontSize: '1.05rem', marginBottom: '.8rem' }}>Ajouter un membre</h2>
        <MemberForm />
      </div>
    </>
  );
}
