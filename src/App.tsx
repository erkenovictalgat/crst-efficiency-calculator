import { useState, useMemo } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { OrganizationType, OrderStatus, LegalClient } from './types';
import { mockClients } from './data/mockData';
import MapMarker from './components/MapMarker';
import FilterPanel from './components/FilterPanel';
import ClientSidebar from './components/ClientSidebar';
import EfficiencyCalculator from './components/EfficiencyCalculator';

function App() {
  const [view, setView] = useState<'map' | 'efficiency'>('map');
  const [selectedTypes, setSelectedTypes] = useState<OrganizationType[]>([
    'school',
    'hospital',
    'police',
    'prosecutor',
    'knb',
    'ip',
    'too'
  ]);
  const [selectedStatuses, setSelectedStatuses] = useState<OrderStatus[]>([
    'new',
    'in_progress',
    'completed',
    'pending'
  ]);
  const [selectedClient, setSelectedClient] = useState<LegalClient | null>(null);

  const filteredClients = useMemo(() => {
    return mockClients.filter(
      (client) =>
        selectedTypes.includes(client.type) &&
        selectedStatuses.includes(client.status)
    );
  }, [selectedTypes, selectedStatuses]);

  const handleTypeToggle = (type: OrganizationType) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  const handleStatusToggle = (status: OrderStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const center: [number, number] = [53.2855, 69.3955]; // Kokshetau center

  return (
    <div className="h-screen w-screen flex">
      {/* Sidebar with filters */}
      <div className="w-80 bg-gray-50 p-4 overflow-y-auto border-r">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Система ЦРСТ
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            Участок инсталляции и текущего развития
          </p>
          
          {/* View toggle buttons */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setView('map')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Карта
            </button>
            <button
              onClick={() => setView('efficiency')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'efficiency'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Эффективность
            </button>
          </div>
        </div>

        {view === 'map' && (
          <>
            <FilterPanel
              selectedTypes={selectedTypes}
              selectedStatuses={selectedStatuses}
              onTypeToggle={handleTypeToggle}
              onStatusToggle={handleStatusToggle}
            />

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Статистика</h3>
              <p className="text-sm text-blue-700">
                Всего объектов: {filteredClients.length}
              </p>
              <p className="text-sm text-blue-700">
                Новых: {filteredClients.filter(c => c.status === 'new').length}
              </p>
              <p className="text-sm text-blue-700">
                В работе: {filteredClients.filter(c => c.status === 'in_progress').length}
              </p>
              <p className="text-sm text-blue-700">
                Подключено: {filteredClients.filter(c => c.status === 'completed').length}
              </p>
            </div>

            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Легенда</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-blue-500 rounded-full"></span>
                  <span>Новый</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-orange-500 rounded-full"></span>
                  <span>В работе</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                  <span>Подключен</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 bg-gray-500 rounded-full"></span>
                  <span>Ожидание</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 relative overflow-hidden">
        {view === 'map' ? (
          <MapContainer
            center={center}
            zoom={8}
            style={{ height: '100%', width: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredClients.map((client) => (
              <MapMarker
                key={client.id}
                client={client}
                onSelect={setSelectedClient}
              />
            ))}
          </MapContainer>
        ) : (
          <div className="h-full overflow-y-auto">
            <EfficiencyCalculator />
          </div>
        )}
      </div>

      {/* Client detail sidebar */}
      {view === 'map' && (
        <ClientSidebar client={selectedClient} onClose={() => setSelectedClient(null)} />
      )}
    </div>
  );
}

export default App;
