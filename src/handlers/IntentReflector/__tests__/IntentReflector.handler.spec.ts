import { RequestEnvelopeFactory, LaunchRequestFactory, IntentRequestFactory, HandlerInputFactory } from '@ask-utils/test'
import {
    IntentRelectorHandler,
} from '../index'
import { LoggerService } from '../../../Logger'

describe('IntentRelectorHandler', () => {
    LoggerService.getInstance(new RequestEnvelopeFactory(
        new LaunchRequestFactory()
    ).getRequest())
    describe('canHandle', () => {
        it('should return false when given a not IntentRequest', () => {
            const handlerInput = new HandlerInputFactory(
                new RequestEnvelopeFactory(
                    new LaunchRequestFactory()
                )
            ).create()
            expect(IntentRelectorHandler.canHandle(handlerInput)).toEqual(false)
        })
        it.each([
            'HelloIntent',
            'TestIntent',
            'AMAZON.HelpIntent'
        ])('should return true when given a IntentRequest [%p]', (name) => {
            const handlerInput = new HandlerInputFactory(
                new RequestEnvelopeFactory(
                    new IntentRequestFactory().setIntent({
                        name,
                        confirmationStatus: 'NONE'
                    })
                )
            ).create()
            expect(IntentRelectorHandler.canHandle(handlerInput)).toEqual(true)
        })
    })
    describe('handle', () => {
        it.each([
            'HelloIntent',
            'TestIntent',
            'AMAZON.HelpIntent'
        ])('should return true when given a IntentRequest [%p]', (name) => {
            const handlerInput = new HandlerInputFactory(
                new RequestEnvelopeFactory(
                    new IntentRequestFactory().setIntent({
                        name,
                        confirmationStatus: 'NONE'
                    })
                )
            ).create()
            const response = IntentRelectorHandler.handle(handlerInput)
            expect(response).toMatchObject({
                outputSpeech: {
                    ssml: `<speak>You just triggered ${name}</speak>`,
                    type: 'SSML'
                }
            })
        })

    })

})