import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectModel} from '@nestjs/mongoose';
import {User} from './schemas/user.schema';
import {Model} from 'mongoose';
import {hashPassword} from '@/helpers/utils';
import aqp from 'api-query-params';
import {CreateAuthDto} from "@/auth/dto/create-auth.dto";
import {v4 as uuidv4} from 'uuid';
import dayjs from "dayjs";
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModal: Model<User>,
                private readonly mailerService: MailerService) {
    }

    //check if email exists
    isEmailExist = async (email: string) => {
        const emailExist = await this.userModal.exists({email});
        // if (emailExist) {
        //     return true;
        // }
        // return false;
        return !!emailExist;
    };

    //find user by email
    findByEmail = async (email: string) => {
        return this.userModal.findOne({email});
    };

    //find user by id
    findOne(id: string) {
        return `This action returns a #${id} user`;
    }

    //create user
    async create(createUserDto: CreateUserDto) {
        //extract properties from createUserDto
        const {name, email, password, phone, address, image} = createUserDto;

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

    //find all users
    async findAll(query: string, current: number, pageSize: number) {
        const {filter, sort} = aqp(query);

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
        return {result, totalPages};
    }

    //update user
    async update(updateUserDto: UpdateUserDto) {
        const _id = updateUserDto._id;
        const existingUser = await this.userModal.findById(_id);
        if (!existingUser) {
            throw new NotFoundException('User not found');
        }
        const newUser = await this.userModal.findByIdAndUpdate(_id, {
            ...updateUserDto,
        });
        return newUser;
    }

    //delete user
    async remove(_id: string) {
        try {
            const existingUser = await this.userModal.findById(_id);
            if (!existingUser) {
                throw new NotFoundException('User not found');
            }
            return await this.userModal.findByIdAndDelete(_id);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // register
    async register(createUserDto: CreateAuthDto) {
        //extract properties from createUserDto
        const {email, password, name} = createUserDto;
        const codeIdActive = uuidv4();
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
            isActive: false,
            codeId: codeIdActive,
            codeExpired: dayjs().add(1, 'day')
        });

        //send email
        const mailOptions = {
            to: user.email,
            subject: 'ACTIVE YOUR ACCOUNT ✔',
            template: 'register',
            context: {
                name: user?.name ?? user.email,
                activationCode: codeIdActive
            },
        };
        await this.mailerService.sendMail(mailOptions);

        //save user
        return user.save();
    }
}
