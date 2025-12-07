const reservations = require('./reservations');
const Reservation = require('./schema/reservation');

describe('validate', () => {
  it('should resolve with no optional fields',() => {
    const reservation = new Reservation({
      party: 4,
      name: 'John Doe',
      email: 'john.doe@example.com',
      date: '2024/08/20',
      time: '06:00 PM'
    });

    return expect(reservations.validate(reservation))
      .resolves.toEqual(reservation);
  });

  it('should reject with invalid email',() => {
    const reservation = new Reservation({
      party: 4,
      name: 'John Doe',
      email: 'john.doe',
      date: '2024/08/20',
      time: '06:00 PM'
    });

    expect.assertions(1);

    return reservations.validate(reservation)
      .catch(error => {expect(error).toBeInstanceOf(Error);});
  });
});
