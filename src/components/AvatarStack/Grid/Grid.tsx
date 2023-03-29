'use strict'

import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
import '@ag-grid-community/styles/ag-grid.css'
import '@ag-grid-community/styles/ag-theme-alpine.css'
import './styles.css'
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  RangeSelectionChangedEvent,
  GridParams,
  CellClassParams,
} from '@ag-grid-community/core'
import IOlympicData from './types/IOlympicData'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection'
import { MenuModule } from '@ag-grid-enterprise/menu'
import { ClipboardModule } from '@ag-grid-enterprise/clipboard'
import { useChannel } from '@ably-labs/react-hooks'
import type { Types } from 'ably'

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  MenuModule,
  ClipboardModule,
])

const cellStyle = (params: CellClassParams, userspointer: any) => {
  let cellStyles = {}
  if (
    params.rowIndex === userspointer.rowEndIndex &&
    userspointer.columnEnd === params.colDef.field
  ) {
    cellStyles = { borderColor: 'red', borderStyle: 'dashed' }
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
  updatePresenceUser: any
}) => {
  const [channel] = useChannel(channelName, () => {})
  const [gridReadyForRanges, setgridReadyForRanges] = useState(false)
  const [dummyUsersRanges, updateDummyUsersRanges] = useState({
    columnEnd: 'country',
    columnStart: 'country',
    rowEndIndex: 9,
    rowStartIndex: 9,
  })
  const gridRef = useRef<AgGridReact<IOlympicData>>(null)

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
  const [rowData, setRowData] = useState<IOlympicData[]>()
  /*   const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      cellStyle: (params: CellClassParams) =>
        cellStyle(params, dummyUsersRanges),
      field: 'athlete',
      minWidth: 150,
    },
    {
      cellStyle: (params: CellClassParams) =>
        cellStyle(params, dummyUsersRanges),
      field: 'age',
      maxWidth: 90,
    },
    {
      cellStyle: (params: CellClassParams) =>
        cellStyle(params, dummyUsersRanges),
      field: 'country',
      minWidth: 150,
    },
    {
      cellStyle: (params: CellClassParams) =>
        cellStyle(params, dummyUsersRanges),
      field: 'year',
      maxWidth: 90,
    },
    {
      cellStyle: (params: CellClassParams) =>
        cellStyle(params, dummyUsersRanges),
      field: 'date',
      minWidth: 150,
    },
    {
      cellStyle: (params: CellClassParams) =>
        cellStyle(params, dummyUsersRanges),
      field: 'sport',
      minWidth: 150,
    },
    {
      cellStyle: (params: CellClassParams) =>
        cellStyle(params, dummyUsersRanges),
      field: 'gold',
    },
    {
      cellStyle: (params: CellClassParams) =>
        cellStyle(params, dummyUsersRanges),
      field: 'silver',
    },
    {
      cellStyle: (params: CellClassParams) =>
        cellStyle(params, dummyUsersRanges),
      field: 'bronze',
    },
    {
      cellStyle: (params: CellClassParams) =>
        cellStyle(params, dummyUsersRanges),
      field: 'total',
    },
  ]) */

  const columnDefs = useMemo<ColDef[]>(() => {
    return [
      {
        cellStyle: (params: CellClassParams) =>
          cellStyle(params, dummyUsersRanges),
        field: 'athlete',
        minWidth: 150,
      },
      {
        cellStyle: (params: CellClassParams) =>
          cellStyle(params, dummyUsersRanges),
        field: 'age',
        maxWidth: 90,
      },
      {
        cellStyle: (params: CellClassParams) =>
          cellStyle(params, dummyUsersRanges),
        field: 'country',
        minWidth: 150,
      },
      {
        cellStyle: (params: CellClassParams) =>
          cellStyle(params, dummyUsersRanges),
        field: 'year',
        maxWidth: 90,
      },
      {
        cellStyle: (params: CellClassParams) =>
          cellStyle(params, dummyUsersRanges),
        field: 'date',
        minWidth: 150,
      },
      {
        cellStyle: (params: CellClassParams) =>
          cellStyle(params, dummyUsersRanges),
        field: 'sport',
        minWidth: 150,
      },
      {
        cellStyle: (params: CellClassParams) =>
          cellStyle(params, dummyUsersRanges),
        field: 'gold',
      },
      {
        cellStyle: (params: CellClassParams) =>
          cellStyle(params, dummyUsersRanges),
        field: 'silver',
      },
      {
        cellStyle: (params: CellClassParams) =>
          cellStyle(params, dummyUsersRanges),
        field: 'bronze',
      },
      {
        cellStyle: (params: CellClassParams) =>
          cellStyle(params, dummyUsersRanges),
        field: 'total',
      },
    ]
  }, [])
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    }
  }, [])

  useEffect(() => {
    // gridRef.current!.api.clearRangeSelection();
    if (presenceUsers.length >= 1) {
      const othersOnlineUsers =
        presenceUsers.filter(
          (resultItem) =>
            resultItem.action === 'present' && resultItem.clientId !== clientId
        ) || []

      if (othersOnlineUsers?.length >= 1) {
        othersOnlineUsers.forEach((user) => {
          const { pointer: userLatestRange } = user.data

          /*           const userLatestRange ={
            rowStartIndex: 4,
            rowEndIndex: 8,
            columnStart: 'age',
            columnEnd: 'date',
          } */
          if (userLatestRange) {
            gridRef.current!.api.addCellRange(userLatestRange)
          }
        })
      }
    }
  }, [gridReadyForRanges, presenceUsers])

  const onRangeSelectionChanged = useCallback(
    (event: RangeSelectionChangedEvent) => {
      if (event.finished && event.started) {
        const cellRanges = gridRef.current!.api.getCellRanges() || []
        if (cellRanges?.length > 0) {
          const lastRange = cellRanges[cellRanges?.length - 1]
          const { endRow, startRow, columns } = lastRange
          const pointer = {
            rowStartIndex: startRow?.rowIndex,
            rowEndIndex: endRow?.rowIndex,
            columnStart: columns[0].getColId(),
            columnEnd: columns[columns.length - 1].getColId(),
          }
          const currentUserPresence = presenceUsers.find(
            (presenceUser) => presenceUser.clientId === clientId
          )
          console.log({
            action: 'updatePresenceUser',
            payload: { ...currentUserPresence?.data, pointer: pointer },
          })
          // updatePresenceUser({ ...currentUserPresence?.data, pointer: pointer })
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
        setgridReadyForRanges(true)
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
