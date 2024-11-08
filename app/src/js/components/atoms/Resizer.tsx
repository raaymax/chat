import { useCallback, useState } from "react";
import { cn } from "../../utils";

export const Resizer = ({value, onChange}: {value: number, onChange: (v: number ) => void}) => {
  const [prevPos, setPrevPos] = useState<number | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);
  const startDrag = useCallback((e: React.DragEvent) => {
    setDragging(true);
    const img = document.getElementById('void') as HTMLImageElement;
    e.dataTransfer.setDragImage(img, 0, 0);
  }, [setDragging]);
  const endDrag = useCallback(() => {
    console.log('end')
    setDragging(false);
    setPrevPos(null);
  }, [setDragging, setPrevPos]);
  const resize = useCallback((e: React.DragEvent) => {
    if (e.clientX === 0) return;
    if (prevPos === null) return setPrevPos(e.clientX);
    const deltaX = e.clientX - prevPos;
    const newSize = Math.max(150, Math.min(500, value + deltaX));
    onChange(newSize);
    localStorage.setItem('sidebar-size', `${newSize}`);
    setPrevPos(e.clientX);
  }, [value, onChange, prevPos, setPrevPos]);

  return (
    <div className={cn('resizer', {dragging})} onDragStart={startDrag} onDragEnd={endDrag} onDrag={resize} draggable={true}>
      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/ckM3ZIAAAAASUVORK5CYII=" id="void"/>
    </div>
  )
}
