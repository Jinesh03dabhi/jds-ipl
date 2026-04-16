import type { ReactNode } from "react";
import styles from "./seo-ui.module.css";

type Column = {
  key: string;
  label: string;
};

type Row = Record<string, ReactNode>;

type StatsTableProps = {
  columns: Column[];
  rows: Row[];
};

export default function StatsTable({ columns, rows }: StatsTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {columns.map((column) => (
                <td key={`${rowIndex}-${column.key}`}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
