import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { DomainError } from './DomainError';

const ERROR_STATUS: Record<string, number> = {
  USER_ALREADY_EXISTS: HttpStatus.CONFLICT,
  USER_NOT_FOUND: HttpStatus.NOT_FOUND,
  ROLE_NOT_FOUND: HttpStatus.NOT_FOUND,
  PATIENT_NOT_FOUND: HttpStatus.NOT_FOUND,
  PATIENT_ALREADY_ARCHIVED: HttpStatus.CONFLICT,
  USER_ALREADY_DISABLED: HttpStatus.CONFLICT,
  USER_ALREADY_ACTIVE: HttpStatus.CONFLICT,
  USER_ALREADY_ARCHIVED: HttpStatus.CONFLICT,
  INVALID_EMAIL: HttpStatus.BAD_REQUEST,
  INVALID_USER_ID: HttpStatus.BAD_REQUEST,
  INVALID_ROLE_NAME: HttpStatus.BAD_REQUEST,
  INVALID_PERMISSION_CODE: HttpStatus.BAD_REQUEST,
  INVALID_PASSWORD_HASH: HttpStatus.BAD_REQUEST,
  INVALID_USER_STATE: HttpStatus.BAD_REQUEST,
  USER_STATE_TRANSITION_NOT_ALLOWED: HttpStatus.BAD_REQUEST,
  USER_CANNOT_ACTIVATE_WITHOUT_ROLE: HttpStatus.BAD_REQUEST,
  ACTOR_ALREADY_LINKED: HttpStatus.CONFLICT,
  INVALID_CREDENTIALS: HttpStatus.UNAUTHORIZED,
  INVALID_PATIENT_ID: HttpStatus.BAD_REQUEST,
  INVALID_PATIENT_NAME: HttpStatus.BAD_REQUEST,
  INVALID_BIRTH_DATE: HttpStatus.BAD_REQUEST,
  INVALID_CONTACT_INFO: HttpStatus.BAD_REQUEST,
  PATIENT_STATE_TRANSITION_NOT_ALLOWED: HttpStatus.BAD_REQUEST,
};

/** Capturem els errors de domini amb un filtre global NestFactory
 * i els traduim a respostes HTTP específiques per cada error,
 * intentant evitar retornar l'error 500 genèric "Internal server error".
 *
 * `main.ts`
 * ```
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   app.useGlobalFilters(new DomainErrorFilter());
 *   await app.listen(process.env.PORT ?? 3000);
 * }
 * ```
 */
@Catch(DomainError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = ERROR_STATUS[exception.code] ?? HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      code: exception.code,
    });
  }
}
