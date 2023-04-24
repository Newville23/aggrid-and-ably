import type { Types } from 'ably'

interface onlineUser extends Types.PresenceMessage {
  color: string
}

export default onlineUser
