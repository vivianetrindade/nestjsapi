import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismamService } from '../src/prismam/prismam.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

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
    let id: number;
    describe('Get empty Bookmarks', () => {
      it('should get empty bookmark', async () => {
        const response = await request(app.getHttpServer())
          .get('/bookmarks')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);

        expect(response.body).toHaveLength(0);
      });
    });

    describe('Create Bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'nestjs tutorial',
        link: 'https://www.youtube.com/watch?v=GHTA143_b-s',
      };
      it('should create a bookmark', async () => {
        const response = await request(app.getHttpServer())
          .post('/bookmarks/create')
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(dto)
          .expect(201);
        id = response.body.id;
        expect(response.body.title).toBe(dto.title);
      });

      it('should trow an error if link is empty', () => {
        return request(app.getHttpServer())
          .post('/bookmarks/create')
          .set('Authorization', `Bearer ${jwtToken}`)
          .send({
            title: dto.title,
          })
          .expect(400);
      });

      it('shoul trow an error if title is empty', () => {
        return request(app.getHttpServer())
          .post('/bookmarks/create')
          .set('Authorization', `Bearer ${jwtToken}`)
          .send({
            link: dto.link,
          })
          .expect(400);
      });
    });

    describe('Get Bookmarks', () => {
      it('should get  bookmarks', async () => {
        const response = await request(app.getHttpServer())
          .get('/bookmarks')
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);

        expect(response.body).toHaveLength(1);
      });
    });
    describe('Get bookmark by id', () => {
      it('should get one bookmark', async () => {
        const response = await request(app.getHttpServer())
          .get(`/bookmarks/${id}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);
        expect(response.body.id).toBe(id);
      });
    });

    describe('Edit bookmark', () => {
      const dto: EditBookmarkDto = {
        description: 'Tutorial about nest JS framework',
      };
      it('should edit bookmark', async () => {
        const response = await request(app.getHttpServer())
          .patch(`/bookmarks/${id}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .send(dto)
          .expect(200);
        console.log({ response: response.body });
        expect(response.body.description).toBe(dto.description);
      });
    });

    describe('Delete Bookmark', () => {
      it('should delete bookmark', async () => {
        const response = await request(app.getHttpServer())
          .delete(`/bookmarks/${id}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(204);
        console.log({ response: response.body });
        // expect(response.body.description).toBe(dto.description);
      });
      it('should not be in database anymore', async () => {
        const response = await request(app.getHttpServer())
          .get(`/bookmarks/${id}`)
          .set('Authorization', `Bearer ${jwtToken}`)
          .expect(200);
        expect(response.body).toStrictEqual({});
      });
    });
  });

  afterAll(() => {
    app.close();
  });
});
