import { SessionAttributesManager } from '../SessionAttributesManager/SessionAttributesManager.service';
import { isSkillEvent } from '@ask-utils/core';
import { RequestEnvelope } from 'ask-sdk-model';
import { HandlerInput } from 'ask-sdk-core';

export type SessionSituation = {
  turnCount: number;
  invocationNumber: number;
  lastInvocationTime?: number;
  state?: string;
};

export class SessionSituationService extends SessionAttributesManager {
  private readonly recordKey = 'sessionSituation';
  protected readonly requestEnvelope: RequestEnvelope;
  public constructor({
    attributesManager,
    requestEnvelope,
  }: Pick<HandlerInput, 'attributesManager' | 'requestEnvelope'>) {
    super({ attributesManager });
    this.requestEnvelope = requestEnvelope;
  }
  /**
   * Update session record
   */
  public increaseTurn() {
    if (isSkillEvent(this.requestEnvelope)) return;
    if (!this.attributesManager) return;
    const record = this.loadRecord();
    record.turnCount = record.turnCount + 1;
    this.updateRecord(record);
  }

  /**
   * update current state
   * @param state
   */
  public updateState(state: string) {
    this._updateRecord({
      state,
    });
  }

  /**
   * get current state
   */
  public getState(): string | undefined {
    const record = this.loadRecord();
    return record.state;
  }

  /**
   * update situation data in the session
   * @param record
   */
  private _updateRecord(record: Partial<SessionSituation>) {
    const current = this.loadRecord();
    this.updateSessionAttributes<SessionSituation>(this.recordKey, {
      ...current,
      ...record,
    });
  }

  /**
   * update situation data in the session
   * @param record
   */
  public updateRecord(record: SessionSituation) {
    this.updateSessionAttributes<SessionSituation>(this.recordKey, record);
  }

  /**
   * Load session record
   */
  public loadRecord(): SessionSituation {
    const data = this.getSessionAttributes<SessionSituation>(this.recordKey);
    if (data) return data;
    return { turnCount: 0, invocationNumber: 0 };
  }
}
