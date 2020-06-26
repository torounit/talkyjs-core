import {
  RequestEnvelopeFactory,
  LaunchRequestFactory,
  HandlerInputFactory,
  HandlerInputCreator,
  MockPersistenceAdapter,
} from '@ask-utils/test';
import { SkillDisabledEventHandler } from '../index';
import { LoggerService } from '../../../Logger';

describe('SkillDisabledEventHandler', () => {
  LoggerService.getInstance(
    new RequestEnvelopeFactory(new LaunchRequestFactory()).getRequest()
  );
  describe('canHandle', () => {
    it('should return false when given a not IntentRequest', () => {
      const handlerInput = new HandlerInputFactory(
        new RequestEnvelopeFactory(new LaunchRequestFactory())
      ).create();
      expect(SkillDisabledEventHandler.canHandle(handlerInput)).toEqual(false);
    });
    it('should return true when given AlexaSkillEvent.SkillDisabled ', () => {
      const handlerInput = new HandlerInputCreator().createSessionEndedRequest();
      handlerInput.requestEnvelope.request.type =
        'AlexaSkillEvent.SkillDisabled';
      expect(SkillDisabledEventHandler.canHandle(handlerInput)).toEqual(true);
    });
  });
  describe('handle', () => {
    it('should pass the handle request when given AlexaSkillEvent.SkillDisabled ', async () => {
      const handlerInput = new HandlerInputFactory(
        new RequestEnvelopeFactory(new LaunchRequestFactory())
      )
        .setPersistanceAdapter(new MockPersistenceAdapter())
        .create();
      handlerInput.requestEnvelope.request.type =
        'AlexaSkillEvent.SkillDisabled';
      await expect(
        SkillDisabledEventHandler.handle(handlerInput)
      ).resolves.toEqual({});
    });
    it('should throw error if not persistence adapter', async () => {
      const handlerInput = new HandlerInputFactory(
        new RequestEnvelopeFactory(new LaunchRequestFactory())
      ).create();
      handlerInput.requestEnvelope.request.type =
        'AlexaSkillEvent.SkillDisabled';
      await expect(
        SkillDisabledEventHandler.handle(handlerInput)
      ).rejects.toThrowError(
        'Cannot delete PersistentAttributes without persistence adapter!'
      );
    });
    it('should throw error if the persistence adapter has no deletePersistentAttributes', async () => {
      const adapter = new MockPersistenceAdapter();
      const handlerInput = new HandlerInputFactory(
        new RequestEnvelopeFactory(new LaunchRequestFactory())
      )
        .setPersistanceAdapter(adapter)
        .create();
      delete handlerInput.attributesManager.deletePersistentAttributes;
      handlerInput.requestEnvelope.request.type =
        'AlexaSkillEvent.SkillDisabled';
      await expect(
        SkillDisabledEventHandler.handle(handlerInput)
      ).rejects.toThrowError(
        'deletePersistentAttributes is not defined. Please upgrade your ask-sdk.'
      );
    });
  });
});
