import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { Error } from 'mongoose';
import ValidationError = Error.ValidationError;

@Catch(ValidationError)
export class ValidationErrorFilter implements RpcExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost): any {
    const ctx = host.switchToHttp(),
      response = ctx.getResponse();

    return response.status(400).json({
      statusCode: 400,
      message: Object.values(exception.errors).map((error) =>
        error.message.toLowerCase(),
      ),
      error: 'Bad Request',
    });
  }
}
