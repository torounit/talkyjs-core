import { createIntentRequestHandlerInput } from '@ask-utils/test';
import { RouteMatcher, Router } from '../../../';

describe('RouteMatcher', () => {
  describe('IntentRequestMatcher', () => {
    describe('single intent name', () => {
      it('should return true when given match intent request', async () => {
        const handlerInput = createIntentRequestHandlerInput({
          name: 'HelloIntent',
          confirmationStatus: 'NONE',
        });
        const routes: Router = {
          requestType: 'IntentRequest',
          intentName: 'HelloIntent',
          handler: input => input.responseBuilder.getResponse(),
        };
        const mathcer = new RouteMatcher(handlerInput, routes);
        await mathcer.match();
        expect(mathcer.getMatchResult()).toEqual(true);
      });
      it('should return false when given un-match intent request', async () => {
        const handlerInput = createIntentRequestHandlerInput({
          name: 'ByeIntent',
          confirmationStatus: 'NONE',
        });
        const routes: Router = {
          requestType: 'IntentRequest',
          intentName: 'HelloIntent',
          handler: input => input.responseBuilder.getResponse(),
        };
        const mathcer = new RouteMatcher(handlerInput, routes);
        await mathcer.match();
        expect(mathcer.getMatchResult()).toEqual(false);
      });
    });
    describe('multi intent name', () => {
      it('should return true when given match intent request', async () => {
        const handlerInput = createIntentRequestHandlerInput({
          name: 'HelloIntent',
          confirmationStatus: 'NONE',
        });
        const routes: Router = {
          requestType: 'IntentRequest',
          intentName: ['AMAZON.StopIntent', 'HelloIntent'],
          handler: input => input.responseBuilder.getResponse(),
        };
        const mathcer = new RouteMatcher(handlerInput, routes);
        await mathcer.match();
        expect(mathcer.getMatchResult()).toEqual(true);
      });
      it('should return false when given unmatch intent request', async () => {
        const handlerInput = createIntentRequestHandlerInput({
          name: 'HelloIntent',
          confirmationStatus: 'NONE',
        });
        const routes: Router = {
          requestType: 'IntentRequest',
          intentName: ['AMAZON.StopIntent', 'AMAZON.CancelIntent'],
          handler: input => input.responseBuilder.getResponse(),
        };
        const mathcer = new RouteMatcher(handlerInput, routes);
        await mathcer.match();
        expect(mathcer.getMatchResult()).toEqual(false);
      });

      it.each([
        [{ gte: 0 }, true],
        [{ gt: 0 }, false],
        [{ eq: 0 }, true],
        [{ lt: 0 }, false],
        [{ lte: 0 }, true],
        [{ gte: 5 }, false],
        [{ gt: 5 }, false],
        [{ eq: 5 }, false],
        [{ lt: 5 }, true],
        [{ lte: 5 }, true],
      ])(
        'should return true if the invocation Count situation is 0 (Operator; %p)',
        async (invocationCount, expectedResult) => {
          const handlerInput = createIntentRequestHandlerInput({
            name: 'AMAZON.CancelIntent',
            confirmationStatus: 'NONE',
          });
          const routes: Router = {
            requestType: 'IntentRequest',
            intentName: ['AMAZON.StopIntent', 'AMAZON.CancelIntent'],
            situation: {
              invocationCount,
            },
            handler: input => input.responseBuilder.getResponse(),
          };
          const mathcer = new RouteMatcher(handlerInput, routes);
          await mathcer.match();
          expect(mathcer.getMatchResult()).toEqual(expectedResult);
        }
      );
      it('should return true if the invocation Count situation is 0', async () => {
        const handlerInput = createIntentRequestHandlerInput({
          name: 'AMAZON.CancelIntent',
          confirmationStatus: 'NONE',
        });
        const routes: Router = {
          requestType: 'IntentRequest',
          intentName: ['AMAZON.StopIntent', 'AMAZON.CancelIntent'],
          situation: {
            invocationCount: {
              eq: 0,
            },
          },
          handler: input => input.responseBuilder.getResponse(),
        };
        const mathcer = new RouteMatcher(handlerInput, routes);
        await mathcer.match();
        expect(mathcer.getMatchResult()).toEqual(true);
      });
    });
  });
});
