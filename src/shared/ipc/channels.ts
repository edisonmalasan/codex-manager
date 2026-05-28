export const IPC_CHANNELS = {
  appGetInfo: 'app:get-info',
  healthPing: 'health:ping',
} as const;

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS];
