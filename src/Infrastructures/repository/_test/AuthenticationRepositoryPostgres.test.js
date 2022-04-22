const InvariantError = require('../../../Commons/exceptions/InvariantError');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const AuthenticationRepositoryPostgres = require('../AuthenticationRepositoryPostgres');

describe('AuthenticationRepository Postgres', () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken', () => {
    it('should persist register user', async () => {
      const token = '123'; // stub!
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool)

      // action & assert
      await authenticationRepository.addToken(token)

      const tokens = await AuthenticationsTableTestHelper.findToken(token);
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    })
  });

  describe('checkAvailabilityToken', () => {
    it('should throw InvariantError when token not found', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      const token = '123'

      // action & assert
      await expect(authenticationRepository.checkAvailabilityToken(token)).rejects.toThrow(InvariantError)
    });

    it('should return token when token is found', async () => {
      // arrange
      const authenticationRepositoryPostgres = new AuthenticationRepositoryPostgres(pool, {});
      const token = '123'
      await AuthenticationsTableTestHelper.addToken(token);

      // action & assert
      await expect(authenticationRepositoryPostgres.checkAvailabilityToken(token)).resolves.not.toThrow(InvariantError)
    });
  });

  describe('deleteToken', () => {
    it('should delete token from database', async () => {
      // Arrange
      const authenticationRepository = new AuthenticationRepositoryPostgres(pool);
      const token = '123'
      await AuthenticationsTableTestHelper.addToken(token);

      // action
      await authenticationRepository.deleteToken(token);
      const tokens = await AuthenticationsTableTestHelper.findToken(token);

      // assert
      expect(tokens).toHaveLength(0)
    });
  })
})