import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import FlowCanvas from './components/Canvas/FlowCanvas';
import NodesPanel from './components/Sidebars/NodesPanel';
import SettingsPanel from './components/Sidebars/SettingsPanel';
import ThemeSwitcher from './components/Header/ThemeSwitcher';
import { useUiStore } from './state/useUiStore';
import { useFlowStore } from './state/useFlowStore';

function App() {
  const { load, selectedNodeId } = useFlowStore();
  const { theme } = useUiStore();

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className={`h-screen w-screen overflow-hidden bg-gray-100 theme-${theme}`}>
      {/* top-left theme switch */}
      <ThemeSwitcher />

      <div className="h-full flex">
        {/* canvas */}
        <div className="flex-1">
          <FlowCanvas />
        </div>

        {/* sidebar */}
        <aside className="w-[360px] border-l bg-white">
          {selectedNodeId ? <SettingsPanel /> : <NodesPanel />}
        </aside>
      </div>

      {/* IMPORTANT: do NOT force white text globally; keep defaults so custom toasts are readable */}
      <Toaster
        position="top-center"
        toastOptions={{
          // leave base text color default (dark)
          success: { style: { background: '#10b981', color: '#fff' } },
          error:   { style: { background: '#ef4444', color: '#fff' } },
        }}
      />
    </div>
  );
}

export default App;
