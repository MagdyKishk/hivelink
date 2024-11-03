export const HTTP_STATUS = {
  /** Request succeeded */
  OK: 200,
  /** Request succeeded and new resource created */
  CREATED: 201,
  /** Request accepted for processing but not yet completed */
  ACCEPTED: 202,
  /** Request succeeded but no content returned */
  NO_CONTENT: 204,
  /** Server cannot process request due to client error */
  BAD_REQUEST: 400,
  /** Authentication required or failed */
  UNAUTHORIZED: 401,
  /** Payment required to access resource */
  PAYMENT_REQUIRED: 402,
  /** Client does not have permission to access resource */
  FORBIDDEN: 403,
  /** Requested resource could not be found */
  NOT_FOUND: 404,
  /** HTTP method not allowed for requested resource */
  METHOD_NOT_ALLOWED: 405,
  /** Server cannot generate response matching client's accepted content types */
  NOT_ACCEPTABLE: 406,
  /** Server timed out waiting for the request */
  REQUEST_TIMEOUT: 408,
  /** Request conflicts with current state of the server */
  CONFLICT: 409,
  /** Resource is no longer available and will not be available again */
  GONE: 410,
  /** Request was well-formed but contains semantic errors */
  UNPROCESSABLE_ENTITY: 422,
  /** User has sent too many requests in a given time period */
  TOO_MANY_REQUESTS: 429,
  /** Server encountered an unexpected error */
  INTERNAL_SERVER_ERROR: 500,
  /** Server does not support functionality required to fulfill request */
  NOT_IMPLEMENTED: 501,
  /** Server acting as gateway received invalid response from upstream server */
  BAD_GATEWAY: 502,
  /** Server is temporarily unable to handle request */
  SERVICE_UNAVAILABLE: 503,
  /** Server acting as gateway did not receive response from upstream server in time */
  GATEWAY_TIMEOUT: 504,
} as const;
