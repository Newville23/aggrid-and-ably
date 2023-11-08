import type { Types } from 'ably'

interface OnlineUser extends Types.PresenceMessage {
  color: string
}

export default OnlineUser
