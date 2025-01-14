import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../types/Location';
import { locations } from '../data/locations';
import { Search } from 'lucide-react';

const Map = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = locations.filter(location => 
      location.nama.toLowerCase().includes(term.toLowerCase()) ||
      location.kategori.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredLocations(filtered);
  };

  const categories = [...new Set(locations.map(loc => loc.kategori))];

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari lokasi..."
            className="w-full p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
      
      <MapContainer
        center={[-6.200000, 106.816666]} // Jakarta
        zoom={12}
        className="flex-1 z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LayersControl position="topright">
          {categories.map(category => (
            <LayersControl.Overlay name={category} key={category}>
              <LayerGroup>
                {filteredLocations
                  .filter(location => location.kategori === category)
                  .map(location => (
                    <Marker
                      key={location.id}
                      position={[location.latitude, location.longitude]}
                    >
                      <Popup>
                        <div>
                          <h3 className="font-bold">{location.nama}</h3>
                          <p className="text-sm text-gray-600">{location.deskripsi}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Koordinat: {location.latitude}, {location.longitude}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </LayerGroup>
            </LayersControl.Overlay>
          ))}
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default Map;