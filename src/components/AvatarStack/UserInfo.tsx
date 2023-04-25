import { FunctionComponent } from 'react'
import type { Types } from 'ably'

const UserInfo: FunctionComponent<{ user: Types.PresenceMessage }> = ({
  user,
}) => {
  return (
    <>
      <p className="font-semibold">{user.data.name}</p>
      <div className="flex items-center justify-start">
        <div
          className={`${
            user.action === 'leave' ? 'bg-slate-500' : 'bg-green-500'
          } w-2 h-2 rounded-full mr-2`}
        />
        <p className="font-medium text-sm">Online now</p>
      </div>
    </>
  )
}

export default UserInfo
