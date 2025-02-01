import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
// import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), JwtModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [SequelizeModule],
})
export class UsersModule { }
