import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

import type { ProjectInfo } from '../../Layout'
import AvatarStack from './AvatarStack'
import { usePresence, useChannel } from '@ably-labs/react-hooks'
import { fakeNames } from './utils/fakeData'
import Grid from './Grid'

const fakeName = () => fakeNames[Math.floor(Math.random() * fakeNames.length)]

const Project = () => {
  const { channelName, clientId, setProjectInfo } = useOutletContext<{
    channelName: string
    clientId: string
    setProjectInfo: (projectInfo: ProjectInfo) => void
  }>()

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: 'Avatar Stack',
      repoNameAndPath: 'realtime-examples/tree/main/src/components/AvatarStack',
      topic: 'avatar-stack',
    })
  }, [])

  // 💡 Connect current user to Ably Presence with a random fake name
  const [presenceUsers, updatePresenceUser] = usePresence(channelName, {
    name: fakeName(),
  })

  return (
    <div className="h-screen flex flex-col">
      <AvatarStack
        channelName={channelName}
        clientId={clientId}
        presenceUsers={presenceUsers}
      />
      <Grid
        channelName={channelName}
        clientId={clientId}
        presenceUsers={presenceUsers}
        updatePresenceUser={updatePresenceUser}
      />
    </div>
  )
}

export default Project
