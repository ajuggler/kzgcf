import ROUTES from '../routes'
import { useState } from 'react'
import styled from 'styled-components'
import ErrorMessage from '../components/Error'
import { PrimaryButton, ButtonWithLinkOut } from '../components/Button'
import { Description, PageTitle } from '../components/Text'
import {
  SingleContainer as Container,
  SingleWrap as Wrap,
  SingleButtonSection,
  TextSection,
  Over
} from '../components/Layout'
import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router-dom'
import { ErrorRes, RequestLinkRes } from '../types'
import { Trans, useTranslation } from 'react-i18next'
import HeaderJustGoingBack from '../components/headers/HeaderJustGoingBack'
import api from '../api'
import LoadingSpinner from '../components/LoadingSpinner'

const SigninPage = () => {
  useTranslation()
  const navigate = useNavigate()
  const { error } = useAuthStore()
  const [showError, setShowError] = useState(error)
  const [isLoading, setIsLoading] = useState(false)


  const onSigninGithub = async () => {
    setIsLoading(true)
    const requestLinks = await api.getRequestLink()
    const code = (requestLinks as ErrorRes).code
    switch (code) {
      case undefined:
        window.location.replace((requestLinks as RequestLinkRes).github_auth_url)
        break
      case 'AuthErrorPayload::LobbyIsFull':
        navigate(ROUTES.LOBBY_FULL)
        return
      default:
        setShowError(JSON.stringify(requestLinks))
        break
    }
    setIsLoading(false)
  }

  return (
    <>
      <HeaderJustGoingBack />
      <Over>
        <Container>
          <Wrap>
            <PageTitle>
              <Trans i18nKey="signin.title">
                OPEN <br /> THE WAY
              </Trans>
            </PageTitle>
            <TextSection>
              {showError && <ErrorMessage>{showError}</ErrorMessage>}
              <Trans i18nKey="signin.description">
                <Description>
                  The Ceremony requires souls of pure intent. Summoners show
                  their integrity by unlocking with an address that has sent at least
                  three transactions before Jan. 13, 2023 (block number 16,394,155). Each address can only be used to contribute once.
                </Description>
                <Description>
                  Choosing Ethereum does not send any funds or permit any contracts.
                  This method will let you claim a POAP after the Ceremony has concluded.
                </Description>
              </Trans>
            </TextSection>

          <ButtonSection>
            {isLoading ?
              <LoadingSpinner></LoadingSpinner>
              :
              <>
              <ButtonWithLinkOut onClick={onSigninGithub} style={{ width: '280px' }} disabled={isLoading}>
                <Trans i18nKey="signin.unlockWithGithub">
                  or unlock with Github
                </Trans>
              </ButtonWithLinkOut>
              </>
            }
          </ButtonSection>
        </Wrap>
      </Container>
      </Over>
    </>
  )
}



export const ButtonSection = styled(SingleButtonSection)`
  max-height: 100px;
  margin-top: 10px;
`

export default SigninPage
