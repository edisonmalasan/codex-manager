export type ServiceBoundaryStatus = 'planned';

export interface ServiceBoundary {
  id: string;
  label: string;
  status: ServiceBoundaryStatus;
}

export const serviceBoundaries: ServiceBoundary[] = [
  { id: 'account', label: 'Account resource management', status: 'planned' },
  { id: 'quota', label: 'Quota and health monitoring', status: 'planned' },
  { id: 'switching', label: 'Manual and automatic switching', status: 'planned' },
  { id: 'backup', label: 'Account/config backup and restore', status: 'planned' },
  { id: 'proxy', label: 'Local API proxy gateway', status: 'planned' },
  { id: 'process', label: 'Codex tool process control', status: 'planned' },
  { id: 'config', label: 'Application configuration', status: 'planned' },
  { id: 'database', label: 'Persistence repositories', status: 'planned' },
  { id: 'storage', label: 'Credential and artifact storage', status: 'planned' },
];
