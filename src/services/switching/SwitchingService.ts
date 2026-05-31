import crypto from 'node:crypto';

import type { AccountResource } from '../../shared/account/account';
import type {
  ManualSwitchInput,
  RollbackSwitchInput,
  RollbackSwitchResult,
  SwitchHistoryRecord,
  SwitchResult,
  SwitchState,
} from '../../shared/switching/switching';
import type { SwitchingRepository } from '../../storage/switching/SwitchingRepository';
import type { AccountService } from '../account/AccountService';
import type { BackupService } from '../backup/BackupService';

export class SwitchValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SwitchValidationError';
  }
}

export class SwitchRollbackError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SwitchRollbackError';
  }
}

export class SwitchHistoryNotFoundError extends Error {
  constructor(id: string) {
    super(`Switch history record was not found: ${id}`);
    this.name = 'SwitchHistoryNotFoundError';
  }
}

export class SwitchingService {
  constructor(
    private readonly switchingRepository: SwitchingRepository,
    private readonly accountService: AccountService,
    private readonly backupService: BackupService,
  ) {}

  public getState(): SwitchState {
    return this.switchingRepository.getState();
  }

  public listHistory(): SwitchHistoryRecord[] {
    return this.switchingRepository.listHistory();
  }

  public async switchAccount(input: ManualSwitchInput): Promise<SwitchResult> {
    const targetAccountId = validateRequiredText(
      input.targetAccountId,
      'targetAccountId',
    );
    const reason = normalizeOptionalText(input.reason ?? null);
    const sourceAccountId = this.switchingRepository.getState().currentAccountId;
    const targetAccount = this.findAccount(targetAccountId);

    if (!targetAccount || targetAccount.status === 'disabled') {
      const message = !targetAccount
        ? `Target account was not found: ${targetAccountId}`
        : `Target account is disabled: ${targetAccountId}`;

      this.recordFailedSwitch(sourceAccountId, targetAccountId, reason, message);
      throw new SwitchValidationError(message);
    }

    const now = new Date().toISOString();
    const backup = this.backupService.create({
      label: `Before switching to ${targetAccount.label}`,
      kind: 'manual',
    });
    const historyId = crypto.randomUUID();

    await this.accountService.update(targetAccount.id, {
      lastUsedAt: now,
    });

    const history = this.switchingRepository.createHistory({
      id: historyId,
      sourceAccountId,
      targetAccountId: targetAccount.id,
      backupId: backup.id,
      status: 'success',
      reason,
      createdAt: now,
      completedAt: now,
      rolledBackAt: null,
      errorMessage: null,
    });
    const state = this.switchingRepository.setState({
      currentAccountId: targetAccount.id,
      lastSwitchId: history.id,
      updatedAt: now,
    });

    return {
      state,
      history,
      backup,
    };
  }

  public async rollback(
    input: RollbackSwitchInput = {},
  ): Promise<RollbackSwitchResult> {
    const history = this.resolveRollbackHistory(input.switchId ?? null);
    const rolledBackAt = new Date().toISOString();

    if (!history.sourceAccountId) {
      const message = `Switch cannot be rolled back because it has no previous account: ${history.id}`;
      const failedHistory = this.markRollbackFailed(
        history.id,
        rolledBackAt,
        message,
      );

      throw new SwitchRollbackError(failedHistory.errorMessage ?? message);
    }

    const previousAccount = this.findAccount(history.sourceAccountId);

    if (!previousAccount) {
      const message = `Previous account was not found for rollback: ${history.sourceAccountId}`;
      const failedHistory = this.markRollbackFailed(
        history.id,
        rolledBackAt,
        message,
      );

      throw new SwitchRollbackError(failedHistory.errorMessage ?? message);
    }

    await this.accountService.update(previousAccount.id, {
      lastUsedAt: rolledBackAt,
    });

    const rolledBackHistory =
      this.switchingRepository.updateHistory(history.id, {
        status: 'rolled_back',
        rolledBackAt,
        errorMessage: null,
      }) ?? history;
    const state = this.switchingRepository.setState({
      currentAccountId: previousAccount.id,
      lastSwitchId: rolledBackHistory.id,
      updatedAt: rolledBackAt,
    });

    return {
      state,
      history: rolledBackHistory,
    };
  }

  private resolveRollbackHistory(
    switchId: string | null,
  ): SwitchHistoryRecord {
    if (switchId) {
      const history = this.switchingRepository.getHistoryById(switchId);

      if (!history) {
        throw new SwitchHistoryNotFoundError(switchId);
      }

      return history;
    }

    const history = this.switchingRepository.getLatestSuccessfulSwitch();

    if (!history) {
      throw new SwitchRollbackError('No successful switch is available to roll back');
    }

    return history;
  }

  private recordFailedSwitch(
    sourceAccountId: string | null,
    targetAccountId: string,
    reason: string | null,
    message: string,
  ): SwitchHistoryRecord {
    const now = new Date().toISOString();

    return this.switchingRepository.createHistory({
      id: crypto.randomUUID(),
      sourceAccountId,
      targetAccountId,
      backupId: null,
      status: 'failed',
      reason,
      createdAt: now,
      completedAt: now,
      rolledBackAt: null,
      errorMessage: message,
    });
  }

  private markRollbackFailed(
    historyId: string,
    rolledBackAt: string,
    message: string,
  ): SwitchHistoryRecord {
    return (
      this.switchingRepository.updateHistory(historyId, {
        status: 'rollback_failed',
        rolledBackAt,
        errorMessage: message,
      }) ?? this.missingHistory(historyId)
    );
  }

  private missingHistory(id: string): never {
    throw new SwitchHistoryNotFoundError(id);
  }

  private findAccount(accountId: string): AccountResource | null {
    return (
      this.accountService
        .list()
        .find((account) => account.id === accountId) ?? null
    );
  }
}

function validateRequiredText(value: string, field: string): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new SwitchValidationError(`${field} is required`);
  }

  return normalized;
}

function normalizeOptionalText(value: string | null): string | null {
  if (value === null) {
    return null;
  }

  const normalized = value.trim();

  return normalized || null;
}
