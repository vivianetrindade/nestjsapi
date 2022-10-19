import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismamService } from '../src/prismam/prismam.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismamService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismamService);
    await prisma.cleanDb();
  });

  let jwtToken: string;
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'trindade.viviane@gmail.com',
      password: '123',
    };
    describe('Signup', () => {
      it('should trown an error if email empty', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: '',
            password: dto.password,
          })
          .expect(400);
      });

      it('should trown an error if password empty', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send({
            email: dto.email,
            password: '',
          })
          .expect(400);
      });

      it('should trown an error if password empty', () => {
        return request(app.getHttpServer()).post('/auth/signup').expect(400);
      });

      it('should signup', () => {
        return request(app.getHttpServer())
          .post('/auth/signup')
          .send(dto)
          .expect(201);
      });
    });

    
    describe('Signin', () => {
      const dto: AuthDto = {
        email: 'trindade.viviane@gmail.com',
        password: '123',
      };
      it('should trown an error if email empty', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: '',
            password: dto.password,
          })
          .expect(400);
      });

      it('should trown an error if password empty', () => {
        return request(app.getHttpServer())
          .post('/auth/signin')
          .send({
            email: dto.email,
            password: '',
          })
          .expect(400);
      });

      it('should trown an error if password empty', () => {
        return request(app.getHttpServer()).post('/auth/signin').expect(400);
      });

      it('should signin', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/signin')
          .send(dto)
          .expect(200);
        jwtToken = response.body.access_token;
        // console.log(jwtToken);
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);
      });
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          email: 'trindade2.viviane@gmail.com',
        };
        return request(app.getHttpServer())
          .patch('/users')
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(dto)
          .expect(200);
      });
    });
  });

  describe('bookmark', () => {
    describe('Get empty Bookmarks', () => {
      it('shoul get empty bookmark', () => {
        return request(app.getHttpServer())
          .get('/bookmarks')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);
      });
    });

    describe('Create Bookmark', () => {});


    describe('Get one bookmark', () => {});

    describe('Edit bookmark', () => {});

    describe('Delete Bookmark', () => {});
  });

  afterAll(() => {
    app.close();
  });
  // it('/ (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });
});
