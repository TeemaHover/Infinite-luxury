export class BaseDao {
    public orderBy(
        columns: string | string[],
        orderDirection: string,
        acceptedColumns: string[] = [],
        alias: string = '',
    ): string {
        const prefix = alias ? `${alias}.` : '';

        const upperOrderDir = orderDirection?.toUpperCase();
        const validDirections = ['ASC', 'DESC'];
        const finalOrderDirection = validDirections.includes(upperOrderDir)
            ? upperOrderDir
            : 'DESC';

        const columnsArray = Array.isArray(columns) ? columns : [columns];

        const orderParts = columnsArray.map((colExpr) => {
            const matchedCols = colExpr?.match(/"[a-zA-Z0-9_]+"/g);

            if (matchedCols) {
                for (const match of matchedCols) {
                    const cleanCol = match.replace(/"/g, '');
                    if (!acceptedColumns.includes(cleanCol)) {
                        const fallback = acceptedColumns[0] || 'createdAt';
                        return `${prefix}"${fallback}" ${finalOrderDirection}`;
                    }
                }
            } else {
                if (!acceptedColumns.includes(colExpr)) {
                    const fallback = acceptedColumns[0] || 'createdAt';
                    return `${prefix}"${fallback}" ${finalOrderDirection}`;
                }
            }

            const isSimple = /^[a-zA-Z0-9_]+$/.test(colExpr);
            const finalExpr = isSimple ? `${prefix}"${colExpr}"` : colExpr;

            return `${finalExpr} ${finalOrderDirection}`;
        });

        return ` ORDER BY ${orderParts.join(', ')}`;
    }
}
