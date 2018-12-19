import { CommunicationModule } from './communication.module';

describe('CommunicationModule', () => {
  let communicationModule: CommunicationModule;

  beforeEach(() => {
    communicationModule = new CommunicationModule();
  });

  it('should create an instance', () => {
    expect(communicationModule).toBeTruthy();
  });
});
