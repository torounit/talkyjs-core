import {
  HandlerInputFactory,
  RequestEnvelopeFactory,
  LaunchRequestFactory,
  IntentRequestFactory,
} from '@ask-utils/test';
import { RepeatIntent } from '../RepeatIntent.handler';
import { Response } from 'ask-sdk-model';
import { RepeatIntentService } from '../RepeatIntent.service';
import { HandlerInput } from 'ask-sdk-core';

const mockResponse: Response = {
  outputSpeech: {
    ssml: '<speak>Hello</speak>',
    type: 'SSML',
  },
};

describe('RepeatIntent.handler.ts', () => {
  describe('canHandle', () => {
    let handlerInput: HandlerInput;
    beforeEach(() => {
      handlerInput = new HandlerInputFactory(
        new RequestEnvelopeFactory(
          new IntentRequestFactory().setIntent({
            name: 'AMAZON.RepeatIntent',
            confirmationStatus: 'NONE',
          })
        )
      ).create();
    });
    it('should return false when given launchrequest', () => {
      const result = RepeatIntent.canHandle(
        new HandlerInputFactory(
          new RequestEnvelopeFactory(new LaunchRequestFactory())
        ).create()
      );
      expect(result).toEqual(false);
    });
    it('should return false when given AMAZON.RepeatIntent but lastResponse does not recorded', () => {
      expect(RepeatIntent.canHandle(handlerInput)).toEqual(false);
    });
    it('should return true when given AMAZON.RepeatIntent and lastResponse has been recorded', () => {
      const service = new RepeatIntentService(handlerInput);
      service.recordResponse(mockResponse);
      expect(RepeatIntent.canHandle(handlerInput)).toEqual(true);
    });
  });
  describe('canHandle', () => {
    let handlerInput: HandlerInput;
    beforeEach(() => {
      handlerInput = new HandlerInputFactory(
        new RequestEnvelopeFactory(
          new IntentRequestFactory().setIntent({
            name: 'AMAZON.RepeatIntent',
            confirmationStatus: 'NONE',
          })
        )
      ).create();
    });
    it('should return true when given AMAZON.RepeatIntent and lastResponse has been recorded', () => {
      const service = new RepeatIntentService(handlerInput);
      service.recordResponse(mockResponse);
      expect(RepeatIntent.handle(handlerInput)).toMatchObject(mockResponse);
    });
  });
});
