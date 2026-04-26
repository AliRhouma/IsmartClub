import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { C } from './data';
import { ModalShell, ModalHeader, PrimaryBtn, SecondaryBtn } from './Primitives';

interface NewFolderModalProps {
  onClose: () => void;
  onCreate: (name: string) => void;
}

export function NewFolderModal({ onClose, onCreate }: NewFolderModalProps) {
  const [name, setName] = useState('');

  return (
    <ModalShell onClose={onClose} width={480}>
      <ModalHeader
        title="Nouveau dossier"
        subtitle="Organisez vos graphiques par thème"
        onClose={onClose}
      />

      <div style={{ padding: '24px 22px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14,
          background: `${C.brand}1a`, border: `1px solid ${C.brand}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <FolderPlus size={24} color={C.brand} />
        </div>

        <label style={{
          display: 'block', fontSize: 12, fontWeight: 600,
          color: C.sub, marginBottom: 8, letterSpacing: '.02em',
        }}>
          Nom du dossier
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="ex. Analyse offensive Q1"
          autoFocus
          onKeyDown={e => {
            if (e.key === 'Enter' && name.trim()) onCreate(name.trim());
          }}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: C.card2, border: `1px solid ${C.border2}`,
            borderRadius: 10, padding: '12px 16px',
            color: C.text, fontSize: 14,
            fontFamily: "'Rubik', sans-serif",
            outline: 'none', transition: 'border-color 150ms',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = C.brand; }}
          onBlur={e => { e.currentTarget.style.borderColor = C.border2; }}
        />
      </div>

      <div style={{
        padding: '16px 22px', borderTop: `1px solid ${C.border}`,
        display: 'flex', justifyContent: 'flex-end', gap: 10,
      }}>
        <SecondaryBtn onClick={onClose}>Annuler</SecondaryBtn>
        <PrimaryBtn
          onClick={() => name.trim() && onCreate(name.trim())}
          disabled={!name.trim()}
        >
          <FolderPlus size={14} />
          Créer le dossier
        </PrimaryBtn>
      </div>
    </ModalShell>
  );
}
