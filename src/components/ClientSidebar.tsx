import { LegalClient } from '../types';
import { organizationTypeLabels, statusLabels, serviceLabels } from '../data/mockData';
import { X, Phone, MapPin, Calendar, FileText } from 'lucide-react';

interface ClientSidebarProps {
  client: LegalClient | null;
  onClose: () => void;
}

export default function ClientSidebar({ client, onClose }: ClientSidebarProps) {
  if (!client) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800">{client.name}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">{client.address}</p>
              <p className="text-sm text-gray-500">{client.city}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Лицевой счет: {client.accountNumber}</p>
              <p className="text-sm text-gray-500">Тип: {organizationTypeLabels[client.type]}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">{client.contactPerson}</p>
              <p className="text-sm text-gray-500">{client.phone}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Создан: {client.createdAt}</p>
              {client.completedAt && (
                <p className="text-sm text-gray-500">Завершен: {client.completedAt}</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Статус</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                client.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : client.status === 'in_progress'
                  ? 'bg-orange-100 text-orange-800'
                  : client.status === 'new'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {statusLabels[client.status]}
            </span>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-2">Услуги</h3>
            <div className="space-y-2">
              {client.services.map((service) => (
                <div
                  key={service}
                  className="flex items-center space-x-2 text-sm text-gray-700"
                >
                  <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>{serviceLabels[service]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
