export enum MESSAGE {
  SUCCESS = 'Success',
  FAILED = 'Failed',
  ERROR = 'Error',
  NOT_FOUND = 'Not Found',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  TOO_MANY_REQUESTS = 'Too Many Requests',
  BAD_REQUEST = 'Bad Request',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  SERVICE_UNAVAILABLE = 'Service Unavailable',
}

export enum CODE {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503,
}
