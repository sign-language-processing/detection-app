export class UnrecoverableError extends Error {
  permanent = true;
}

export class BadRequestError extends UnrecoverableError {
  code = 400;
}

export class CodedError extends Error {
  constructor(public code: number, message?: string) {
    super(`Code: ${code}; Message: ${message}`);
  }
}

export class AuthorizationError extends UnrecoverableError {
  code = 401;

  constructor(message?: string) {
    super(message ? `Authorization Error - ${message}` : 'Authorization Error');
  }
}

export class ForbiddenError extends Error {
  code = 403;
}

export class NotFoundError extends Error {
  code = 404;
}

export class EntityNotFoundError extends NotFoundError {
  constructor(public entity: string) {
    super(entity + ' not found');
  }
}

export class MissingParamError extends BadRequestError {
  constructor(public param: string) {
    super(param + ' parameter missing');
  }
}

export class ServerError extends Error {
  code = 500;
}
