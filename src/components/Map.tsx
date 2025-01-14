import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayerGroup, LayersControl, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../types/Location';
import { locations } from '../data/locations';
import { Search } from 'lucide-react';
import L from 'leaflet';

// Koordinat poligon kawasan pusat kota Pekanbaru
const kawasanPusatKota = [
  [0.510123, 101.452180],
  [0.509389, 101.443806],
  [0.518599, 101.444752],
  [0.528133, 101.451974],
  [0.510209, 101.458404]
];

// Koordinat poligon kawasan pendidikan
const kawasanPendidikan = [
  [0.498987, 101.415415], // UMRI
  [0.467964, 101.400623], // SMK Kansai
  [0.476286, 101.380939], // UNRI
  [0.489946, 101.362335]  // SMPN 40
];

// Komponen untuk mengatur tampilan peta
function MapController({ searchLocation }: { searchLocation: Location | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (searchLocation) {
      map.setView(
        [searchLocation.latitude, searchLocation.longitude],
        16, // zoom level yang lebih dekat
        {
          animate: true,
          duration: 1 // durasi animasi dalam detik
        }
      );
    }
  }, [searchLocation, map]);

  return null;
}

const Map = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLocations, setFilteredLocations] = useState<Location[]>(locations);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = locations.filter(location => 
      location.nama.toLowerCase().includes(term.toLowerCase()) ||
      location.kategori.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredLocations(filtered);

    // Jika hanya ada satu hasil pencarian, langsung arahkan ke lokasi tersebut
    if (filtered.length === 1) {
      setSelectedLocation(filtered[0]);
    } else {
      setSelectedLocation(null);
    }
  };

  const categories = [...new Set(locations.map(loc => loc.kategori))];

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari lokasi (contoh: SMK Kansai)"
            className="w-full p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        {/* Tampilkan hasil pencarian */}
        {searchTerm && filteredLocations.length > 0 && (
          <div className="mt-2 border rounded-lg bg-white shadow-sm">
            {filteredLocations.map(location => (
              <div
                key={location.id}
                className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                onClick={() => setSelectedLocation(location)}
              >
                <div className="font-semibold">{location.nama}</div>
                <div className="text-sm text-gray-600">{location.kategori}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <MapContainer
        center={[0.525584, 101.451610]} // Koordinat Pekanbaru
        zoom={13}
        className="flex-1 z-0"
      >
        <MapController searchLocation={selectedLocation} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <LayersControl position="topright">
          {/* Layer Kawasan */}
          <LayersControl.Overlay name="Kawasan Pusat Kota">
            <Polygon
              positions={kawasanPusatKota}
              pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }}
            />
          </LayersControl.Overlay>
          
          <LayersControl.Overlay name="Kawasan Pendidikan">
            <Polygon
              positions={kawasanPendidikan}
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.2 }}
            />
          </LayersControl.Overlay>

          {/* Layer Marker Lokasi */}
          {categories.map(category => (
            <LayersControl.Overlay checked name={category} key={category}>
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