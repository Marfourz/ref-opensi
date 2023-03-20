import {
  Injectable,
  NestMiddleware,
  HttpStatus,
  Scope,
  Inject
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JWT_SECRET } from './constants.middleware';
import { PrismaService } from 'libs/prisma/src';

@Injectable({ scope: Scope.REQUEST })
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private prisma: PrismaService,
    @Inject(REQUEST) private readonly req: Request,
  ) {}

  use(req, res: Response, next: NextFunction) {
    console.log(
      'Authentication middleware for : ' + req.url + ' Method ' + req.method,
    );
    if (req.headers['x-auth-token']) {
      try {
        const token = String(req.headers['x-auth-token']);
        this.jwtService
          .verifyAsync(token, { secret: JWT_SECRET })
          .then(async (result) => {
            console.log('>>>>>>>>: ', result);
            const { data } = result;
            data.uid = result.uid;
            this.prisma.user
              .findUnique({
                where: { email: data.email },
                select: {
                  id: true,
                  organisation: true,
                  role: true,
                  status: true,
                },
              })
              .then(async (user) => {
                console.log('<<<<<<<<<<<<<<<: ', user);

                if (user.status != 'active') {
                  console.log('Inctive account');
                  res
                    .status(HttpStatus.UNAUTHORIZED)
                    .send("Votre compte n'est pas actif");
                }

                data.roles.push(user.role);
                data.userId = user.id;
                data.orgId = user.organisation.id;
                req.user = data;

                next();
              })
              .catch((error) => {
                console.error(error);
                res.status(HttpStatus.UNAUTHORIZED).send(error);
              });
          })
          .catch((error) => {
            console.error(error);
            res.status(HttpStatus.UNAUTHORIZED).send(error);
          });
      } catch (error) {
        res.status(HttpStatus.UNAUTHORIZED).send();
      }
    } else {
      res.status(HttpStatus.UNAUTHORIZED).send();
    }
  }
}
