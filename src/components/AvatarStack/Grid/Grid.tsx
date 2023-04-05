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
import CustomCellRender from './components/CustomCellRender'
import getOthersOnlineUsersPointer from '../utils/getOnlineUsersData'

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RangeSelectionModule,
  MenuModule,
  ClipboardModule,
])

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
  const gridRef = useRef<AgGridReact<IOlympicData>>(null)

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), [])
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
  const [rowData, setRowData] = useState<IOlympicData[]>()

  useEffect(() => {
    const otherUsersPointer = getOthersOnlineUsersPointer(
      presenceUsers,
      clientId
    )

    if (otherUsersPointer.length >= 1) {
      var params = {
        force: true,
        suppressFlash: true,
      }
      gridRef.current!.api.refreshCells(params)
    }
  }, [presenceUsers])

  const getColumnDef = () => {
    return [
      {
        field: 'athlete',
        minWidth: 150,
        cellRenderer: CustomCellRender,
      },
      {
        field: 'age',
        maxWidth: 90,
        cellRenderer: CustomCellRender,
      },
      {
        field: 'country',
        minWidth: 150,
        cellRenderer: CustomCellRender,
      },
      {
        field: 'year',
        maxWidth: 90,
        cellRenderer: CustomCellRender,
      },
      {
        field: 'date',
        minWidth: 150,
        cellRenderer: CustomCellRender,
      },
      {
        field: 'sport',
        minWidth: 150,
        cellRenderer: CustomCellRender,
      },
      {
        field: 'gold',
        cellRenderer: CustomCellRender,
      },
      {
        field: 'silver',
        cellRenderer: CustomCellRender,
      },
      {
        field: 'bronze',
        cellRenderer: CustomCellRender,
      },
      {
        field: 'total',
        cellRenderer: CustomCellRender,
      },
    ]
  }

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
          updatePresenceUser({ ...currentUserPresence?.data, pointer: pointer })
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
          columnDefs={getColumnDef()}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          onGridReady={onGridReady}
          onRangeSelectionChanged={onRangeSelectionChanged}
          context={{ presenceUsers, clientId }}
        ></AgGridReact>
      </div>
    </div>
  )
}

export default Grid
