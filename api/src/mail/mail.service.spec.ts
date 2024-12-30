import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { User } from 'src/users/entities/user.entity';
import * as helper from './mail';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sendPasswordResetEmail => should send a reset email to the passed in user', async () => {
    const user = {
      id: 15,
      name: 'Jack Vu',
      email: 'jacknvu98@gmail.com',
      password: 'fake-password',
      username: 'JackV981',
    } as User;

    const token = 'fake-token';

    jest.spyOn(helper, 'sendMail').mockResolvedValue(undefined);

    const result = await service.sendPasswordResetEmail(user, token);

    expect(result).toBeUndefined();
    expect(helper.sendMail).toHaveBeenCalled();
  });
});
