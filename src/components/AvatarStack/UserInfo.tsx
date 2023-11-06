import { FunctionComponent } from 'react'
import type { Types } from 'ably'

const UserInfo: FunctionComponent<{ user: any }> = ({ user }) => {
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
