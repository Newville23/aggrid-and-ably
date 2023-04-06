import type { Types } from 'ably'

const getOthersOnlineUsersPointer = (presenceUsers: any, clientId: string) => {
  if (presenceUsers.length > 1) {
    return (
      presenceUsers.filter(
        (resultItem: Types.PresenceMessage) =>
          resultItem.action === 'present' &&
          resultItem.clientId !== clientId &&
          resultItem.data.pointer
      ) || []
    )
  }
  return []
}

export default getOthersOnlineUsersPointer
