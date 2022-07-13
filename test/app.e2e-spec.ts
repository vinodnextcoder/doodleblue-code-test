import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/ User signup', () => {
    return request(app.getHttpServer())
      .post('/api/v1/user/signup')
      .send({
        "fullname": "Yogesh patil",
        "email": "yogeshs@gmail.com",
        "mobileNo": "8890197788",
        "password": "123456",
        "userType": "admin"
      })
      .expect(201)
  });

  it('/ User signin', () => {
    return request(app.getHttpServer())
      .post('/api/v1/user/signin')
      .send({
        "fullname": "Yogesh patil",
        "email": "yogeshs@gmail.com",
        "mobileNo": "8890197788",
        "password": "123456",
        "userType": "admin"
      })
      .expect(200)
  });
});
