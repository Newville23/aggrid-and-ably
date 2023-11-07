import { type ReactElement, useEffect, useState } from 'react'
import { Realtime, type Types } from 'ably'
import Spaces from '@ably/spaces'
import { SpacesProvider, SpaceProvider } from '@ably/spaces/react'
import { Outlet, useSearchParams } from 'react-router-dom'
import InfoCard from './InfoCard'
import { SignJWT } from 'jose'
import randomWords from 'random-words'
import { nanoid } from 'nanoid'

async function CreateJWT(
  clientId: string,
  apiKey: string,
  claim: string
): Promise<string> {
  const [appId, signingKey] = apiKey.split(':', 2)
  const enc = new TextEncoder()
  return new SignJWT({
    'x-ably-capabilities': `{"*":["*"]}`,
    'x-ably-clientId': clientId,
    'ably.channel.*': claim,
  })
    .setProtectedHeader({ kid: appId, alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(enc.encode(signingKey))
}

export type ProjectInfo = {
  name: string
  topic: string
}

const clientId = nanoid()
let API_CONFIG: Types.ClientOptions = {
  clientId,
  key: import.meta.env.VITE_ABLY_KEY,
}

const ably = new Realtime.Promise(API_CONFIG)
const spaces = new Spaces(ably)

const AblySpaceProvider = ({ children }: { children: ReactElement }) => {
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
      <SpaceProvider name={spaceName}>{children}</SpaceProvider>
    </SpacesProvider>
  )
}

const Layout = () => {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'Realtime Examples',
    topic: 'realtime-examples',
  })

  return (
    <AblySpaceProvider>
      <main className="h-screen flex flex-col pt-2 justify-center font-sans bg-slate-50">
        <Outlet context={{ setProjectInfo }} />
        <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
          <InfoCard projectInfo={projectInfo} />
        </div>
      </main>
    </AblySpaceProvider>
  )
}

export default Layout
