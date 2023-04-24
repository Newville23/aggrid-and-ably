import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import type { ProjectInfo } from '../../Layout'
import AvatarStack from '../AvatarStack/AvatarStack'
import { usePresence, useChannel } from '@ably-labs/react-hooks'
import { fakeNames, colors } from '../../utils/fakeData'
import Grid from '../Grid'
import { ABLY_PRESENT_USER_STATUS } from '../../utils/constants'
import type { Types } from 'ably'
import type onlineUser from '../../types/onlineUser'

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
  const [onlineUsers, setOnlineUsers] = useState<onlineUser[]>([])

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: 'Ably + Ag-grid',
      topic: 'ably-aggrid',
    })
  }, [])

  useEffect(() => {
    if (presenceUsers.length >= 1) {
      const latestOnlineUsers = presenceUsers.filter(
        (resultItem: Types.PresenceMessage) =>
          resultItem.action === ABLY_PRESENT_USER_STATUS
      )

      const updatedOnlineUsers = latestOnlineUsers.map(
        (userItem: Types.PresenceMessage) => {
          const currentUserAvatar = onlineUsers.find(
            (onlineUser) => onlineUser.clientId === userItem.clientId
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
      setOnlineUsers(updatedOnlineUsers)
    }
  }, [presenceUsers])

  return (
    <div className="h-screen flex flex-col">
      <AvatarStack clientId={clientId} onlineUsers={onlineUsers} />
      <Grid
        clientId={clientId}
        onlineUsers={onlineUsers}
        updatePresenceUser={updatePresenceUser}
      />
    </div>
  )
}

export default Project
