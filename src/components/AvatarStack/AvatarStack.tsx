import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import type { Types } from 'ably'
import relativeTime from 'dayjs/plugin/relativeTime'
import { usePresence, useChannel } from '@ably-labs/react-hooks'

import { REMOVE_USER_AFTER_MILLIS } from './utils/constants'
import Avatars, { YouAvatar } from './Avatars'
import Surplus from './Surplus'

dayjs.extend(relativeTime)

export interface presenceUserWithColor extends Types.PresenceMessage {
  color: string
}
interface AvatarStackProps {
  channelName: string
  clientId: string
  presenceUsers: presenceUserWithColor[]
}

const AvatarStack = ({
  channelName,
  clientId,
  presenceUsers,
}: AvatarStackProps) => {
  const otherUsers = [
    ...presenceUsers.filter(
      (presenceUser) => presenceUser.clientId !== clientId
    ),
  ].filter((val, index, arr) => arr.indexOf(val) === index)

  return (
    <div className="w-screen flex justify-between px-6">
      {/** 💡 "You" avatar 💡 */}
      <YouAvatar />

      <div className="relative">
        {/** 💡 Stack of first 5 avatars.💡 */}
        <Avatars otherUsers={otherUsers} />

        {/** 💡 Dropdown list of surplus users 💡 */}
        <Surplus otherUsers={otherUsers} />
      </div>
    </div>
  )
}
export default AvatarStack
