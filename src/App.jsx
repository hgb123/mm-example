import { useState, useEffect } from 'react'

import chains from './chains.json'

const chainIdNameMap = new Map(
  chains.map(({ name, chainId }) => [chainId, name])
)

function App() {
  const [metamaskInstalled, setMetamaskInstalled] = useState(null)
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState('')

  const handleAccountsChanged = (accounts) => {
    setAccount(accounts[0])
  }

  const handleChainChanged = (chainId) => {
    setChainId(parseInt(chainId, 16))
  }

  useEffect(() => {
    const metamaskInstalled = typeof window.ethereum !== 'undefined'

    setMetamaskInstalled(metamaskInstalled)

    if (!metamaskInstalled) return

    window.ethereum
      .request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)

    window.ethereum.request({ method: 'eth_chainId' }).then(handleChainChanged)

    window.ethereum.on('accountsChanged', handleAccountsChanged)

    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [])

  const handleConnect = () => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  return (
    <div>
      <button onClick={handleConnect} disabled={!metamaskInstalled || account}>
        {!metamaskInstalled
          ? 'Please install Metamask'
          : !account
          ? 'Connect Metamask'
          : 'Connected'}
      </button>

      <p>Account: {account}</p>
      <p>Network: {chainIdNameMap.get(chainId)}</p>
    </div>
  )
}

export default App
