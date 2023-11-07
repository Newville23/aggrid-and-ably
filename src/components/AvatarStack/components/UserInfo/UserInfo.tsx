import { FunctionComponent, ReactNode } from 'react'
import { type SpaceUser } from '../../../../types/SpaceUser'

interface UserInfoProps {
  user: SpaceUser
}

const UserInfo: FunctionComponent<UserInfoProps> = ({ user }) => {
  const { profileData, lastEvent } = user
  return (
    <>
      {profileData && <p className="font-semibold">{profileData.userName}</p>}
      <div className="flex items-center justify-start">
        <div
          className={`${
            lastEvent.name === 'leave' ? 'bg-slate-500' : 'bg-green-500'
          } w-2 h-2 rounded-full mr-2`}
        />
        <p className="font-medium text-sm">
          {lastEvent?.name === 'leave' ? 'Offline' : 'Online now'}
        </p>
      </div>
    </>
  )
}

export default UserInfo
