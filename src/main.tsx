import ReactDOM from 'react-dom/client'
import randomWords from 'random-words'
import { useEffect } from 'react'
import { Realtime, type Types } from 'ably'
import Spaces from '@ably/spaces'
import { SpacesProvider, SpaceProvider } from '@ably/spaces/react'
import { nanoid } from 'nanoid'

import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom'
import Layout from './Layout'
import Project from './components/Project'
import './index.css'

const clientId = nanoid()
let API_CONFIG: Types.ClientOptions = {
  clientId,
  key: import.meta.env.VITE_ABLY_KEY,
}

const ably = new Realtime.Promise(API_CONFIG)
const spaces = new Spaces(ably)

const Main = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const spaceName =
    searchParams.get('id') || randomWords({ exactly: 3, join: '-' })

  useEffect(() => {
    if (!searchParams.get('id')) {
      setSearchParams({ id: spaceName }, { replace: true })
    }
  }, [spaceName])

  return (
    <SpacesProvider client={spaces}>
      <SpaceProvider name={spaceName}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Project />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SpaceProvider>
    </SpacesProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<Main />)
