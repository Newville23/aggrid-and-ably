import Avatars, { YouAvatar } from './Avatars'
import Surplus from './Surplus'
import type onlineUser from '../../types/onlineUser'

interface AvatarStackProps {
  clientId: string
  onlineUsers: onlineUser[]
}

const AvatarStack = ({ clientId, onlineUsers }: AvatarStackProps) => {
  const otherUsers = [
    ...onlineUsers.filter((onlineUser) => onlineUser.clientId !== clientId),
  ].filter((val, index, arr) => arr.indexOf(val) === index)

  const currentUser = onlineUsers.find(
    (onlineUser) => onlineUser.clientId === clientId
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
