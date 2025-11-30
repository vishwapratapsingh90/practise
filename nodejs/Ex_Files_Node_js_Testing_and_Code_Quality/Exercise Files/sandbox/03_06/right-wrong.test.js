function toTest(callback) {
  setImmediate(() => callback('yay'));
}

test('the right way to test a callback', done => {
  function callback(value) {
    try {
      expect(value).toBe('nooo');
      done();
    } catch (error) {
      done(error);
    }
  }

  toTest(callback);
})

test('the wrong way to test a callback', () => {
  function callback(value) {
    expect(value).toBe('nooo');
  }

  toTest(callback);
})
