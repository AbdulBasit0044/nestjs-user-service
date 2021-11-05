export const {
  PORT = 4000,
  TOKEN_VERIFIER = 'secret123',
  NODE_ENV = process.env.NODE_ENV || 'dev',
  MONGO_URI = 'mongodb://localhost:27017/template-api',
  GRPC_URL = '0.0.0.0:50051', // use this to be accessible from outside
  // This is just for temporary use we will move forward with env in the future.
  DSN_URL = 'https://deb7d262e1fe4aa2abdd36001ae9ff3e@o207331.ingest.sentry.io/1761994',
  GOOGLE_CLIENT = 'xxxxxx-xxxxxxx-xxxxxxxx-xxxxxxx-xxxxxxx',
  GOOGLE_S = 'xxxxxx-xxxxxx-xxxxxxx-xxxxxx-xxxxxxx-xxxxxxx',
  ROOT_URL = 'http://localhost:4000/',
  OFFICE_CLIENT = 'xxxxxxxx-xxxxxxx-xxxxx-xxxx',
  OFFICE_CLIENT_S = 'xxxxxxxx-xxxxxxx-xxxxx-xxxx',
  GOOGLE_PROJECT_ID = 'axiomatic-robot-268107',
  PUBSUB_TOPIC_NAME = 'cool-topic',
  USE_NOTES_REGISTER_SUCCESS_CALL_BACK_URL = '/auth/welcome/user',
  GOOGLE_AUTH_CALLBACK = 'auth/google',
  GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth',
  GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token',
  GOOGLE_IDENTITY_ENDPOINT = 'https://www.googleapis.com/oauth2/v1/userinfo',
  OFFICE_AUTH_CALLBACK = 'auth/outlook',
  OFFICE_AUTH_ENDPOINT = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  OFFICE_TOKEN_ENDPOINT = 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  OFFICE_IDENTITY_ENDPOINT = 'https://graph.microsoft.com/v1.0/me',
  REFRESH_TOKEN_HEADER = 'fireflies-updated-tokens'
} = process.env
export const USER_KEY = 'validate_auth'
export const AUTH_HEADER = 'authorization'
export const IS_PROD = NODE_ENV === 'production'
export const IS_STAGING = NODE_ENV === 'staging'

export enum ActionType {
  USER_CREATED = 'user_created',
  USER_DELETED = 'user_deleted',
  USER_REACTIVATED = 'user_activated',
  USER_DEACTIVATED = 'user_deactivated',
  USER_AUTOJOIN_SETTING_CHANGED = 'user_autojoin_setting_changed',
  REFRESH_TOKEN_FAILED = 'refresh_token_failed'
}

export enum EventTYPE {
  USER_DEACTIVATED_EVENT = 'user.deactivated',
  USER_CREATED_EVENT = 'user.created',
  USER_DELETED_EVENT = 'user.deleted',
  USER_AUTOJOIN_SETTING_CHANGE_EVENT = 'user.autojoin-setting-change',
  REFRESH_TOKEN_FAILED_EVENT = 'refresh-token.failed'
}

export const OFFICE_365_OAUTH_SCOPE =
  'openid profile offline_access https://graph.microsoft.com/user.read https://graph.microsoft.com/calendars.read'
export const GOOGLE_AUTH_SCOPE =
  'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'

export const HMAC_TYPE = 'sha256'
export const HMAC_VERSION = 'v0'
export const DIGEST_TYPE = 'hex'
export const AUTH_MECHANISM = IS_PROD || IS_STAGING ? 'SCRAM-SHA-1' : undefined
