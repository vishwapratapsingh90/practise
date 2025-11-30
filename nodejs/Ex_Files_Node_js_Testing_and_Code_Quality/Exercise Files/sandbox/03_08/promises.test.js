// Thanks for taking the extra step in your learning journey! I really appreciate it. --Jon

function toTest() {
  return Promise.resolve('yay');
}

describe('wrong', () => {
  test('will fail because done got a value (Promise)', done => {
    done(toTest()
      .then(value => expect(value).toBe('yay')));
  })

  test('will pass because callback recieved passing expectation', done => {
    toTest()
      .then(value => done(expect(value).toBe('yay')));
  })

  test('will timeout because Promise is not returned and done is never called', done => {
    toTest()
      .then(value => expect(value).toBe('yay'));
  })

  test('will fail with a failing Promise because done callback handles exception', done => {
    toTest()
      .then(value => done(expect(value).toBe('nooo')));
  })

  test('will cause unhandled rejection if failing Promise is not returned', () => {
    toTest()
      .then(value => expect(value).toBe('nooo'));
  })
});

describe('right', () => {
  test('will correctly pass because Promise is returned', () => {
    return toTest()
      .then(value => expect(value).toBe('yay'));
  })

  test('will correctly fail because expectation fails', () => {
    return toTest()
      .then(value => expect(value).toBe('noo'));
  })
});
