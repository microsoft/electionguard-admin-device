import React, { useState, useContext } from 'react'
import { Route, Switch } from 'react-router-dom'
import SetupTrusteesPage from './SetupTrusteesPage'
import KeyDistributionPage from './KeyDistributionPage'
import InsertCardScreen from './InsertCardScreen'
import SaveCardScreen from './SaveCardScreen'
import RemoveCardScreen from './RemoveCardScreen'
import SetupEncryptersPage from './SetupEncryptersPage'
import EncrypterDistributionPage from './EncrypterDistributionPage'
import InsertDriveScreen from './InsertDriveScreen'
import SaveDriveScreen from './SaveDriveScreen'
import RemoveDriveScreen from './RemoveDriveScreen'
import ElectionReadyPage from './ElectionReadyPage'
import NotFoundPage from '../NotFoundPage'
import CeremonyContext from '../../contexts/ceremonyContext'
import {
  TrusteeKeyVault,
  EncrypterStore,
  CompletionStatus,
  TrusteeKey,
  ElectionGuardConfig,
} from '../../config/types'
import AdminContext from '../../contexts/adminContext'
import * as electionUtils from '../../utils/election'

const CeremonyLayout = () => {
  const { setElectionMap } = useContext(AdminContext)
  const { setElectionGuardConfig, election } = useContext(AdminContext)
  const [numberOfTrustees, setNumberOfTrustees] = useState(
    (undefined as unknown) as number
  )
  const [threshold, setThreshold] = useState((undefined as unknown) as number)
  const [numberOfEncrypters, setNumberOfEncrypters] = useState(
    (undefined as unknown) as number
  )
  const [keyVault, setKeyVault] = useState({} as TrusteeKeyVault)
  const [encrypterStore, setEncrypterStore] = useState({} as EncrypterStore)

  const claimTrusteeKey = (trusteeId: string) => {
    setKeyVault({
      ...keyVault,
      [trusteeId]: {
        ...keyVault[trusteeId],
        status: CompletionStatus.Complete,
      },
    })
  }

  const claimEncrypterDrive = (encrypterId: string) => {
    setEncrypterStore({
      ...encrypterStore,
      [encrypterId]: {
        ...encrypterStore[encrypterId],
        status: CompletionStatus.Complete,
      },
    })
  }

  const createElection = async () => {
    try {
      const {
        electionGuardConfig,
        electionMap,
        trusteeKeys,
      } = await electionUtils.createElection({
        election,
        electionGuardConfig: {
          threshold,
          numberOfTrustees,
          electionMetadata: '',
        } as ElectionGuardConfig,
      })
      const updatedTrusteeKeys = {} as TrusteeKeyVault
      Object.keys(trusteeKeys).forEach(keyId => {
        const keyValue = trusteeKeys[keyId]
        updatedTrusteeKeys[keyId] = {
          id: keyId,
          data: keyValue,
          status: CompletionStatus.Incomplete,
        } as TrusteeKey
      })

      setKeyVault(updatedTrusteeKeys)
      setElectionMap(electionMap)
      setElectionGuardConfig(electionGuardConfig)
    } catch (error) {
      // eslint-disable-next-line no-empty
    }
  }

  return (
    <CeremonyContext.Provider
      value={{
        numberOfTrustees,
        setNumberOfTrustees,
        threshold,
        setThreshold,
        numberOfEncrypters,
        setNumberOfEncrypters,
        keyVault,
        setKeyVault,
        claimTrusteeKey,
        encrypterStore,
        setEncrypterStore,
        claimEncrypterDrive,
        createElection,
      }}
    >
      <Switch>
        <Route path="/setup-keys" exact component={SetupTrusteesPage} />
        <Route path="/keys" exact component={KeyDistributionPage} />
        <Route path="/keys/:trusteeId" component={InsertCardScreen} />
        <Route path="/key/save" exact component={SaveCardScreen} />
        <Route path="/key/remove" exact component={RemoveCardScreen} />
        <Route path="/setup-encrypters" exact component={SetupEncryptersPage} />
        <Route path="/encrypters" exact component={EncrypterDistributionPage} />
        <Route
          path="/encrypters/:encrypterId"
          exact
          component={InsertDriveScreen}
        />
        <Route path="/encrypter/save" exact component={SaveDriveScreen} />
        <Route path="/encrypter/remove" exact component={RemoveDriveScreen} />
        <Route path="/ready" exact component={ElectionReadyPage} />
        <Route path="/:path" component={NotFoundPage} />
      </Switch>
    </CeremonyContext.Provider>
  )
}

export default CeremonyLayout