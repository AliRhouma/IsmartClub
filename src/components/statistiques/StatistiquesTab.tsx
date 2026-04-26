import { useState, useCallback } from 'react';
import { BarChart3, FolderOpen } from 'lucide-react';
import type { ScreenId } from './data';
import { C } from './data';
import { DashboardHome } from './DashboardHome';
import { NewChartModal } from './NewChartModal';
import { ConfigureModal } from './ConfigureModal';
import { AIGeneratedModal } from './AIGeneratedModal';
import { AlertsPanel } from './AlertsPanel';
import { ExportModal } from './ExportModal';
import { Toast, PrimaryBtn, SecondaryBtn } from './Primitives';
import { FoldersView } from './FoldersView';

type SubTab = 'dashboard' | 'folders';

const SUB_TABS: { id: SubTab; label: string; icon: typeof BarChart3 }[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: BarChart3 },
  { id: 'folders', label: 'Dossiers', icon: FolderOpen },
];

export function StatistiquesTab() {
  const [subTab, setSubTab] = useState<SubTab>('dashboard');
  const [screen, setScreen] = useState<ScreenId>('dashboard');
  const [editMode, setEditMode] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState('compare');
  const [toast, setToast] = useState<string | null>(null);

  const navigate = useCallback((s: ScreenId) => {
    if (s === 'editMode') {
      setEditMode(true);
      setScreen('dashboard');
    } else {
      setEditMode(false);
      setScreen(s);
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  const handleAddToDashboard = useCallback(() => {
    setScreen('dashboard');
    showToast('Graphique ajouté au tableau de bord');
  }, [showToast]);

  return (
    <div style={{ fontFamily: "'Rubik', sans-serif", background: C.bg, minHeight: 500, position: 'relative' }}>
      <style>{`
        @keyframes statFadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes statScaleIn { from { opacity: 0; transform: scale(.96) } to { opacity: 1; transform: scale(1) } }
        @keyframes statSlideInRight { from { transform: translateX(100%) } to { transform: translateX(0) } }
        @keyframes statPulse { 0%, 100% { opacity: .4 } 50% { opacity: .8 } }
      `}</style>

      <div style={{
        display: 'flex', gap: 0, padding: '0 24px',
        borderBottom: `1px solid ${C.border}`,
        background: C.card,
      }}>
        {SUB_TABS.map(tab => {
          const isActive = subTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '12px 20px', border: 'none', cursor: 'pointer',
                background: 'transparent',
                borderBottom: `2px solid ${isActive ? C.brand : 'transparent'}`,
                color: isActive ? C.text : C.sub,
                fontSize: 13, fontWeight: isActive ? 600 : 500,
                fontFamily: "'Rubik', sans-serif",
                transition: 'all 150ms',
                marginBottom: -1,
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.color = C.text;
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.color = C.sub;
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {subTab === 'dashboard' && (
        <>
          <DashboardHome onNavigate={navigate} editMode={editMode} />

          {editMode && (
            <div style={{
              position: 'sticky', bottom: 0, left: 0, right: 0,
              background: C.card, borderTop: `1px solid ${C.border}`,
              padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              zIndex: 100,
            }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Mode édition</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <SecondaryBtn onClick={() => setEditMode(false)}>Annuler</SecondaryBtn>
                <PrimaryBtn onClick={() => { setEditMode(false); showToast('Disposition sauvegardée'); }}>
                  Sauvegarder la disposition
                </PrimaryBtn>
              </div>
            </div>
          )}

          {screen === 'newChart' && (
            <NewChartModal
              onClose={() => setScreen('dashboard')}
              onNavigate={navigate}
              onSelectAnalysis={setSelectedAnalysis}
            />
          )}

          {screen === 'configure' && (
            <ConfigureModal
              analysisId={selectedAnalysis}
              onClose={() => setScreen('dashboard')}
              onNavigate={navigate}
              onDone={handleAddToDashboard}
            />
          )}

          {screen === 'aiGenerated' && (
            <AIGeneratedModal
              onClose={() => setScreen('dashboard')}
              onNavigate={navigate}
              onDone={handleAddToDashboard}
            />
          )}

          {screen === 'alerts' && (
            <AlertsPanel
              onClose={() => setScreen('dashboard')}
              onNavigate={navigate}
              onShowToast={showToast}
            />
          )}

          {screen === 'export' && (
            <ExportModal
              onClose={() => setScreen('dashboard')}
              onShowToast={showToast}
            />
          )}
        </>
      )}

      {subTab === 'folders' && <FoldersView />}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
