import {
  createIntentRequestHandlerInput,
  LaunchRequestFactory,
} from '@ask-utils/test';
import {
  shouldMatchRequestType,
  shouldMatchIntentRequest,
  compareCountableSituation,
} from '../../../matcher/helpers';
import { Request } from 'ask-sdk-model';

const createRequest = () => {
  const input = createIntentRequestHandlerInput({
    name: 'HelloIntent',
    confirmationStatus: 'NONE',
  });
  return input.requestEnvelope.request;
};
describe('matcher/helpers.ts', () => {
  describe("compareCountableSituation", () => {
    it.each([
      [{lte: 0}, undefined, 'true'],
      [{lte: 0}, 0, 'true'],
      [{lte: 2}, 0, 'true'],
      [{lte: 2}, 2, 'true'],
      [{lte: 2}, 5, 'false'],
      [{lt: 0}, undefined, 'false'],
      [{lt: 0}, 0, 'false'],
      [{lt: 2}, 0, 'true'],
      [{lt: 2}, 2, 'false'],
      [{lt: 2}, 5, 'false'],
      [{eq: 0}, undefined, 'true'],
      [{eq: 0}, 0, 'true'],
      [{eq: 2}, 0, 'false'],
      [{eq: 2}, 2, 'true'],
      [{eq: 2}, 5, 'false'],
      [{gt: 0}, undefined, 'false'],
      [{gt: 0}, 0, 'false'],
      [{gt: 2}, 0, 'false'],
      [{gt: 2}, 2, 'false'],
      [{gt: 2}, 5, 'true'],
      [{gte: 0}, undefined, 'true'],
      [{gte: 0}, 0, 'true'],
      [{gte: 2}, 0, 'false'],
      [{gte: 2}, 2, 'true'],
      [{gte: 2}, 5, 'true'],
    ])("When given %p situation and value is %p, should return %p", (situation, target, result) => {
      expect(compareCountableSituation(situation, target)).toEqual(result)
    })
    it.each([
      [{
        gte: 0,
        lte: 6,
      }, 5, 'true'],
      [{
        gte: 0,
        eq: 4,
        lte: 6,
      }, 4, 'true'],
      [{
        gte: 0,
        eq: 4,
        lte: 6,
      }, 5, 'false'],
    ])("When given %p situation and value is %p, should return %p", (situation, target, result) => {
      expect(compareCountableSituation(situation, target)).toEqual(result)
    })
  })
  describe("withRequestObject", () => {
  let request: Request;
  beforeEach(() => {
    request = createRequest();
  });
  describe('shouldMatchRequestType', () => {
    it('should return true when match the intent name [HelloIntent]', () => {
      expect(
        shouldMatchRequestType(request, {
          requestType: 'IntentRequest',
          intentName: 'HelloIntent',
          handler: ({ responseBuilder }) => responseBuilder.getResponse(),
        })
      ).toEqual(true);
    });
    it('should return true when match the intent name [ByeIntent]', () => {
      expect(
        shouldMatchRequestType(request, {
          requestType: 'IntentRequest',
          intentName: 'ByeIntent',
          handler: ({ responseBuilder }) => responseBuilder.getResponse(),
        })
      ).toEqual(true);
    });
    it('should return false when un-matched the request type', () => {
      expect(
        shouldMatchRequestType(request, {
          requestType: 'SessionEndedRequest',
          handler: ({ responseBuilder }) => responseBuilder.getResponse(),
        })
      ).toEqual(false);
    });
  });
  describe('shouldMatchIntentRequest', () => {
    it('should return false when given a not IntentRequest', () => {
      const request = new LaunchRequestFactory().getRequest();
      expect(
        shouldMatchIntentRequest(request, {
          requestType: 'IntentRequest',
          handler: ({ responseBuilder }) => responseBuilder.getResponse(),
        })
      ).toEqual(false);
    });
    it('should return true when match the intent name [HelloIntent]', () => {
      expect(
        shouldMatchIntentRequest(request, {
          requestType: 'IntentRequest',
          intentName: 'HelloIntent',
          handler: ({ responseBuilder }) => responseBuilder.getResponse(),
        })
      ).toEqual(true);
    });
    it('should return false when un-match the intent name [ByeIntent]', () => {
      expect(
        shouldMatchIntentRequest(request, {
          requestType: 'IntentRequest',
          intentName: 'ByeIntent',
          handler: ({ responseBuilder }) => responseBuilder.getResponse(),
        })
      ).toEqual(false);
    });
    it('should return true when given intent name array has matched value [HelloIntent, ByeIntent]', () => {
      expect(
        shouldMatchIntentRequest(request, {
          requestType: 'IntentRequest',
          intentName: ['HelloIntent', 'ByeIntent'],
          handler: ({ responseBuilder }) => responseBuilder.getResponse(),
        })
      ).toEqual(true);
    });
    it('should return true when given intent name array has no matched value [AMAZON.HelpIntent, ByeIntent]', () => {
      expect(
        shouldMatchIntentRequest(request, {
          requestType: 'IntentRequest',
          intentName: ['AMAZON.HelpIntent', 'ByeIntent'],
          handler: ({ responseBuilder }) => responseBuilder.getResponse(),
        })
      ).toEqual(false);
    });
    it('should return true when intent name does not given [For intent fallback]', () => {
      expect(
        shouldMatchIntentRequest(request, {
          requestType: 'IntentRequest',
          handler: ({ responseBuilder }) => responseBuilder.getResponse(),
        })
      ).toEqual(true);
    });
    it('should return false when un-matched the request type', () => {
      expect(
        shouldMatchIntentRequest(request, {
          requestType: 'SessionEndedRequest',
          handler: ({ responseBuilder }) => responseBuilder.getResponse(),
        })
      ).toEqual(false);
    });
  });
});
})