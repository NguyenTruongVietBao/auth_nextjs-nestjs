import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler, SetMetadata,
} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

// Purpose: Interceptor to transform the response.
const RESPONSE_MESSAGE = 'response_message';
export const ResponseMessage = (message: string) => SetMetadata(RESPONSE_MESSAGE, message);

export interface Response<T> {
    statusCode: number;
    message?: string;
    data: any;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    constructor(private reflector: Reflector) {
    }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next
            .handle()
            .pipe(
                map((data) => ({
                    statusCode: context.switchToHttp().getResponse().statusCode,
                    message: this.reflector
                        .get<string>(RESPONSE_MESSAGE, context.getHandler()) || '',
                    data: data
                })),
            );
    }
}