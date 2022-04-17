const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const LogoutUserUseCase = require('../LogoutUserUseCase');

describe('LogoutUserUseCase', () => {
  it('should throw error if usecase payload not contain refresh token', async () => {
    // arrange
    const logoutUserUseCase = new LogoutUserUseCase({})

    // action & assert
    await expect(logoutUserUseCase.execute({})).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
  });

  it('should throw error if refresh token not string', async () => {
    const logoutUserUseCase = new LogoutUserUseCase({})
    const payload = {
      refreshToken: 123123
    };

    await expect(logoutUserUseCase.execute(payload)).rejects.toThrowError('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')
  });

  it('should orchestrating the delete authentication action correctly', async () => {
    const useCasePayload = {
      refreshToken: 'refresh_token_valid'
    }
    const mockAuthenticationRepository = new AuthenticationRepository()
    mockAuthenticationRepository.checkAvailabilityToken = jest.fn().mockImplementation(() => Promise.resolve())
    mockAuthenticationRepository.deleteToken = jest.fn().mockImplementation(() => Promise.resolve())
    const logoutUserUseCase = new LogoutUserUseCase({
      authenticationRepository: mockAuthenticationRepository
    });

    // action
    await logoutUserUseCase.execute(useCasePayload)

    // assert
    expect(mockAuthenticationRepository.checkAvailabilityToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
    expect(mockAuthenticationRepository.deleteToken).toHaveBeenCalledWith(useCasePayload.refreshToken)
  });
});