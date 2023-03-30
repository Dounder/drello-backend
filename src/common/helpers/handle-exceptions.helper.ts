import { ErrorCodes } from './errors-codes.helper';
import { BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

const logger = new Logger('Exception');

export function HandleExceptions(error: any) {
  console.log({ error });
  // IX unique key violation error code in postgres
  if (error.code === '23505')
    throw new BadRequestException({
      message: error.detail,
      error: ErrorCodes.ALREADY_EXISTS,
    });

  // Not found error code
  if (error.status === 404)
    throw new NotFoundException({
      message: error.message,
      error: ErrorCodes.NOT_FOUND,
    });

  // Unexpected error
  logger.log(error);
  throw new InternalServerErrorException({
    message: 'Unexpected error',
    error: ErrorCodes.UNEXPECTED_ERROR,
  });
}
