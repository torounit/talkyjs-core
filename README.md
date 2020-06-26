
# @talkyjs/core

## Getting started

### Install

```
$ npm i -S @talkyjs/core
```

### Create lambda handler

```typescript
import { SkillFactory } from '@talkyjs/core'

export const handler = SkillFactory.launch()
.addRequestHandlers({
    canHandle(input) {
        return input.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(input) {
        return input.responseBuilder.speak('Hello').getResponse()
    }
})
.createLambdaHandler()
```

### Skill Configuration

We can easy to set up a several skill configuration.

```typescript
import { SkillFactory, TalkyJSSkillConfig } from '@talkyjs/core'

const config: TalkyJSSkillConfig = {
    stage: 'production',                  // [Optional] Skill Stage
    logLevel: 'error',                    // [Optional] Log level
    database: {                           // [Optional] Database configuration
        type: 's3',                       // [Optional] Database type (none / s3 / dynamodb)
        tableName: 'example-bucket-name', // [Optional] Database table name
        s3PathPrefix: 'path-prefix'       // [Optional] [Only S3] S3 path prefix
    },
    skillId: 'ask.your.skill.id',         // [Optional] Skill ID
    errorHandler: {                       // [Optional] error handler configurations
        usePreset: true,                  // [Optional] Use preset error handler
        sentry: {                         // [Optional] Error tracker configuration (sentry)
            dsn: process.env.SENTRY.DSN   // [Optional] Sentry dsn
        }
    }
}

export const handler = SkillFactory.launch(config)
.addRequestHandlers({
    canHandle(input) {
        return input.requestEnvelope.request.type === 'LaunchRequest'
    },
    handle(input) {
        return input.responseBuilder.speak('Hello').getResponse()
    }
})
.createLambdaHandler()

```

## Feature

### Fully Compatible to ask-sdk

@talkyjs has a various utility classes and function.
But almost feature has a compatibility to ask-sdk.

Easy to setup, easty to customize.

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

### Logging
Automatically log these props.

- Request
- Response

### Optimizing the Database request

TalkyJS has a extended persistentAttributesManager.

```typescript
import { PersistanteAttributesManager, SkillFactory } from '@talkyjs/core';
SkillFactory.launch({
  database: {
    type: 's3', // or 'dynamodb'. When select 'none', it does not work!
    tableName: 'example-bucket'
  }
}).addRequestHandlers({
  canHandle(input) {
    return input.requestEnvelope.request.type === 'LaunchRequest'
  },
  async handle(input) {
    // Create manager
    const persistenceManager = new PersistanteAttributesManager(input.attributesManager)

    // Get saved data with default value
    const { name } = await persistenceManager.getPersistentAttributes({
      name: 'sir'
    })

    // Update parameter with merging exists attributes
    await persistenceManager.updatePersistentAttributes({
      now: new Date().toISOString()
    })
    return input.responseBuilder.speak(`Hello ${name}`).getResponse()
  }
})
```

And all persistent attributes using the manager will saved at the ResponseInterceptor automatically.
So, the database connection has been optimized.

#### Save immediately

We can save it to execute `await persistenceAdapter.save()` method.
And the method is checking is the attributes updated.

```typescript
// Update attributes
await persistenceManager.updatePersistentAttributes({
  now: new Date().toISOString()
})

// Save now!
await persistenceAdapter.save()

// Nothing to do (Because no attributes has been updated)
await persistenceAdapter.save()

// Update attributes second time
await persistenceManager.updatePersistentAttributes({
  now: new Date().toISOString()
})

// Save!
await persistenceAdapter.save()
```