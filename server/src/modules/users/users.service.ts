import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hashPassword } from '@/helpers/utils';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModal: Model<User>) {}

  isEmailExist = async (email: string) => {
    const emailExist = await this.userModal.exists({ email });
    if (emailExist) {
      return true;
    }
    return false;
  };

  async create(createUserDto: CreateUserDto) {
    //extract properties from createUserDto
    const { name, email, password, phone, address, image } = createUserDto;

    //existing email
    const emailExist = await this.isEmailExist(email);
    if (emailExist) {
      throw new BadRequestException('Email already exists');
    }
    //hash password
    const passwordHashed = await hashPassword(password);
    //create user
    const user = new this.userModal({
      name,
      email,
      password: passwordHashed,
      phone,
      address,
      image,
    });
    //save user
    return user.save();
  }

  async findAll(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);

    if (filter.current) {
      delete filter.current;
    }
    if (filter.pageSize) {
      delete filter.pageSize;
    }
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;

    const totalItems = (await this.userModal.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const result = await this.userModal
      .find(filter)
      .limit(pageSize)
      .sort(sort as any)
      .select('-password')
      .skip(skip);
    return { result, totalPages };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
