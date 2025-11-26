
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import NovelEditor from './components/NovelEditor';

const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-custom-bg font-sans text-custom-text antialiased">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <NovelEditor />
        </main>
      </div>
    </div>
  );
};

export default App;