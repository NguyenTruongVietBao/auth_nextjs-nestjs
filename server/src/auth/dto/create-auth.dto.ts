import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'Email is required' })
  username: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
