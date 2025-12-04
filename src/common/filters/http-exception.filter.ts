import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'SERVER_ERROR';
    let message = 'An error occurred';
    let details = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || message;
        errorCode = responseObj.error || this.getErrorCode(status);
        details = responseObj.details || {};
      } else {
        message = exceptionResponse as string;
        errorCode = this.getErrorCode(status);
      }
    } else if (exception instanceof Error) {
      // Handle standard JavaScript errors (e.g., MongoDB errors, validation errors)
      message = exception.message;
      errorCode = 'SERVER_ERROR';

      // Log the full error with stack trace for debugging
      this.logger.error(
        `Unhandled Error: ${exception.message}`,
        exception.stack,
        `${request.method} ${request.url}`,
      );
    } else {
      // Handle completely unknown errors
      this.logger.error(
        'Unknown error occurred',
        JSON.stringify(exception),
        `${request.method} ${request.url}`,
      );
      message = 'An unexpected error occurred';
    }

    // Log all errors for monitoring
    this.logger.warn(
      `${request.method} ${request.url} - ${status} - ${errorCode}: ${Array.isArray(message) ? message.join(', ') : message}`,
    );

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message: Array.isArray(message) ? message.join(', ') : message,
        details,
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getErrorCode(status: number): string {
    const errorCodes = {
      [HttpStatus.BAD_REQUEST]: 'VALIDATION_ERROR',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'DUPLICATE_ENTRY',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_ERROR',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'SERVER_ERROR',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
    };

    return errorCodes[status] || 'SERVER_ERROR';
  }
}
