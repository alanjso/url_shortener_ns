import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private reflector: Reflector,
        @InjectModel(User) private readonly userModel: typeof User,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            if (request.path === '/shorten') {
                request['user'] = undefined;
                return true;
            }
            throw new UnauthorizedException('No token provided');
        }

        try {

            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });

            if (!decoded?.id) {
                throw new UnauthorizedException('Invalid token payload');
            }

            const user = await this.userModel.findByPk(decoded.id);
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            request['user'] = user;
            return true;
        } catch (error) {
            console.log('error');
            console.log(error);
            throw new UnauthorizedException('Authentication failed');
        }
    }
}
