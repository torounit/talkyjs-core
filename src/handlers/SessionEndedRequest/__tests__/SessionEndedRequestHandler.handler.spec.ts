import { HandlerInputCreator } from '@ask-utils/test';
import { SessionEndedRequestHandler } from '../SessionEndedRequest.handler';
import { LoggerService } from '../../../Logger';

describe('SessionEndedRequestHandler', () => {
  describe('canHandle', () => {
    it('should return false when given a SessionEndedRequest', () => {
      const handlerInput = new HandlerInputCreator().createSessionEndedRequest();
      expect(SessionEndedRequestHandler.canHandle(handlerInput)).toEqual(true);
    });
    it('should return false when given a not SessionEndedRequest', () => {
      const handlerInput = new HandlerInputCreator().createLaunchRequest();
      expect(SessionEndedRequestHandler.canHandle(handlerInput)).toEqual(false);
    });
  });
  describe('handle', () => {
    it('should return nothing', () => {
      const handlerInput = new HandlerInputCreator().createSessionEndedRequest();
      const response = SessionEndedRequestHandler.handle(handlerInput);
      expect(response).toMatchObject({});
    });
    it('should record data', () => {
      let stdOut: string[] = [];
      LoggerService.getInstance().logger.setSettings({
        stdOut: {
          write(input: string) {
            stdOut.push(input);
          },
        },
      });
      const handlerInput = new HandlerInputCreator().createSessionEndedRequest();
      SessionEndedRequestHandler.handle(handlerInput);
      expect(stdOut.join('\n')).toContain('Session ended with reason:');
    });
  });
});
