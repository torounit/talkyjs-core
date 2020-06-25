import { ResponseInterceptor } from 'ask-sdk-core'
import { RepeatIntentService } from './RepeatIntent.service'

export const RecordTheResponseInterceptor: ResponseInterceptor = {
    process (handlerInput, response): void | Promise<void> {
        // No response text
        if (!response) return
        // Session should be closed
        if (response.shouldEndSession === true) return
        // Skill will be closed
        if (!response.reprompt) return
        const sessionAttributes = new RepeatIntentService(handlerInput)
        sessionAttributes.recordResponse(response)
    }
}