import { SkillBuilders, CustomSkillBuilder } from 'ask-sdk-core'
import { RequestEnvelopeFactory, IntentRequestFactory, LaunchRequestFactory } from '@ask-utils/test'
import { LoggerService } from '../../../Logger'
import {
    withRepeatIntentHandler
} from '../index'
import { IntentRelectorHandler } from '../../IntentReflector'
import { RequestEnvelope , Response} from 'ask-sdk-model'
const mockResponse: Response = {
    outputSpeech: {
        ssml: '<speak>Hello</speak>',
        type: 'SSML'
    }
}
const mockAttributes = {
    '__talkyjs': {
        recordedResponse: mockResponse
    }
}
describe('RepeatIntent', () => {
    LoggerService.getInstance(new RequestEnvelopeFactory(
        new LaunchRequestFactory()
    ).getRequest())
    describe('withRepeatIntentHandler', () => {
        let skill: CustomSkillBuilder
        let requestEnvelope: RequestEnvelope
        beforeEach(() => {
            skill = withRepeatIntentHandler(SkillBuilders.custom())
            requestEnvelope = new RequestEnvelopeFactory(
                new IntentRequestFactory().setIntent({
                    name: 'AMAZON.RepeatIntent',
                    confirmationStatus: 'NONE'
                })
            ).getRequest()
        })
        it('should nothing to work when no session data and ended session requested', async () => {
            skill.addRequestHandlers(IntentRelectorHandler)
            const result = await skill.create().invoke(requestEnvelope)
            expect(result).toMatchObject({
                response: {
                    outputSpeech: {
                        ssml:  "<speak>You just triggered AMAZON.RepeatIntent</speak>",
                        type: "SSML"
                    }
                },
                sessionAttributes: {},
                userAgent: expect.any(String),
                version: expect.any(String)
            })
        })
        it('should return recorded response when has matched session attribues is recorded', async () => {
            const factory = new RequestEnvelopeFactory(
                new IntentRequestFactory().setIntent({
                    name: 'AMAZON.RepeatIntent',
                    confirmationStatus: 'NONE'
                })
            )
            factory.session.putAttributes(mockAttributes)
            const requestEnvelope = factory.getRequest()
            const result = await skill.create().invoke(requestEnvelope)
            expect(result).toMatchObject({
                response: mockResponse,
                sessionAttributes: mockAttributes,
                userAgent: expect.any(String),
                version: expect.any(String)
            })
        })
    })
})