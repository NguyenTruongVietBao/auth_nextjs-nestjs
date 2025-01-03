import {IsNotEmpty} from 'class-validator';

export class VerifyAuthDto {
    @IsNotEmpty({message: '_id is required'})
    _id: string;

    @IsNotEmpty({message: 'code is required'})
    code: string;

}
