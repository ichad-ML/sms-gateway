import { Test, TestingModule } from '@nestjs/testing';
import { InAppOtpService } from './in-app-otp.service';

describe('InAppOtpService', () => {
  let service: InAppOtpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InAppOtpService],
    }).compile();

    service = module.get<InAppOtpService>(InAppOtpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
