import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Url } from './entities/url.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Url]), UsersModule],
  controllers: [UrlsController],
  providers: [UrlsService, JwtService],
  exports: [UrlsService],
})
export class UrlsModule { }
