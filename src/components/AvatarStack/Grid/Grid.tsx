'use strict'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'
import './styles.css'
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  RangeSelectionChangedEvent,
  CellClassParams,
} from '@ag-grid-community/core'
import IOlympicData from './types/IOlympicData'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection'
import { MenuModule } from '@ag-grid-enterprise/menu'
import { ClipboardModule } from '@ag-grid-enterprise/clipboard'
import { useChannel } from '@ably-labs/react-hooks'
import type { Types } from 'ably'

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  MenuModule,
  ClipboardModule,
])

const cellStyle = (
  params: CellClassParams,
  presenceUsers: Types.PresenceMessage[],
  clientId: string
) => {
  let cellStyles = {}
  if (presenceUsers.length > 1) {
    const othersUsersWithCursor =
      presenceUsers.filter(
        (user) =>
          user.action === 'present' &&
          user.clientId !== clientId &&
          user.data.cursor
      ) || []

    if (othersUsersWithCursor.length >= 1) {
      const cursorCell = othersUsersWithCursor.find(({ data }) => {
        const { cursor } = data
        const { colDef, rowIndex } = params

        return (
          rowIndex === cursor.rowEndIndex && cursor.columnEnd === colDef.field
        )
      })

      if (cursorCell) {
        cellStyles = { borderColor: 'red', borderStyle: 'dashed' }
      }
    }
  }

  return cellStyles
}

const Grid = ({
  channelName,
  clientId,
  presenceUsers,
  updatePresenceUser,
}: {
  channelName: string
  clientId: string
  presenceUsers: Types.PresenceMessage[]
  updatePresenceUser: (messageOrPresenceObject: any) => void
}) => {
  const [channel] = useChannel(channelName, () => {})
  const gridRef = useRef<AgGridReact<IOlympicData>>(null)

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
  const [rowData, setRowData] = useState<IOlympicData[]>()

  const columnDefs = useMemo<ColDef[]>(() => {
    const cellStyleCb = (params: CellClassParams) =>
      cellStyle(params, presenceUsers, clientId)
    return [
      {
        cellStyle: cellStyleCb,
        field: 'athlete',
        minWidth: 150,
      },
      {
        cellStyle: cellStyleCb,
        field: 'age',
        maxWidth: 90,
      },
      {
        cellStyle: cellStyleCb,
        field: 'country',
        minWidth: 150,
      },
      {
        cellStyle: cellStyleCb,
        field: 'year',
        maxWidth: 90,
      },
      {
        cellStyle: cellStyleCb,
        field: 'date',
        minWidth: 150,
      },
      {
        cellStyle: cellStyleCb,
        field: 'sport',
        minWidth: 150,
      },
      {
        cellStyle: cellStyleCb,
        field: 'gold',
      },
      {
        cellStyle: cellStyleCb,
        field: 'silver',
      },
      {
        cellStyle: cellStyleCb,
        field: 'bronze',
      },
      {
        cellStyle: cellStyleCb,
        field: 'total',
      },
    ]
  }, [presenceUsers])

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    }
  }, [])

  const onRangeSelectionChanged = useCallback(
    (event: RangeSelectionChangedEvent) => {
      if (event.finished && event.started) {
        const cellRanges = gridRef.current!.api.getCellRanges() || []
        if (cellRanges?.length > 0) {
          const lastRange = cellRanges[cellRanges?.length - 1]
          const { endRow, startRow, columns } = lastRange
          const cursor = {
            rowStartIndex: startRow?.rowIndex,
            rowEndIndex: endRow?.rowIndex,
            columnStart: columns[0].getColId(),
            columnEnd: columns[columns.length - 1].getColId(),
          }
          const currentUserPresence = presenceUsers.find(
            (presenceUser) => presenceUser.clientId === clientId
          )

          updatePresenceUser({ ...currentUserPresence?.data, cursor: cursor })
        }
      }
    },
    []
  )

  const onGridReady = useCallback((params: GridReadyEvent) => {
    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
      .then((resp) => resp.json())
      .then((data: IOlympicData[]) => {
        setRowData(data)
      })
  }, [])

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact<IOlympicData>
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          onGridReady={onGridReady}
          onRangeSelectionChanged={onRangeSelectionChanged}
        ></AgGridReact>
      </div>
    </div>
  )
}

export default Grid
