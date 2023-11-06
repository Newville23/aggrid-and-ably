import { FunctionComponent } from 'react'
import { type SpaceMember } from '@ably/spaces'

const UserInfo: FunctionComponent<{ user: SpaceMember }> = ({ user }) => {
  const { profileData, lastEvent } = user
  return (
    <>
      <p className="font-semibold">{profileData.userName}</p>
      <div className="flex items-center justify-start">
        <div
          className={`${
            lastEvent.name === 'leave' ? 'bg-slate-500' : 'bg-green-500'
          } w-2 h-2 rounded-full mr-2`}
        />
        <p className="font-medium text-sm">Online now</p>
      </div>
    </>
  )
}

export default UserInfo
