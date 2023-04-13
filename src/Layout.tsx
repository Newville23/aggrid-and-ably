import { useEffect, useState } from 'react'
import { Outlet, useSearchParams } from 'react-router-dom'
import { nanoid } from 'nanoid'
import randomWords from 'random-words'
import { configureAbly } from '@ably-labs/react-hooks'
import InfoCard from './InfoCard'
import { Types } from 'ably'
import { SignJWT } from 'jose'
const clientId = nanoid()
let API_CONFIG: Types.ClientOptions = {
  clientId,
  key: import.meta.env.VITE_ABLY_KEY,
}

configureAbly(API_CONFIG)

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

const Layout = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'Realtime Examples',
    topic: 'realtime-examples',
  })

  const channelId =
    searchParams.get('id') || randomWords({ exactly: 3, join: '-' })

  useEffect(() => {
    if (!searchParams.get('id')) {
      setSearchParams({ id: channelId }, { replace: true })
    }
  }, [channelId])

  return (
    <main className="h-screen flex flex-col pt-2 justify-center font-sans bg-slate-50">
      <Outlet context={{ channelName: channelId, clientId, setProjectInfo }} />
      <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
        <InfoCard projectInfo={projectInfo} />
      </div>
    </main>
  )
}

export default Layout
