'use client';

import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Transaction } from '@paddle/paddle-node-sdk';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  hasMore?: boolean;
  totalRecords?: number;
  goToNextPage: (cursor: string) => void;
  goToPrevPage: () => void;
  hasPrev: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalRecords,
  hasMore,
  goToNextPage,
  goToPrevPage,
  hasPrev,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalRecords ? Math.ceil(totalRecords / data.length) : 1,
    rowCount: data.length,
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-md border bg-background relative">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{
                      minWidth: header.column.columnDef.size,
                      maxWidth: header.column.columnDef.size,
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{
                      minWidth: cell.column.columnDef.size,
                      maxWidth: cell.column.columnDef.size,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 px-6 py-4">
        <Button
          size={'sm'}
          variant={'outline'}
          className={'flex gap-2 text-sm rounded-sm border-border'}
          onClick={() => goToPrevPage()}
          disabled={!hasPrev}
        >
          Previous
        </Button>
        <Button
          size={'sm'}
          variant={'outline'}
          className={'flex gap-2 text-sm rounded-sm border-border'}
          onClick={() => goToNextPage((data[data.length - 1] as Transaction).id)}
          disabled={!hasMore}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
