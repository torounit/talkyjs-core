
import { CustomSkillBuilder, SkillBuilders, DefaultApiClient, RequestHandler } from 'ask-sdk-core'
import { DynamoDbPersistenceAdapter } from 'ask-sdk-dynamodb-persistence-adapter'
import { S3PersistenceAdapter } from 'ask-sdk-s3-persistence-adapter'
import { TLogLevelName } from 'tslog'
import { Router, RequestHandlerFactory } from '@ask-utils/router'
import { LoggerService } from '../Logger'
import {
    TalkyJSDBonfig,
    TalkyJSAPIClientConfig,
    TalkyJSSkillConfig,
    SkillHandler,
    TalkyJSSkillStage
} from './skillFactory.interface'
import { IntentRelectorHandler, withRepeatIntentHandler } from '../handlers/index'

// let cachedSkill: CustomSkillBuilder

/**
 * Sentryでエラー記録できるハンドラー : math-game
        RecordTheResponseInterceptor,
        RepeatIntent,
        DeleteDisabledUserHandler,
        SessionEndedRequestHandler
 * 
 */

export class SkillFactory {
    /**
     * Skill builder
     */
    private readonly skillBuilders: CustomSkillBuilder = SkillBuilders.custom()

    /**
     * Factory instance
     */
    private static _instance: SkillFactory

    /**
     * Skill Router factory
     */
    private readonly router = new RequestHandlerFactory()

    private _hasDevHandlerAdded: boolean = false
    private _hasGeneralHandlerAdded: boolean = false

    /**
     * Log level
     */
    public logLevel: TLogLevelName

    /**
     * Skill working stage
     */
    protected readonly stage: TalkyJSSkillStage;

    public constructor (config: TalkyJSSkillConfig) {
        this.stage = config.stage || 'development'
        this.logLevel = config.logLevel || 'info'
        const skillId = config.skillId || null
        if (skillId) this.skillBuilders.withSkillId(skillId)
        this._configureAPIClients(config.apiClient)
        this._configureDBClients(config.database)
    }

    /**
     * Get factory instance
     * @param config
     */
    public static launch (config: TalkyJSSkillConfig) {
        if (!this._instance) {
            this._instance = new SkillFactory(config)
        }
        return this._instance
    }
    /**
     * Add helper handlers
     */
    private _addGeneralHelpers (): this {
        if (this._hasGeneralHandlerAdded) return this
        this._hasGeneralHandlerAdded = true
        withRepeatIntentHandler(this.skillBuilders)
        return this
    }


    /**
     * Add development helper handlers
     */
    private _addDevelopmentHelpers (): this {
        if (this.stage === 'production') return this
        if (this._hasDevHandlerAdded) return this
        this._hasDevHandlerAdded = true
        this.skillBuilders.addRequestHandlers(IntentRelectorHandler)
        return this
    }

    /**
     * Configure Skill API Client
     * @param apiClient
     */
    private _configureAPIClients (apiClient?: TalkyJSAPIClientConfig): this {
        if (!apiClient) return this
        if (apiClient.useDefault) {
            this.skillBuilders.withApiClient(new DefaultApiClient())
        } else if (apiClient.client) {
            this.skillBuilders.withApiClient(apiClient.client)
        }
        return this
    }

    /**
     * Configure Skill PersistenceAdapter
     * @param database
     */
    private _configureDBClients (database?: TalkyJSDBonfig): this {
        if (!database || database.type === 'none') return this
        if (database.type === 'dynamodb') {
            this.skillBuilders.withPersistenceAdapter(
                new DynamoDbPersistenceAdapter({
                    tableName: database.tableName,
                    createTable: database.withCreateTable || false
                })
            )
        } else if (database.type === 's3') {
            this.skillBuilders.withPersistenceAdapter(
                new S3PersistenceAdapter({
                    bucketName: database.tableName,
                    pathPrefix: database.s3PathPrefix || ''
                })
            )
        }
        return this
    }

    /**
     * Add Router handlers
     * @param routers
     */
    public addRequestRouter (...routers: Router[]): this {
        const handlers = this.router.addRoutes(...routers).createHandlers()
        this.addRequestHandlers(...handlers)
        return this
    }

    /**
     * Add Router handlers
     * @param routers
     */
    public addRequestRouters (routers: Router[]): this {
        this.addRequestRouter(...routers)
        return this
    }

    /**
     * Add native request handler
     * @param handlres
     */
    public addRequestHandlers (...handlres: RequestHandler[]): this {
        this.skillBuilders.addRequestHandlers(...handlres)
        return this
    }

    /**
     * Create SKill
     */
    public getSkill (): CustomSkillBuilder {
        this._addGeneralHelpers()
        /**
         * Add dev helpers
         */
        this._addDevelopmentHelpers()
        return this.skillBuilders
    }

    /**
     * get lambda handler
     */
    public createLambdaHandler (): SkillHandler {
        return async (event, context) => {
            const { logger } = LoggerService.getInstance(event, {
                minLevel: this.logLevel
            })
            logger.info(event)
            const skill = this.getSkill()
            const result = await skill.create().invoke(event, context)
            logger.info(result)
            return result
        }
    }
}
