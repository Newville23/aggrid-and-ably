import { ABLY_PRESENT_USER_STATUS } from './constants'
import type { Types } from 'ably'
import type onlineUser from '../types/onlineUser'

const getOthersOnlineUsersPointer = (users: onlineUser[], clientId: string) => {
  if (users.length > 1) {
    return (
      users.filter(
        (resultItem: Types.PresenceMessage) =>
          resultItem.action === ABLY_PRESENT_USER_STATUS &&
          resultItem.clientId !== clientId &&
          resultItem.data.pointer
      ) || []
    )
  }
  return []
}

export default getOthersOnlineUsersPointer
