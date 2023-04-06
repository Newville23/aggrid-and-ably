import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import type { ProjectInfo } from '../../Layout'
import AvatarStack from './AvatarStack'
import { usePresence, useChannel } from '@ably-labs/react-hooks'
import { fakeNames, colors } from './utils/fakeData'
import Grid from './Grid'
import type { Types } from 'ably'

const fakeName = () => fakeNames[Math.floor(Math.random() * fakeNames.length)]
const getRdmColor = () => colors[Math.floor(Math.random() * colors.length)]

const Project = () => {
  const { channelName, clientId, setProjectInfo } = useOutletContext<{
    channelName: string
    clientId: string
    setProjectInfo: (projectInfo: ProjectInfo) => void
  }>()

  // 💡 Connect current user to Ably Presence with a random fake name
  const [presenceUsers, updatePresenceUser] = usePresence(channelName, {
    name: fakeName(),
  })

  const [channel] = useChannel(channelName, () => {})
  const [usersAvatar, setUsersAvatar] = useState<any[]>([])

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: 'Avatar Stack',
      repoNameAndPath: 'realtime-examples/tree/main/src/components/AvatarStack',
      topic: 'avatar-stack',
    })
  }, [])

  useEffect(() => {
    if (presenceUsers.length >= 1) {
      const onlineUsers = presenceUsers.filter(
        (resultItem: Types.PresenceMessage) => resultItem.action === 'present'
      )

      const updatedUsersAvatar = onlineUsers.map(
        (userItem: Types.PresenceMessage) => {
          const currentUserAvatar = usersAvatar.find(
            (userAvatar) => userAvatar.clientId === userItem.clientId
          )
          if (currentUserAvatar) {
            return { ...userItem, color: currentUserAvatar.color }
          }

          if (userItem.clientId === clientId) {
            return { ...userItem, color: 'blue' }
          }

          return { ...userItem, color: getRdmColor() }
        }
      )
      setUsersAvatar(updatedUsersAvatar)
    }
  }, [presenceUsers])

  return (
    <div className="h-screen flex flex-col">
      <AvatarStack
        channelName={channelName}
        clientId={clientId}
        presenceUsers={usersAvatar}
      />
      <Grid
        channelName={channelName}
        clientId={clientId}
        presenceUsers={usersAvatar}
        updatePresenceUser={updatePresenceUser}
      />
    </div>
  )
}

export default Project
