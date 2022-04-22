const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtTokenManager = require('../JwtTokenManager');

describe('JwtTokenManager', () => {
  describe('createAccessToken function', () => {
    it('should create access token correctly', async () => {
      // arrange
      const payload = {
        username: 'dicoding'
      }

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token')
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken);

      // action
      const accessToken = await jwtTokenManager.createAccessToken(payload)

      // assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.ACCESS_TOKEN_KEY)
      expect(accessToken).toEqual('mock_token')
    });
  });

  describe('createResfreshToken function', () => {
    it('should create refreshToken correctly', async () => {
      // arrange
      const payload = {
        username: 'dicoding'
      }

      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => 'mock_token')
      };
      const jwtTokenManager = new JwtTokenManager(mockJwtToken)

      // action
      const refreshToken = await jwtTokenManager.createRefreshToken(payload)

      // assert
      expect(mockJwtToken.generate).toBeCalledWith(payload, process.env.REFRESH_TOKEN_KEY)
      expect(refreshToken).toEqual('mock_token')
    });
  });

  describe('verifyRefreshToken', () => {
    it('should throw invariant error when verification failed', async () => {
      // arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' })

      // action & assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken)).rejects.toThrow(InvariantError)
    })

    it('should throw invariant error when verification failed', async () => {
      // arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const refreshToken = await jwtTokenManager.createRefreshToken({ username: 'dicoding' })

      // action & assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken)).resolves.not.toThrow(InvariantError)
    })
  })

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token)
      const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' })

      // action
      const { username: expectedUsername } = await jwtTokenManager.decodePayload(accessToken)

      // assert
      expect(expectedUsername).toEqual('dicoding')
    });
  });
});