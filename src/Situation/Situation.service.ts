import {
  SessionSituationService,
  SessionSituation,
} from './SessionSituation.service';
import { HandlerInput } from 'ask-sdk-core';
import { UserActivityManager } from '../CRM';

export type Situation = SessionSituation & {
  invocationNumber: number;
  lastInvocationTime?: number;
};
const defaultSituation: Situation = {
  turnCount: 0,
  invocationNumber: 0,
};

export class SituationService {
  private readonly sessionSituation: SessionSituationService;
  private readonly userActivity: UserActivityManager;
  constructor(
    input: Pick<HandlerInput, 'attributesManager' | 'requestEnvelope'>
  ) {
    this.sessionSituation = new SessionSituationService(input);
    this.userActivity = new UserActivityManager(input);
  }

  /**
   * Load latest situation status from DB and session
   */
  public async loadRequestSituation(): Promise<void> {
    const session = this.getSituation();
    const persistent = await this.userActivity.getLastActivity();
    const situation = {
      ...defaultSituation,
      ...session,
      ...persistent,
    };
    this.sessionSituation.updateRecord(situation);
  }

  /**
   * get loaded situation from session
   */
  public getSituation(): Situation {
    return this.sessionSituation.loadRecord();
  }

  /**
   * Increase a conversation turn
   */
  public increaseTurn() {
    this.sessionSituation.increaseTurn();
    return this;
  }

  /**
   * update current state
   * @param state
   */
  public updateState(state: string) {
    this.sessionSituation.updateState(state);
  }

  /**
   * get current state
   */
  public getState(): string | undefined {
    return this.sessionSituation.getState();
  }
}
