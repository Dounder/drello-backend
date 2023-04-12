import { Catch, ExceptionFilter } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-core';

@Catch(ApolloError)
export class CustomExceptionFilter implements GqlExceptionFilter, ExceptionFilter {
  catch(exception: ApolloError, host: any) {
    const gqlHost = GqlArgumentsHost.create(host);

    const code = exception.extensions?.code || 'INTERNAL_SERVER_ERROR';
    const message = exception.message || 'Internal server error';

    const response = {
      statusCode: exception.extensions?.exception?.status || 500,
      message,
      code,
    };

    gqlHost.getContext().res.status(response.statusCode);

    return [response];
  }
}
