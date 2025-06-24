import { HttpException, HttpExceptionOptions } from "@nestjs/common";
import { HttpErrorByCode } from "@nestjs/common/utils/http-error-by-code.util";

interface CustomHttpException {
    property: string,
    errors: string[]
}


export class HttpFormException extends HttpException {
    constructor(public readonly errors: CustomHttpException, status: number, options?: HttpExceptionOptions | undefined) {
        const error = (new HttpErrorByCode[status]).response
        super({
            message: [errors],
            error: error.message, 
            statusCode: error.statusCode,
        }
        , status, options);
    }
} 