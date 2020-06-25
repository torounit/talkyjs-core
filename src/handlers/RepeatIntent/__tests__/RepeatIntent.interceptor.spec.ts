import {
  HandlerInputFactory,
  RequestEnvelopeFactory,
  IntentRequestFactory,
} from '@ask-utils/test';
import { RecordTheResponseInterceptor } from '../RepeatIntent.interceptor';
import { Response } from 'ask-sdk-model';
import { RepeatIntentService } from '../RepeatIntent.service';
import { HandlerInput } from 'ask-sdk-core';

const mockResponse: Response = {
  outputSpeech: {
    ssml: '<speak>Hello</speak>',
    type: 'SSML',
  },
};
const mockResponseWithReprompt: Response = {
  outputSpeech: {
    ssml: '<speak>Hello</speak>',
    type: 'SSML',
  },
  reprompt: {
    outputSpeech: {
      ssml: '<speak>Hello</speak>',
      type: 'SSML',
    },
  },
};
describe('RepeatIntent.interceptor.ts', () => {
  let handlerInput: HandlerInput;
  let service: RepeatIntentService;
  beforeEach(() => {
    handlerInput = new HandlerInputFactory(
      new RequestEnvelopeFactory(
        new IntentRequestFactory().setIntent({
          name: 'AMAZON.RepeatIntent',
          confirmationStatus: 'NONE',
        })
      )
    ).create();
    service = new RepeatIntentService(handlerInput);
  });
  it('should not record any data if no resposne', () => {
    RecordTheResponseInterceptor.process(handlerInput);
    expect(service.hasLastResponse()).toEqual(false);
    expect(service.loadLastResponse()).toEqual(null);
  });
  it('should not record resposne if it has no reprompt', () => {
    RecordTheResponseInterceptor.process(handlerInput, mockResponse);
    expect(service.hasLastResponse()).toEqual(false);
    expect(service.loadLastResponse()).toEqual(null);
  });
  it('should record resposne if it has a reprompt', () => {
    RecordTheResponseInterceptor.process(
      handlerInput,
      mockResponseWithReprompt
    );
    expect(service.hasLastResponse()).toEqual(true);
    expect(service.loadLastResponse()).toEqual(mockResponseWithReprompt);
  });
  it('should not record resposne if the session will be ended', () => {
    RecordTheResponseInterceptor.process(handlerInput, {
      ...mockResponseWithReprompt,
      shouldEndSession: true,
    });
    expect(service.hasLastResponse()).toEqual(false);
    expect(service.loadLastResponse()).toEqual(null);
  });
});
