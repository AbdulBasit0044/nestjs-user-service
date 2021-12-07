export interface BaseRpcResponse {
  error?: {
    isUnknownError?: boolean
    code: string
    message: string
    metadata?: string
  }
}
