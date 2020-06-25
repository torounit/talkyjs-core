import {
    HandlerInputCreator,
  } from '@ask-utils/test';
  import { ErrorHandlerService } from '../ErrorHandler.service';


  describe('ErrorHandlerService', () => {
      it('getSupportedLang: should return langs', () => {
          const result = ErrorHandlerService.getSupportedLang()
          expect(result).toEqual(['ja-JP', 'en'])
      })
      describe('findSpeakableLang', () => {
        it.each([
            ['ja-JP', 'ja-JP'],
            ['en-US', 'en'],
            ['en-GB', 'en'],
            ['es-ES', undefined]
        ])("when give %p, should return %p", (lang, expected) => {
            expect(ErrorHandlerService.findSpeakableLang(lang)).toEqual(expected)
        })
      })
      describe('canSpeakRequest', () => {
        it.each([
            ['ja-JP', true],
            ['en-US', true],
            ['en-GB', true],
            ['es-ES', false]
        ])("when locale is %p, will return %p", (lang, expected) => {
            const handlerInput = new HandlerInputCreator(lang).createLaunchRequest()
            expect(ErrorHandlerService.canSpeakRequest(handlerInput)).toEqual(expected)
        })
      })
      describe('getResponse', () => {
        it.each([
            ['ja-JP', ErrorHandlerService.errorResponses['ja-JP']],
            ['en-US', ErrorHandlerService.errorResponses['en']],
            ['en-GB', ErrorHandlerService.errorResponses['en']],
            ['es-ES', ErrorHandlerService.errorResponses['en']]
        ])("when locale is %p, will return %p", (lang, expected) => {
            const handlerInput = new HandlerInputCreator(lang).createLaunchRequest()
            const response = ErrorHandlerService.getResponse(handlerInput)
            expect(response).toEqual(expected)
        })
      })
  })