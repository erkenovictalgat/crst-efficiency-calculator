export type OrganizationType = 
  | 'school'
  | 'hospital'
  | 'police'
  | 'prosecutor'
  | 'knb'
  | 'ip'
  | 'too';

export type OrderStatus = 
  | 'new'
  | 'in_progress'
  | 'completed'
  | 'pending';

export type ServiceType = 
  | 'internet_dynamic'
  | 'internet_static'
  | 'telephony'
  | 'sip_telephony';

export interface LegalClient {
  id: string;
  name: string;
  type: OrganizationType;
  status: OrderStatus;
  address: string;
  city: string;
  lat: number;
  lng: number;
  services: ServiceType[];
  accountNumber: string;
  contactPerson: string;
  phone: string;
  createdAt: string;
  completedAt?: string;
}
