import { useCallback, useEffect, useRef, useState } from "react";
import { ClassNames, cn } from "../../utils";

type CollapsableColumnsProps = {
  className?: ClassNames;
  minSize: number;
  columns: [React.ReactNode, React.ReactNode?];
};
export const CollapsableColumns = ({ className, columns, minSize }: CollapsableColumnsProps) => {
  const container = useRef<HTMLDivElement>(null);
  const [oneColumn, setOneColumn] = useState(false);

  const onResize = useCallback(() => {
    const width = container.current?.offsetWidth ?? (3*minSize);
    setOneColumn(width < 2*minSize);
  }, [setOneColumn]);

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  const [Column1, Column2] = columns;

  return (
    <div className={cn(className)} ref={container}>
      {(!Column2 || !oneColumn) && Column1}
      {Column2}
    </div>
  );
}
