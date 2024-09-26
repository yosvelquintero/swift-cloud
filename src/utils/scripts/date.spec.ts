import { getDateFromMonth } from './date';

describe('getDateFromMonth', () => {
  const fixedDate = new Date(Date.UTC(2023, 0, 1, 0, 0, 0, 0)); // January 1, 2023 UTC

  beforeEach(() => {
    // Mock Date.now() to return the fixed date's timestamp
    jest
      .spyOn(global.Date, 'now')
      .mockImplementation(() => fixedDate.getTime());
  });

  afterEach(() => {
    // Restore the original implementation of Date.now()
    jest.spyOn(global.Date, 'now').mockRestore();
  });

  it('should return the last day of January 2023', () => {
    const result = getDateFromMonth('January', 2023);
    const expectedDate = new Date(Date.UTC(2023, 0, 31, 0, 0, 0, 0));
    expect(result.getTime()).toEqual(expectedDate.getTime());
  });

  it('should return the last day of February 2024 (leap year)', () => {
    const result = getDateFromMonth('February', 2024);
    const expectedDate = new Date(Date.UTC(2024, 1, 29, 0, 0, 0, 0));
    expect(result.getTime()).toEqual(expectedDate.getTime());
  });

  it('should return the last day of February 2023 (non-leap year)', () => {
    const result = getDateFromMonth('February', 2023);
    const expectedDate = new Date(Date.UTC(2023, 1, 28, 0, 0, 0, 0));
    expect(result.getTime()).toEqual(expectedDate.getTime());
  });

  it('should default to the current year if year is not provided', () => {
    const currentYear = new Date().getFullYear();
    const result = getDateFromMonth('March');
    const expectedDate = new Date(Date.UTC(currentYear, 2, 31, 0, 0, 0, 0));
    expect(result.getTime()).toEqual(expectedDate.getTime());
  });

  it('should handle months with 30 days', () => {
    const result = getDateFromMonth('April', 2023);
    const expectedDate = new Date(Date.UTC(2023, 3, 30, 0, 0, 0, 0));
    expect(result.getTime()).toEqual(expectedDate.getTime());
  });

  it('should handle months with 31 days', () => {
    const result = getDateFromMonth('May', 2023);
    const expectedDate = new Date(Date.UTC(2023, 4, 31, 0, 0, 0, 0));
    expect(result.getTime()).toEqual(expectedDate.getTime());
  });

  it('should return the last day of December 2023', () => {
    const result = getDateFromMonth('December', 2023);
    const expectedDate = new Date(Date.UTC(2023, 11, 31, 0, 0, 0, 0));
    expect(result.getTime()).toEqual(expectedDate.getTime());
  });

  it('should throw an error for invalid month names', () => {
    expect(() => getDateFromMonth('InvalidMonth', 2023)).toThrowError(
      'Invalid time value',
    );
  });

  it('should throw an error when month name is an empty string', () => {
    expect(() => getDateFromMonth('', 2023)).toThrowError('Invalid time value');
  });

  it('should handle different cases in month names', () => {
    const result = getDateFromMonth('jAnUaRy', 2023);
    const expectedDate = new Date(Date.UTC(2023, 0, 31, 0, 0, 0, 0));
    expect(result.getTime()).toEqual(expectedDate.getTime());
  });

  it('should handle month names with extra whitespace', () => {
    const result = getDateFromMonth('  February  ', 2023);
    const expectedDate = new Date(Date.UTC(2023, 1, 28, 0, 0, 0, 0));
    expect(result.getTime()).toEqual(expectedDate.getTime());
  });
});
