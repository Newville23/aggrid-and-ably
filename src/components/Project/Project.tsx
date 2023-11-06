import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useSpace } from '@ably/spaces/react'
import type { ProjectInfo } from '../../Layout'
import AvatarStack from '../AvatarStack/AvatarStack'
import { colors } from '../../utils/fakeData'
import { faker } from '@faker-js/faker'
import Grid from '../Grid'
import { type UserProfileData } from '../../types/userProfileData'

const getRdmColor = () => colors[Math.floor(Math.random() * colors.length)]

const Project = () => {
  const { setProjectInfo } = useOutletContext<{
    setProjectInfo: (projectInfo: ProjectInfo) => void
  }>()

  const { space } = useSpace()

  // 💡 Project specific wiring for showing this example.
  useEffect(() => {
    setProjectInfo({
      name: 'Ably + Ag-grid',
      topic: 'ably-aggrid',
    })
  }, [])

  if (space) {
    const userProfile: UserProfileData = {
      userName: faker.name.fullName(),
      avatarColor: getRdmColor(),
    }
    space.enter(userProfile)
  }

  return (
    <div className="h-screen flex flex-col">
      <AvatarStack />
      <Grid />
    </div>
  )
}

export default Project
