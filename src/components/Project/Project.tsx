import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useSpace } from '@ably/spaces/react'
import type { ProjectInfo } from '../../Layout'
import AvatarStack from '../AvatarStack/AvatarStack'
import { usePresence, useChannel } from '@ably-labs/react-hooks'
import { colors } from '../../utils/fakeData'
import { faker } from '@faker-js/faker'
import Grid from '../Grid'
import { ABLY_PRESENT_USER_STATUS } from '../../utils/constants'
import type { Types } from 'ably'
import type onlineUser from '../../types/onlineUser'

const getRdmColor = () => colors[Math.floor(Math.random() * colors.length)]

const Project = () => {
  const { setProjectInfo } = useOutletContext<{
    setProjectInfo: (projectInfo: ProjectInfo) => void
  }>()

  const { space } = useSpace((update) => {
    console.log(update)
  })

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: 'Ably + Ag-grid',
      topic: 'ably-aggrid',
    })
  }, [])

  if (space) {
    space.enter({ userName: faker.name.fullName(), avatarColor: getRdmColor() })
  }

  /*   // 💡 Connect current user to Ably Presence with a random fake name
  const [presenceUsers, updatePresenceUser] = usePresence(channelName, {
    name: faker.name.fullName(),
  })

  const [channel] = useChannel(channelName, () => {})
  const [onlineUsers, setOnlineUsers] = useState<onlineUser[]>([])


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
  }, [presenceUsers]) */

  return (
    <div className="h-screen flex flex-col">
      <AvatarStack />
      {/*     <Grid
        clientId={clientId}
        onlineUsers={onlineUsers}
        updatePresenceUser={updatePresenceUser}
      /> */}
    </div>
  )
}

export default Project
