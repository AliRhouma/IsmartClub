import { useState, useCallback } from 'react';
import { FolderOpen, Plus, BarChart3, TrendingUp, LayoutGrid } from 'lucide-react';
import { C } from './data';
import { PrimaryBtn, SecondaryBtn, Toast } from './Primitives';
import { DEMO_FOLDERS, NEW_GRAPH_CONVERSATION_ID } from './graphChatData';
import type { StatsFolder, FolderGraph } from './graphChatData';
import { NewFolderModal } from './NewFolderModal';
import { FolderDetailView } from './FolderDetailView';
import { GraphLibraryView } from './GraphLibraryView';
import { GraphAIChatPanel } from './GraphAIChatPanel';

type View = 'list' | 'detail' | 'library';

function FolderCard({ folder, onClick }: { folder: StatsFolder; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 12, padding: '22px 20px',
        cursor: 'pointer', textAlign: 'left',
        fontFamily: "'Rubik', sans-serif",
        transition: 'all 200ms', display: 'flex', flexDirection: 'column', gap: 0,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = C.brand;
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.border;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `${C.brand}1a`, border: `1px solid ${C.brand}26`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FolderOpen size={20} color={C.brand} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 11, color: C.sub, fontWeight: 500,
        }}>
          <BarChart3 size={12} />
          {folder.graphCount}
        </div>
      </div>

      <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>
        {folder.name}
      </div>
      <div style={{ fontSize: 12, color: C.sub }}>
        {folder.graphCount} graphique{folder.graphCount !== 1 ? 's' : ''} &middot; {folder.createdAt}
      </div>
    </button>
  );
}

function EmptyFolders({ onCreate }: { onCreate: () => void }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 20px',
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 20,
        background: C.card, border: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <FolderOpen size={32} color={C.n300} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: C.text, marginBottom: 6 }}>
        Aucun dossier
      </div>
      <div style={{ fontSize: 13, color: C.sub, marginBottom: 24, textAlign: 'center', maxWidth: 340 }}>
        Créez votre premier dossier pour organiser vos graphiques d'analyse statistique
      </div>
      <PrimaryBtn onClick={onCreate}>
        <Plus size={14} />
        Créer un dossier
      </PrimaryBtn>
    </div>
  );
}

export function FoldersView() {
  const [folders, setFolders] = useState<StatsFolder[]>(DEMO_FOLDERS);
  const [view, setView] = useState<View>('list');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiChatConversationId, setAiChatConversationId] = useState<string>(NEW_GRAPH_CONVERSATION_ID);
  const [aiChatIsHistory, setAiChatIsHistory] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const activeFolder = folders.find(f => f.id === activeFolderId) || null;

  const openFolder = useCallback((id: string) => {
    setActiveFolderId(id);
    setView('detail');
  }, []);

  const handleCreateFolder = useCallback((name: string) => {
    const newFolder: StatsFolder = {
      id: `folder-${Date.now()}`,
      name,
      graphCount: 0,
      createdAt: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
      graphs: [],
    };
    setFolders(prev => [newFolder, ...prev]);
    setShowNewFolderModal(false);
    setActiveFolderId(newFolder.id);
    setView('detail');
  }, []);

  const handleOpenNewChat = useCallback(() => {
    setAiChatConversationId(NEW_GRAPH_CONVERSATION_ID);
    setAiChatIsHistory(false);
    setShowAIChat(true);
  }, []);

  const handleViewConversation = useCallback((conversationId: string) => {
    setAiChatConversationId(conversationId);
    setAiChatIsHistory(true);
    setShowAIChat(true);
  }, []);

  const handleSaveGraph = useCallback((title: string, chartType: string) => {
    if (!activeFolderId) return;

    const newGraph: FolderGraph = {
      id: `g-${Date.now()}`,
      title,
      subtitle: '5 derniers matchs',
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
      chartType: chartType as FolderGraph['chartType'],
      conversationId: NEW_GRAPH_CONVERSATION_ID,
    };

    setFolders(prev => prev.map(f => {
      if (f.id !== activeFolderId) return f;
      return {
        ...f,
        graphs: [...f.graphs, newGraph],
        graphCount: f.graphCount + 1,
      };
    }));

    setShowAIChat(false);
    setToast('Graphique sauvegardé dans le dossier');
  }, [activeFolderId]);

  return (
    <div style={{ fontFamily: "'Rubik', sans-serif", minHeight: 400 }}>
      {view === 'list' && (
        <div style={{ padding: '20px 24px', animation: 'statFadeIn 200ms ease' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 24,
          }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>
                Dossiers statistiques
              </h2>
              <div style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>
                {folders.length} dossier{folders.length !== 1 ? 's' : ''} &middot; Organisez vos analyses par thème
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SecondaryBtn onClick={() => setView('library')}>
                <LayoutGrid size={14} />
                Bibliothèque de graphiques
              </SecondaryBtn>
              <PrimaryBtn onClick={() => setShowNewFolderModal(true)}>
                <Plus size={14} />
                Nouveau dossier
              </PrimaryBtn>
            </div>
          </div>

          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 10, padding: '12px 16px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <TrendingUp size={14} color={C.brand} />
            <span style={{ fontSize: 12, color: C.sub }}>
              <strong style={{ color: C.text }}>
                {folders.reduce((sum, f) => sum + f.graphCount, 0)}
              </strong>{' '}
              graphiques au total dans{' '}
              <strong style={{ color: C.text }}>{folders.length}</strong> dossiers
            </span>
          </div>

          {folders.length === 0 ? (
            <EmptyFolders onCreate={() => setShowNewFolderModal(true)} />
          ) : (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
            }}>
              {folders.map(folder => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => openFolder(folder.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'detail' && activeFolder && (
        <FolderDetailView
          folder={activeFolder}
          onBack={() => setView('list')}
          onAddGraph={handleOpenNewChat}
          onViewConversation={handleViewConversation}
        />
      )}

      {view === 'library' && (
        <GraphLibraryView onBack={() => setView('list')} />
      )}

      {showNewFolderModal && (
        <NewFolderModal
          onClose={() => setShowNewFolderModal(false)}
          onCreate={handleCreateFolder}
        />
      )}

      {showAIChat && (
        <GraphAIChatPanel
          conversationId={aiChatConversationId}
          isHistory={aiChatIsHistory}
          onClose={() => setShowAIChat(false)}
          onSave={handleSaveGraph}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
