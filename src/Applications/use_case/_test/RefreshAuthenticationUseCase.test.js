const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const RefreshAuthenticationUseCase = require('../RefreshAuthenticationUseCase');

describe('RefreshAuthenticationUseCase', () => {
  it('should throw error if usecase payload not contain refresh token', async () => {
    // arrange
    const useCasePayload = {}
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

    // action & assert
    await expect(refreshAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
  });

  it('should throw error if refresh token not string', async () => {
    // arrange
    const useCasePayload = {
      refreshToken: 1
    }

    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({})

    // action & assert
    await expect(refreshAuthenticationUseCase.execute(useCasePayload))
      .rejects
      .toThrowError('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the refresh authentication action correctly', async () => {
    // arrange
    const useCasePayload = {
      refreshToken: 'some_refresh_token'
    }

    const mockAuthenticationRepository = new AuthenticationRepository()
    const mockAuthenticationTokenManager = new AuthenticationTokenManager()

    // mocking
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.verifyRefreshToken = jest.fn().mockImplementation(() => Promise.resolve())
    mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ username: 'dicoding', id: 'user-123' }))
    mockAuthenticationTokenManager.createAccessToken = jest.fn().mockImplementation(() => Promise.resolve('some_new_access_token'))
    // create usecase instance
    const refreshAuthenticationUseCase = new RefreshAuthenticationUseCase({
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager
    });

    // action
    const accessToken = await refreshAuthenticationUseCase.execute(useCasePayload)

    // assert
    expect(mockAuthenticationTokenManager.verifyRefreshToken).toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationRepository.checkAvailabilityToken).toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationTokenManager.createAccessToken).toBeCalledWith({ username: 'dicoding', id: 'user-123' })
    expect(accessToken).toEqual('some_new_access_token')
  });
})
