const { after } = require('lodash');
const Reservation = require('./schema/reservation');

const mockDebug = jest.fn();
const mockInsert = jest.fn().mockResolvedValue([1]);

jest.mock('debug', () => () => mockDebug);
jest.mock('./knex', () => () => ({
  insert: mockInsert,
}));

let reservations;

describe('save', () => {
  it('should resolve with the id upon success', async () => {
    reservations = require('./reservations');
    const value = { foo: 'bar' };
    const expected = [1];

    const actual = await reservations.save(value);

    expect(actual).toStrictEqual(expected);
    expect(mockDebug).toHaveBeenCalledTimes(1);
    expect(mockInsert).toHaveBeenCalledWith(value);
  });
});

describe('validate', () => {
  it('should resolve with no optional fields',() => {
    reservations = require('./reservations');
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

  it('should resolve with no optional fields with async', async () => {
    reservations = require('./reservations');
    const reservation = new Reservation({
      party: 4,
      name: 'John Doe',
      email: 'john.doe@example.com',
      date: '2024/08/20',
      time: '06:00 PM'
    });

    await expect(reservations.validate(reservation))
      .resolves.toEqual(reservation);
  });

  it('should reject with invalid email',() => {
    reservations = require('./reservations');
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

  it('should reject with invalid email with async', async () => {
    reservations = require('./reservations');
    const reservation = new Reservation({
      party: 4,
      name: 'John Doe',
      email: 'john.doe',
      date: '2024/08/20',
      time: '06:00 PM'
    });

    await expect(reservations.validate(reservation))
      .rejects.toBeInstanceOf(Error);
  });

  it('should be called and reject empty input', async () => {
    reservations = require('./reservations');
    const mock = jest.spyOn(reservations, 'validate');

    const value = undefined;

    await expect(reservations.validate(value)).rejects.toThrow(
      'Cannot read properties of undefined (reading \'validate\')'
    );

    expect(mock).toHaveBeenCalledWith(value);

    mock.mockRestore();
  });

  describe('create', () => {
    it('should reject if validation fails', async () => {
      reservations = require('./reservations');
      const error = new Error('fail');

      const mockReservation = {
        validate: jest.fn((callback) => {
          setImmediate(() => callback(error));
        })
      };

      await expect(reservations.create(mockReservation))
        .rejects.toBe(error);

      expect(mockReservation.validate).toHaveBeenCalledTimes(1);
    });

    it ('should reject if validation fails using spyOn', async () => {
      reservations = require('./reservations');
      const mock = jest.spyOn(reservations, 'create');

      const error = new Error('fail');

      mock.mockImplementation(() => Promise.reject(error));

      const value = 'Puppy';

      await expect(reservations.create(value)).rejects.toEqual(error);

      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(value);

      mock.mockRestore();
    });

    it ('should create reservation if there are no validation errors', async () => {
      reservations = require('./reservations');
      const expectedInsertId = 1;

      const reservation = {
        foo: 'bar',
        validate: jest.fn((callback) => {
          setImmediate(() => callback(null, reservation));
        })
      };

      mockInsert.mockResolvedValue([expectedInsertId]);

      await expect(reservations.create(reservation)).resolves.toStrictEqual(expectedInsertId);

      expect(reservation.validate).toHaveBeenCalledTimes(1);
      expect(mockInsert).toHaveBeenCalledWith(reservation);
    });
  });
});
