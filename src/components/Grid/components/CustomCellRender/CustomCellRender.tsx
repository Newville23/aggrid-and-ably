import { ICellRendererParams } from '@ag-grid-community/core'
import getOthersOnlineUsersPointer from '../../../../utils/getOnlineUsersData'

import type onlineUser from '../../../../types/onlineUser'

const CustomCellRender = (props: ICellRendererParams) => {
  const { context, rowIndex, colDef } = props
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value
  const othersOnlineUsersPointer = getOthersOnlineUsersPointer(
    context.onlineUsers,
    context.clientId
  )

  const userPointerInCell = othersOnlineUsersPointer.find(
    (user: onlineUser) =>
      rowIndex === user.data?.pointer?.rowEndIndex &&
      colDef?.field === user.data?.pointer?.columnEnd
  )
  const cellBasicClass = 'relative h-full w-full'

  const cellClass = userPointerInCell ? `border-solid border-2` : ''

  const userNameForPointer = userPointerInCell?.data.name
  return (
    <div
      className={`${cellBasicClass} ${cellClass}`}
      style={{
        borderColor: userPointerInCell ? userPointerInCell.color : 'inherit',
        paddingRight: '17px',
        paddingLeft: '17px',
      }}
    >
      {userNameForPointer && (
        <div
          className="absolute z-50 text-white -top-5 -right-0.5 leading-4 py-0.5 px-2.5 rounded-t"
          style={{ backgroundColor: userPointerInCell.color }}
        >
          {userNameForPointer}
        </div>
      )}
      <span>{cellValue}</span>
    </div>
  )
}

export default CustomCellRender
