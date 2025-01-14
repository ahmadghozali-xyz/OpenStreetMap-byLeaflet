import React from 'react';
import Map from './components/Map';
import { MapPin } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center gap-2">
          <MapPin size={24} />
          <h1 className="text-xl font-bold">Sistem Informasi Geografis</h1>
        </div>
      </header>
      
      <main className="h-[calc(100vh-64px)]">
        <Map />
      </main>
    </div>
  );
}

export default App;