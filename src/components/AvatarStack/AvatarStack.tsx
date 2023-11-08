import Avatars, { YouAvatar } from './components/Avatars'
import Surplus from './components/Surplus'

const AvatarStack = () => {
  return (
    <div className="w-screen flex justify-between px-6">
      {/** 💡 "You" avatar 💡 */}
      <YouAvatar />
      <div className="relative">
        {/** 💡 Stack of first 5 avatars.💡 */}
        <Avatars />
        {/** 💡 Dropdown list of surplus users 💡 */}
        <Surplus />
      </div>
    </div>
  )
}
export default AvatarStack
