class UserLogin {
  constructor(payload) {
    this._verifyPayload(payload);

    const { username, password } = payload;

    this.username = username;
    this.password = password;
  }

  _verifyPayload({ username, password }) {
    if (!username || !password) {
      throw new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY');
    }
 
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
 
    if (username.length > 50) {
      throw new Error('USER_LOGIN.USERNAME_LIMIT_CHAR');
    }
 
    // sebelumnya /^[a-zA-Z1-9_]+$/
    // cara cepat /^[\w]+$/
    // hanya alfabet & desimal
    if (!username.match(/^[\w]+$/)) {
      throw new Error('USER_LOGIN.USERNAME_CONTAIN_RESTRICTED_CHARACTER');
    }
  }
}

module.exports = UserLogin;
