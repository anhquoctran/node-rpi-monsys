import { RpiMonsysWebmanagerPage } from './app.po';

describe('rpi-monsys-webmanager App', function() {
  let page: RpiMonsysWebmanagerPage;

  beforeEach(() => {
    page = new RpiMonsysWebmanagerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
