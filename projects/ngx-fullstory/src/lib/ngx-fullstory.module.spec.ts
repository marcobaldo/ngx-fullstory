import { FullstoryModule } from './ngx-fullstory.module';

describe('FullstoryModule', () => {
  let fullstoryModule: FullstoryModule;

  beforeEach(() => {
    fullstoryModule = new FullstoryModule();
  })

  it('should create an instance', () => {
    expect(fullstoryModule).toBeTruthy();
  });
});
