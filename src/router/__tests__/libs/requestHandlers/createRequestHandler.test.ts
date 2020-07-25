/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  createIntentRequestHandlerInput,
  RequestEnvelopeFactory,
  HandlerInputFactory,
  IntentRequestFactory,
} from '@ask-utils/test';
import { RequestHandlerFactory } from '../../../requestHandlers';

describe('requestHandler', () => {
  describe('RequestHandlerFactory', () => {
    describe('canHandle', () => {
      it('should return false when create LaucnRequest and give another request', async () => {
        const requestHandler = RequestHandlerFactory.create({
          requestType: 'LaunchRequest',
          handler: input => input.responseBuilder.getResponse(),
        });
        const handlerInput = createIntentRequestHandlerInput({
          name: 'HelloIntent',
          confirmationStatus: 'NONE',
        });
        expect(await requestHandler.canHandle(handlerInput)).toEqual(false);
      });
      it('should return true when give matcher request', async () => {
        const requestHandler = RequestHandlerFactory.create({
          requestType: 'IntentRequest',
          intentName: 'HelloIntent',
          handler: input => input.responseBuilder.getResponse(),
        });
        const handlerInput = createIntentRequestHandlerInput({
          name: 'HelloIntent',
          confirmationStatus: 'NONE',
        });
        expect(await requestHandler.canHandle(handlerInput)).toEqual(true);
      });
      it('should return false when give matcher request but return false custom matcher', async () => {
        const requestHandler = RequestHandlerFactory.create({
          requestType: 'IntentRequest',
          intentName: 'HelloIntent',
          situation: {
            custom: () => false,
          },
          handler: input => input.responseBuilder.getResponse(),
        });
        const handlerInput = createIntentRequestHandlerInput({
          name: 'HelloIntent',
          confirmationStatus: 'NONE',
        });
        expect(await requestHandler.canHandle(handlerInput)).toEqual(false);
      });
      it('should return false when given route includes matched intent name in Array', async () => {
        const requestHandler = RequestHandlerFactory.create({
          requestType: 'IntentRequest',
          intentName: ['AMAZON.StopIntent', 'AMAZON.CancelIntent'],
          handler: input => input.responseBuilder.getResponse(),
        });
        const handlerInput = createIntentRequestHandlerInput({
          name: 'AMAZON.StopIntent',
          confirmationStatus: 'NONE',
        });
        expect(await requestHandler.canHandle(handlerInput)).toEqual(true);
        const handlerInput2 = createIntentRequestHandlerInput({
          name: 'AMAZON.CancelIntent',
          confirmationStatus: 'NONE',
        });
        expect(await requestHandler.canHandle(handlerInput2)).toEqual(true);
      });
      it('should return false when given unmatched intent name Array', async () => {
        const requestHandler = RequestHandlerFactory.create({
          requestType: 'IntentRequest',
          intentName: ['AMAZON.StopIntent', 'AMAZON.CancelIntent'],
          handler: input => input.responseBuilder.getResponse(),
        });
        const handlerInput = createIntentRequestHandlerInput({
          name: 'HelloIntent',
          confirmationStatus: 'NONE',
        });
        expect(await requestHandler.canHandle(handlerInput)).toEqual(false);
      });
      it.skip('should return true when match state', async () => {
        type State = 'start' | 'step1' | 'help';
        const requestHandler = RequestHandlerFactory.create<State>({
          requestType: 'IntentRequest',
          intentName: 'HelloIntent',
          situation: {
            state: 'help',
          },
          handler: input => {
            return input.responseBuilder.getResponse();
          },
        });
        const requestEnvelopeFactory = new RequestEnvelopeFactory(
          new IntentRequestFactory().setIntent({
            name: 'HelloIntent',
            confirmationStatus: 'NONE',
          })
        );
        requestEnvelopeFactory.session.putAttributes({
          __state: {
            current: 'init',
          },
        });
        const handlerInputFactory = new HandlerInputFactory(
          requestEnvelopeFactory
        ).updateRequest(requestEnvelopeFactory.getRequest());

        const handlerInput = handlerInputFactory.create();

        expect(await requestHandler.canHandle(handlerInput)).toEqual(false);
      });

      it.skip('should return true when match state', async () => {
        type State = 'start' | 'step1' | 'help';
        const requestHandler = RequestHandlerFactory.create<State>({
          requestType: 'IntentRequest',
          intentName: 'HelloIntent',
          situation: {
            state: 'help',
          },
          handler: input => {
            return input.responseBuilder.getResponse();
          },
        });
        const requestEnvelopeFactory = new RequestEnvelopeFactory(
          new IntentRequestFactory().setIntent({
            name: 'HelloIntent',
            confirmationStatus: 'NONE',
          })
        );
        requestEnvelopeFactory.session.putAttributes({
          __state: {
            current: 'help',
          },
        });
        const handlerInputFactory = new HandlerInputFactory(
          requestEnvelopeFactory
        ).updateRequest(requestEnvelopeFactory.getRequest());

        const handlerInput = handlerInputFactory.create();

        expect(await requestHandler.canHandle(handlerInput)).toEqual(true);
      });
    });
    describe('handle', () => {
      it('should auto set shouldEndSession props', async () => {
        type State = 'start' | 'step1' | 'help';
        const requestHandler = RequestHandlerFactory.create<State>({
          requestType: 'IntentRequest',
          intentName: 'HelloIntent',
          situation: {
            shouldEndSession: true,
          },
          handler: input => {
            return input.responseBuilder.getResponse();
          },
        });
        const requestEnvelopeFactory = new RequestEnvelopeFactory(
          new IntentRequestFactory().setIntent({
            name: 'HelloIntent',
            confirmationStatus: 'NONE',
          })
        );
        const handlerInputFactory = new HandlerInputFactory(
          requestEnvelopeFactory
        ).updateRequest(requestEnvelopeFactory.getRequest());

        const handlerInput = handlerInputFactory.create();

        expect(await requestHandler.handle(handlerInput)).toEqual({
          shouldEndSession: true,
        });
      });
    });
  });
});
