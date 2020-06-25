import {
    HandlerInputFactory,
    RequestEnvelopeFactory,
    LaunchRequestFactory
} from '@ask-utils/test'
import { HandlerInput } from 'ask-sdk-core'
import {
    RepeatIntentService
} from '../RepeatIntent.service'
import { Response } from 'ask-sdk-model'

const mockResponse: Response = {
    outputSpeech: {
        ssml: '<speak>Hello</speak>',
        type: 'SSML'
    }
}

describe('RepeatIntent.service.ts', () => {
    let handlerInput: HandlerInput
    beforeEach(() => {
        handlerInput = new HandlerInputFactory(
            new RequestEnvelopeFactory(
                new LaunchRequestFactory()
            )
        ).create()
    })
    it("[hasLastResponse] should return false when no response has been recorded", () => {
        const sessionManager = new RepeatIntentService(handlerInput)
        expect(sessionManager.hasLastResponse()).toEqual(false)
    })
    it("[hasLastResponse] should return true when no response has been recorded", () => {
        const sessionManager = new RepeatIntentService(handlerInput)
        sessionManager.recordResponse(mockResponse)
        expect(sessionManager.hasLastResponse()).toEqual(true)
    })
    it("[loadLastResponse] should return null when no response has been recorded", () => {
        const sessionManager = new RepeatIntentService(handlerInput)
        expect(sessionManager.loadLastResponse()).toEqual(null)
    })
    it("[loadLastResponse] should return response when no response has been recorded", () => {
        const sessionManager = new RepeatIntentService(handlerInput)
        sessionManager.recordResponse(mockResponse)
        expect(sessionManager.loadLastResponse()).toEqual(mockResponse)
    })

    it('[Native] should return not data, if no data given', () => {
        const { attributesManager } = handlerInput
        new RepeatIntentService({
            attributesManager
        })
        expect(attributesManager.getSessionAttributes()).toEqual({})
    })
    it('[Native] should return not data, if no data given', () => {
        const { attributesManager } = handlerInput
        const sessionManager = new RepeatIntentService({
            attributesManager
        })
        sessionManager.recordResponse(mockResponse)
        expect(attributesManager.getSessionAttributes()).toEqual({
            '__talkyjs': {
                recordedResponse: mockResponse
            }
        })
    })
})
