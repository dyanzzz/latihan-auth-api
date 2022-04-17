const UserLogin = require('../UserLogin');

describe('UserLogin entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'abc'
    };

    // Action & Assert
    expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      username: 123,
      password: 'abc',
    };

    expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when username contains more than 50 character', () => {
    // Arrange
    const payload = {
      username: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      password: 'DicodingPassword',
    };
    // Action and Assert
    expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.USERNAME_LIMIT_CHAR');
  });

  it('should throw error when username contains restricted character', () => {
    // Arrange
    const payload = {
      username: 'dico ding',
      password: 'dicoding'
    };
    // Action and Assert
    expect(() => new UserLogin(payload)).toThrowError('USER_LOGIN.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
  });

  it('should create UserLogin object correctly', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      password: 'DicodingIndonesia'
    };
    // Action
    const { username, password } = new UserLogin(payload);
    // Assert
    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });

});