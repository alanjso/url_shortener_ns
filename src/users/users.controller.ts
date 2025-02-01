import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UnauthorizedException, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    const users = await this.usersService.findAll();
    if (users.length) {
      (users).forEach(user => {
        user['password'] = '';
      });
    }
    return users;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id)

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
    }

    user.password = '';
    return user;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {

    const userId = req.user.id;
    if (userId !== id) {
      throw new UnauthorizedException(`userId ${userId} e ID ${id} não compatíveis`);
    }

    const user = await this.usersService.update(id, updateUserDto);
    user.password = '';
    return user;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    if (userId !== id) {
      throw new UnauthorizedException(`userId ${userId} e ID ${id} não compatíveis`);
    }

    return this.usersService.remove(id);
  }
}
