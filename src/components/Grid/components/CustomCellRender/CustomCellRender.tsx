import { ICellRendererParams } from '@ag-grid-community/core'
import { useMembers } from '@ably/spaces/react'
import { UserLocation } from '../../../../types/SpaceUser'

const CustomCellRender = (props: ICellRendererParams) => {
  const { others } = useMembers()
  const { rowIndex, colDef } = props

  const cellValue = props.valueFormatted ? props.valueFormatted : props.value
  const otherUsersWithLocation = others.filter(
    (anotherUser) => anotherUser.isConnected && anotherUser.location
  )

  const otherUserLocation = otherUsersWithLocation.find((user) => {
    const { rowEndIndex: userRowEndIndex, columnEnd: userColumnEnd } =
      user.location as UserLocation
    return rowIndex === userRowEndIndex && colDef?.field === userColumnEnd
  })

  const cellBasicClass = 'relative h-full w-full'
  const cellClass = otherUserLocation ? `border-solid border-2` : ''
  let userName = '...'
  let cellColor = 'inherit'

  if (otherUserLocation && otherUserLocation.profileData) {
    userName = otherUserLocation.profileData.userName as string
    cellColor = otherUserLocation.profileData.avatarColor as string
  }

  const userNameForPointer = userPointerInCell?.data.name
  return (
    <div
      className={`${cellBasicClass} ${cellClass}`}
      style={{
        borderColor: cellColor,
        paddingRight: '17px',
        paddingLeft: '17px',
      }}
    >
      {otherUserLocation && (
        <div
          className="absolute z-50 text-white -top-5 -right-0.5 leading-4 py-0.5 px-2.5 rounded-t"
          style={{ backgroundColor: cellColor }}
        >
          {userName}
        </div>
      )}
      <span>{cellValue}</span>
    </div>
  )
}

export default CustomCellRender
