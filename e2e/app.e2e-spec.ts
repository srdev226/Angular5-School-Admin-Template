import { GreenchalkAdminPage } from './app.po';

describe('greenchalk-admin App', function() {
  let page: GreenchalkAdminPage;

  beforeEach(() => {
    page = new GreenchalkAdminPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
