import { useInterpret } from '@xstate/react'
import { coinMachine } from '../machines/coinMachine'
import '../styles/globals.css'
import { GlobalStateContext } from '../utils'

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page)
  const coinService = useInterpret(coinMachine)

  return getLayout(
    <GlobalStateContext.Provider value={{ coinService }}>
      <Component {...pageProps} />
    </GlobalStateContext.Provider>
  )
}

export default MyApp
