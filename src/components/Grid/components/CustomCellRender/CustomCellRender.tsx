import { ICellRendererParams } from '@ag-grid-community/core'
import getOthersOnlineUsersPointer from '../../../../utils/getOnlineUsersData'

const CustomCellRender = (props: ICellRendererParams) => {
  const { context, rowIndex, colDef } = props
  const cellValue = props.valueFormatted ? props.valueFormatted : props.value
  const othersOnlineUsersPointer = getOthersOnlineUsersPointer(
    context.presenceUsers,
    context.clientId
  )

  const userPointerInCell = othersOnlineUsersPointer.find(
    (user: any) =>
      rowIndex === user.data?.pointer?.rowEndIndex &&
      colDef?.field === user.data?.pointer?.columnEnd
  )
  const cellBasicClass = 'relative h-full w-full'

  const cellClass = userPointerInCell ? `border-dashed border-2` : ''

  return (
    <div
      className={`${cellBasicClass} ${cellClass}`}
      style={{
        borderColor: userPointerInCell ? userPointerInCell.color : 'inherit',
        left: '-18px',
        paddingLeft: '18px',
      }}
    >
      <span>{cellValue}</span>
    </div>
  )
}

export default CustomCellRender
