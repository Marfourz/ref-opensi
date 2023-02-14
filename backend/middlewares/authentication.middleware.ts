import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './constants.middleware';
import { UsersService } from '../apps/users-manager/src/users.service';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    public usersService: UsersService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log(
      'Authentication middleware for : ' + req.url + ' Method ' + req.method,
    );
    if (req.headers['x-auth-token']) {
      try {
        const token = String(req.headers['x-auth-token']);
        this.jwtService
          .verifyAsync(token, { secret: JWT_SECRET })
          .then(async (result) => {
            const { data } = result;
            req.body.user = data;
            next();
          })
          .catch((error) => {
            console.error(error);
            res.status(HttpStatus.UNAUTHORIZED).send(error);
          });
      } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).send();
      }
    } else {
      res.status(HttpStatus.BAD_REQUEST).send();
    }
  }
}
