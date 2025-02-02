import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [SequelizeModule.forFeature([User]), JwtModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [SequelizeModule, UsersService],
})
export class UsersModule { }
