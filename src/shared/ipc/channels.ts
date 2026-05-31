export const IPC_CHANNELS = {
  appGetInfo: 'app:get-info',
  healthPing: 'health:ping',
  accountCreate: 'account:create',
  accountList: 'account:list',
  accountUpdate: 'account:update',
  accountDelete: 'account:delete',
  accountExport: 'account:export',
  accountImport: 'account:import',
  backupCreate: 'backup:create',
  backupList: 'backup:list',
  backupRestore: 'backup:restore',
  backupDelete: 'backup:delete',
  quotaRefresh: 'quota:refresh',
  quotaBatchRefresh: 'quota:batch-refresh',
  quotaList: 'quota:list',
  quotaGet: 'quota:get',
  quotaSetThreshold: 'quota:set-threshold',
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
