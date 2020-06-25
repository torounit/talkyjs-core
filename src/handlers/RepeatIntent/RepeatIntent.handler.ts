import { RequestHandler } from 'ask-sdk-core'
import { Response } from 'ask-sdk-model'
import {
    isMatchedIntent
} from '@ask-utils/core'
import { RepeatIntentService } from './RepeatIntent.service'

export const RepeatIntent: RequestHandler = {
    canHandle (handlerInput): Promise<boolean> | boolean {
        if (!isMatchedIntent(handlerInput, 'AMAZON.RepeatIntent')) return false
        const service = new RepeatIntentService(handlerInput)
        return service.hasLastResponse()
    },
    handle (handlerInput): Promise<Response> | Response {
        const service = new RepeatIntentService(handlerInput)
        return service.loadLastResponse() as Response
    }
}
