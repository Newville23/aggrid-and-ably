import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import InfoCard from './InfoCard'
import { SignJWT } from 'jose'

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
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>({
    name: 'Realtime Examples',
    topic: 'realtime-examples',
  })

  return (
    <main className="h-screen flex flex-col pt-2 justify-center font-sans bg-slate-50">
      <Outlet context={{ setProjectInfo }} />
      <div className="fixed bottom-0 md:absolute md:left-12 md:bottom-12">
        <InfoCard projectInfo={projectInfo} />
      </div>
    </main>
  )
}

export default Layout
