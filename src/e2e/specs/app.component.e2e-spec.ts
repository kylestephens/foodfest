import { browser, element, by } from 'protractor';

describe('App', () => {

  beforeEach(async () => {
    return await browser.get('/');
  });

  it('should have a title', () => {
    expect(browser.getTitle()).toEqual('elcome to FoodFest | The better way to find event catering');
  });

  it('should have <nav>', () => {
    expect(element(by.css('ak-app ak-navbar nav')).isPresent()).toEqual(true);
  });

  it('should have correct nav text for Home', () => {
    expect(element(by.css('ak-app ak-navbar nav a:first-child')).getText()).toEqual('HOME');
  });

  it('should have correct nav text for About', () => {
    expect(element(by.css('ak-app ak-navbar nav a:nth-child(2)')).getText()).toEqual('ABOUT');
  });

});
