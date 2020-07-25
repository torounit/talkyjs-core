import { RequestInterceptor } from 'ask-sdk-core';
import { SituationService } from './Situation.service';

export const RequestSituationInterceptor: RequestInterceptor = {
  async process(input) {
    const manager = new SituationService(input);
    manager.increaseTurn();
    await manager.loadRequestSituation();
  },
};
