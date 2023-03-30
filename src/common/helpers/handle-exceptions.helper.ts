import { BadRequestException, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';

const logger = new Logger('Exception');

export function HandleExceptions(error: any) {
  // IX unique key violation error code in postgres
  if (error.code === '23505') throw new BadRequestException(error.detail.replace('Key ', ''));

  // Not found error code
  if (error.status === 404) throw new NotFoundException(error.message);

  // Unexpected error
  logger.log(error);
  throw new InternalServerErrorException('Unexpected error, check logs.');
}
