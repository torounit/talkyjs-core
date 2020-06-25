
import { Response } from 'ask-sdk-model';
import { SessionAttributesManager } from '../../SessionAttributesManager/SessionAttributesManager.service';

export class RepeatIntentService extends SessionAttributesManager {
    private readonly recordKey = 'recordedResponse'
    public recordResponse(response: Response) {
        this.updateSessionAttributes<Response>(this.recordKey, response)
    }
    public loadLastResponse(): Response | null {
        return this.getSessionAttributes<Response>(this.recordKey)
    }
    public hasLastResponse():boolean {
        const data = this.loadLastResponse()
        return !!(data)
    }
}