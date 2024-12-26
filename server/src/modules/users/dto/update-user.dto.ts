import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({ message: 'Invalid user id' })
  @IsNotEmpty({ message: 'User id is required' })
  _id: string;

  @IsOptional()
  name: string;
  @IsOptional()
  phone: string;
  @IsOptional()
  address: string;
  @IsOptional()
  image: string;
}
