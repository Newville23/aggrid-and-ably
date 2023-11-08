import { type SpaceMember } from '@ably/spaces'

export type UserProfileData = Record<string, string>
export interface UserLocation {
  component: string
  rowStartIndex: number | undefined
  rowEndIndex: number | undefined
  columnStart: string
  columnEnd: string
}

export interface SpaceUser extends SpaceMember {
  profileData: UserProfileData
  location: UserLocation | null
}
