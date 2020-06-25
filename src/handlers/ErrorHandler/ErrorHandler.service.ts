import { HandlerInput, getLocale } from 'ask-sdk-core';


export type ErrorResponse = {
  speak: string;
  reprompt: string;
}
export class ErrorHandlerService {
  public static readonly errorResponses: {
    [locale: string]: ErrorResponse
  } = {
    'ja-JP': {
      speak: 'すみません。うまく聞き取れませんでした。もう一度お願いします。',
      reprompt: 'もう一度、お願いできますか？'
    },
    'en': {
      speak: 'Sorry I could not understand the meaning. Please tell me again',
      reprompt: 'Could you tell me onece more?'
    }
  }

  public static getSupportedLang() {
    return Object.keys(this.errorResponses)
  }
  
  public static findSpeakableLang(locale: string): string | undefined {
    const errorHandlerSupportedLang = this.getSupportedLang()
    const matched = errorHandlerSupportedLang.find(target => {
      if (target === locale) return true
      const reg = new RegExp(target)
      return reg.test(locale)
    })
    return matched
  }
  
  public static canSpeakRequest(input: HandlerInput):boolean {
    const locale = getLocale(input.requestEnvelope)
    const lang = this.findSpeakableLang(locale)
    return !!(lang)
  }
  
  public static getResponse(input: HandlerInput): ErrorResponse {
    const locale = getLocale(input.requestEnvelope)
    const lang = this.findSpeakableLang(locale)
    if (!lang) return this.errorResponses['en']
    return this.errorResponses[lang] || this.errorResponses['en']
  }
}