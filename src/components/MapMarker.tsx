import { Marker, Popup } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { LegalClient, OrderStatus } from '../types';
import { organizationTypeLabels, statusLabels } from '../data/mockData';

interface MapMarkerProps {
  client: LegalClient;
  onSelect: (client: LegalClient) => void;
}

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case 'new':
      return '#3b82f6'; // blue
    case 'in_progress':
      return '#f59e0b'; // orange
    case 'completed':
      return '#10b981'; // green
    case 'pending':
      return '#6b7280'; // gray
    default:
      return '#ef4444'; // red
  }
};

const getOrganizationIcon = (type: string): string => {
  const icons: Record<string, string> = {
    school: '🏫',
    hospital: '🏥',
    police: '👮',
    prosecutor: '⚖️',
    knb: '🛡️',
    ip: '👤',
    too: '🏢'
  };
  return icons[type] || '📍';
};

export default function MapMarker({ client, onSelect }: MapMarkerProps) {
  const color = getStatusColor(client.status);
  const emoji = getOrganizationIcon(client.type);

  const customIcon = new DivIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        ${emoji}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
  });

  return (
    <Marker
      position={[client.lat, client.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => onSelect(client)
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-bold text-sm">{client.name}</h3>
          <p className="text-xs text-gray-600">{client.address}</p>
          <p className="text-xs mt-1">
            <span className="font-semibold">Статус:</span> {statusLabels[client.status]}
          </p>
          <p className="text-xs">
            <span className="font-semibold">Тип:</span> {organizationTypeLabels[client.type]}
          </p>
        </div>
      </Popup>
    </Marker>
  );
}
