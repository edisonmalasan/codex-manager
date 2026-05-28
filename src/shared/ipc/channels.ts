export const IPC_CHANNELS = {
  appGetInfo: 'app:get-info',
  healthPing: 'health:ping',
  accountCreate: 'account:create',
  accountList: 'account:list',
  accountUpdate: 'account:update',
  accountDelete: 'account:delete',
  accountExport: 'account:export',
  accountImport: 'account:import',
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
