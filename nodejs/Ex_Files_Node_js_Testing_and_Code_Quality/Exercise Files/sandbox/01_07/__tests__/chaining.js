const Reservation = require('../Reservation');

describe('Reservation creation', () => {
  it('should create a reservation with a valid email', () => {
    const email = 'username@example.com';
    const reservation = new Reservation({ email });
    expect(reservation)
        .toHaveProperty('email', email)
        .toBeInstanceOf(Reservation);
  });    
});