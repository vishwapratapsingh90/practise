const Reservation = require("./reservation");

describe("combineDateTime" , () => {
  test("should return valid ISO 8601 date and time with valid input", () => {
    const date = '2024/07/15';
    const time = '07:30 PM';
    const result = Reservation.combineDateTime(date, time);
    expect(result).toBe('2024-07-15T19:30:00.000Z');
  });
});
