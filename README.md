
# @talkyjs/core

## Feature

### Stage Handling

We can choose these stage to run the skill

|stage|feature|
|:--|:--|
|development| Add devleopment helper handler (IntentReflector) |
|production | Ignore development utilties |

### Preset Handlers

|RequstType|IntentName|action|
|:--|:--|:--|
| SessionEndedRequest | - | Record the ended reason |
| IntentRequest | AMAZON.RepeatIntent | Repeat the last response (Only in session) |
| AlexaSkillEvent.SkillDisabled | - | Delete the user data from the persistent attributes |
| ErrorHandler | - | Log the Error and return the error resposne (Supported lang: Japanese / English) |

## Logging
Automatically log these props.

- Request
- Response

WIP