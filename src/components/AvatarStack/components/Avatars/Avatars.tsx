import { useState } from 'react'
import { MAX_USERS_BEFORE_LIST } from '../../../../utils/constants'
import { useMembers } from '@ably/spaces/react'
import UserInfo from '../UserInfo/UserInfo'

const getUserInitials = (userName: string): string => {
  if (!userName) return '...'

  const splittedName = userName.split(' ')
  const [name, familyName] = splittedName
  return `${name.charAt(0)}${familyName.charAt(0)}`
}

const YouAvatar = () => {
  const { self: selfUser } = useMembers()
  const avatarName = selfUser?.profileData?.userName as string
  return (
    <div className="group relative flex flex-col items-center group">
      <div className="absolute top-3 opacity-80 text-white pointer-events-none">
        {avatarName ? getUserInitials(avatarName) : '...'}
      </div>
      <div
        className="bg-gradient-to-r from-cyan-500 to-blue-500
                h-12 w-12 rounded-full mb-2"
      ></div>
      <div className="absolute z-10 top-10 invisible group-hover:visible px-4 py-2 bg-black rounded-lg text-white text-center">
        You
      </div>
    </div>
  )
}

const Avatars = () => {
  const { others } = useMembers()
  const [hoveredClientId, setHoveredClientId] = useState<string | null>(null)

  return (
    <>
      {others
        .slice(0, MAX_USERS_BEFORE_LIST)
        .reverse()
        .map((anotherUser, index) => {
          const HORIZONTAL_SPACING_OFFSET = 40
          const rightOffset =
            others.length > MAX_USERS_BEFORE_LIST
              ? (index + 1) * HORIZONTAL_SPACING_OFFSET
              : index * HORIZONTAL_SPACING_OFFSET
          const { userName, avatarColor } = anotherUser.profileData as {
            userName: string
            avatarColor: string
          }
          const userColorClasses = `from-${avatarColor}-400 to-${avatarColor}-500`

          return (
            <div
              className="absolute right-0 flex flex-col items-center"
              key={anotherUser?.clientId}
              style={{
                right: rightOffset,
                zIndex: others.length - index,
              }}
            >
              <div className="absolute top-3 opacity-80 text-white stroke-white fill-transparent pointer-events-none">
                {anotherUser ? getUserInitials(userName) : '...'}
              </div>
              <div
                className={`bg-gradient-to-l ${userColorClasses} h-12 w-12 rounded-full mb-2 shadow-[0_0_0_4px_rgba(255,255,255,1)]`}
                onMouseOver={() => setHoveredClientId(anotherUser.clientId)}
                onMouseLeave={() => setHoveredClientId(null)}
              ></div>
              {anotherUser.lastEvent.name === 'leave' ? (
                <div className="absolute top-0 h-12 w-12 rounded-full mb-2 bg-white opacity-80 pointer-events-none" />
              ) : null}
              {hoveredClientId === anotherUser.clientId ? (
                <div className="absolute top-10 truncate right-8 min-w-[175px] px-4 py-2 bg-black rounded-lg text-white">
                  <UserInfo user={anotherUser} />
                </div>
              ) : null}
            </div>
          )
        })}
    </>
  )
}

export { YouAvatar }
export default Avatars
