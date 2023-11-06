import Avatars, { YouAvatar } from './Avatars'
import Surplus from './Surplus'
import type onlineUser from '../../types/onlineUser'
import { useMembers } from '@ably/spaces/react'

const AvatarStack = () => {
  const { self, others } = useMembers()
  return (
    <div className="w-screen flex justify-between px-6">
      {/** 💡 "You" avatar 💡 */}
      <YouAvatar selfUser={self} />

      <div className="relative">
        {/** 💡 Stack of first 5 avatars.💡 */}
        <Avatars otherUsers={others} />

        {/** 💡 Dropdown list of surplus users 💡 */}
        <Surplus otherUsers={others} />
      </div>
    </div>
  )
}
export default AvatarStack
