import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Response } from 'src/common/interceptor/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();

        // Check for a custom message from the controller
        let message = 'Operation successful';
        if (data && typeof data === 'object' && 'message' in data) {
          message = data.message;
        }

        // Construct the response using the ApiResponse interface
        const apiResponse: Response<T> = {
          status: response.statusCode,
          message,
          data, // Controller's output
        };

        return apiResponse;
      }),
      catchError((error) => {
        // Extract status code
        const status =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        // Extract error message and details
        let message = 'Internal server error';
        let errorDetails = null;

        if (error instanceof HttpException) {
          const response = error.getResponse();
          if (typeof response === 'string') {
            message = response;
          } else if (typeof response === 'object' && response !== null) {
            message = (response as any).message || error.message;
            errorDetails = response;
          }
        } else if (error instanceof Error) {
          // For non-HTTP errors, show the actual error message
          message = error.message;
        }

        // Return the error in the standard format
        return throwError(
          () =>
            new HttpException(
              {
                statusCode: status,
                message: message,
                error: errorDetails || error.name || 'Error',
              },
              status,
            ),
        );
      }),
    );
  }
}
