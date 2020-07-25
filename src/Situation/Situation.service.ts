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

  public getSituation(): Situation {
    return this.sessionSituation.loadRecord();
  }
  public increaseTurn() {
    this.sessionSituation.increaseTurn();
    return this;
  }
}
