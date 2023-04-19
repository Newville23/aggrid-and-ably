import dayjs from 'dayjs'
import type { Types } from 'ably'
import relativeTime from 'dayjs/plugin/relativeTime'
import Avatars, { YouAvatar } from './Avatars'
import Surplus from './Surplus'

dayjs.extend(relativeTime)

export interface presenceUserWithColor extends Types.PresenceMessage {
  color: string
}
interface AvatarStackProps {
  clientId: string
  presenceUsers: presenceUserWithColor[]
}

const AvatarStack = ({ clientId, presenceUsers }: AvatarStackProps) => {
  const otherUsers = [
    ...presenceUsers.filter(
      (presenceUser) => presenceUser.clientId !== clientId
    ),
  ].filter((val, index, arr) => arr.indexOf(val) === index)

  const currentUser = presenceUsers.find(
    (presenceUser) => presenceUser.clientId === clientId
  )

  return (
    <div className="w-screen flex justify-between px-6">
      {/** 💡 "You" avatar 💡 */}
      <YouAvatar currentUser={currentUser} />

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
