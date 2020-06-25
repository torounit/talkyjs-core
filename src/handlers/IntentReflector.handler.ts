import { RequestHandler, getRequest } from 'ask-sdk-core';
import { LoggerService } from 'Logger';
import {IntentRequest } from 'ask-sdk-model'

export const IntentRelectorHandler: RequestHandler = {
    canHandle (input) {
        return input.requestEnvelope.request.type === 'IntentRequest'
    },
    handle (input) {
        const { logger } = LoggerService.getInstance()
        logger.info('IntentReflector was called')
        const intentName = getRequest<IntentRequest>(input.requestEnvelope).intent.name
        const speechText = `You just triggered ${intentName}`
        return input.responseBuilder
            .speak(speechText)
            .getResponse()
    }
}