import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';

@Controller('users')  // ./v1/users/
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        console.log('User data:', createUserDto);
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll(
        @Query() query: string,
        @Query('current') current: number,
        @Query('pageSize') pageSize: number,
    ) {
        return this.usersService.findAll(query, current, pageSize);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch()
    update(@Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
