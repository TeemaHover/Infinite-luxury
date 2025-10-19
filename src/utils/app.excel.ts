import ExcelJS from 'exceljs/dist/es5';
import { Writable } from 'stream';
import * as fs from 'fs/promises';

export class AppExcel {
    getExcelBuilder(sheetName: string, outputPathOrStream: string | Writable) {
        const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
            filename:
                typeof outputPathOrStream === 'string'
                    ? outputPathOrStream
                    : undefined,
            stream:
                typeof outputPathOrStream !== 'string'
                    ? outputPathOrStream
                    : undefined,
            useStyles: true,
            useSharedStrings: true,
        });

        const ws = wb.addWorksheet(sheetName);

        const defaultStyle = {
            font: { color: { argb: 'FF000000' }, size: 12 },
            numFmt: '#,##0.00; ($#,##0.00); -',
        };

        return { wb, ws, defaultStyle };
    }

    async render(rows: any[][], sheetName = 'Sheet 1'): Promise<Buffer> {
        const fileName = `temp_${Date.now()}.xlsx`;
        const { wb, ws } = this.getExcelBuilder(sheetName, fileName);

        const colMaxLengths: number[] = [];

        for (const row of rows) {
            const excelRow = ws.addRow(row);

            row.forEach((item, colIndex) => {
                let cellValue = item;
                if (
                    cellValue === null ||
                    cellValue === undefined ||
                    cellValue === 'null' ||
                    cellValue === 'undefined'
                ) {
                    cellValue = '';
                }
                const cell = excelRow.getCell(colIndex + 1);

                cell.value = cellValue;

                const currentLength = cellValue.toString().length;
                if (
                    !colMaxLengths[colIndex] ||
                    currentLength > colMaxLengths[colIndex]
                ) {
                    colMaxLengths[colIndex] = currentLength;
                }
            });

            excelRow.commit();
        }

        colMaxLengths.forEach((max, index) => {
            ws.getColumn(index + 1).width = max + 2;
        });

        await ws.commit();
        await wb.commit();

        const buffer = await fs.readFile(fileName);
        await fs.unlink(fileName);
        return buffer;
    }
}
