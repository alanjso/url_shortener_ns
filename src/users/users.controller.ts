import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, ClassSerializerInterceptor, SerializeOptions, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersService.create(createUserDto);
    user.password = '';
    return user;
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    if (users.length) {
      (users).forEach(user => {
        user['password'] = '';
      });
    }
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id)

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    user.password = '';
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {

    const user = await this.usersService.update(id, updateUserDto);
    user.password = '';
    return user;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
