import { OrganizationType, OrderStatus } from '../types';
import { organizationTypeLabels, statusLabels } from '../data/mockData';
import { cn } from '../utils/cn';

interface FilterPanelProps {
  selectedTypes: OrganizationType[];
  selectedStatuses: OrderStatus[];
  onTypeToggle: (type: OrganizationType) => void;
  onStatusToggle: (status: OrderStatus) => void;
}

export default function FilterPanel({
  selectedTypes,
  selectedStatuses,
  onTypeToggle,
  onStatusToggle
}: FilterPanelProps) {
  const types: OrganizationType[] = ['school', 'hospital', 'police', 'prosecutor', 'knb', 'ip', 'too'];
  const statuses: OrderStatus[] = ['new', 'in_progress', 'completed', 'pending'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Тип организации</h3>
        <div className="space-y-2">
          {types.map((type) => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type)}
                onChange={() => onTypeToggle(type)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{organizationTypeLabels[type]}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-800 mb-2">Статус</h3>
        <div className="space-y-2">
          {statuses.map((status) => (
            <label key={status} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedStatuses.includes(status)}
                onChange={() => onStatusToggle(status)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{statusLabels[status]}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
