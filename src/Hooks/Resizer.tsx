import React from 'react';

enum Direction {
    Horizontal = 'Horizontal',
    Vertical = 'Vertical',
}

export const useResizable = (): [(node: HTMLElement | null) => void] => {
    const [node, setNode] = React.useState<HTMLElement | null>(null);

    const ref = React.useCallback((nodeEle: HTMLElement | null) => {
        setNode(nodeEle);
    }, []);

    const handleMouseDown = React.useCallback((e: MouseEvent) => {
        if (!node) {
            return;
        }

        const direction = (e.target as HTMLElement).classList.contains("resizer--r")
            ? Direction.Horizontal
            : Direction.Vertical;
        const startPos = {
            x: e.clientX,
            y: e.clientY,
        };
        const styles = window.getComputedStyle(node);
        const w = parseInt(styles.width, 10);
        const h = parseInt(styles.height, 10);

        const handleMouseMove = (e: MouseEvent) => {
            const dx = e.clientX - startPos.x;
            const dy = e.clientY - startPos.y;

            if (direction === Direction.Horizontal) {
                node.style.width = `${w + dx}px`;
            } else {
                node.style.height = `${h + dy}px`;
            }
            updateCursor(direction);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            resetCursor();
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [node]);

    const handleTouchStart = React.useCallback((e: TouchEvent) => {
        if (!node) {
            return;
        }
        const direction = (e.target as HTMLElement).classList.contains("resizer--r")
            ? Direction.Horizontal
            : Direction.Vertical;
        const touch = e.touches[0];
        const startPos = {
            x: touch.clientX,
            y: touch.clientY,
        };
        const styles = window.getComputedStyle(node);
        const w = parseInt(styles.width, 10);
        const h = parseInt(styles.height, 10);

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            const dx = touch.clientX - startPos.x;
            const dy = touch.clientY - startPos.y;

            if (direction === Direction.Horizontal) {
                node.style.width = `${w + dx}px`;
            } else {
                node.style.height = `${h + dy}px`;
            }
            updateCursor(direction);
        };

        const handleTouchEnd = () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            resetCursor();
        };

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    }, [node]);

    const updateCursor = (direction: Direction) => {
        document.body.style.cursor = direction === Direction.Horizontal ? 'col-resize' : 'row-resize';
        document.body.style.userSelect = 'none';
    };

    const resetCursor = () => {
        document.body.style.removeProperty('cursor');
        document.body.style.removeProperty('user-select');
    };

    React.useEffect(() => {
        if (!node) {
            return;
        }
        const resizerElements = Array.from(node.querySelectorAll('.resizer'));
        resizerElements.forEach((resizerEle) => {
            resizerEle.addEventListener("mousedown", handleMouseDown as EventListener);
            resizerEle.addEventListener("touchstart", handleTouchStart as EventListener);
        });

        return () => {
            resizerElements.forEach((resizerEle) => {
                resizerEle.removeEventListener("mousedown", handleMouseDown as EventListener);
                resizerEle.removeEventListener("touchstart", handleTouchStart as EventListener);
            });
        };
    }, [node, handleMouseDown, handleTouchStart]);

    return [ref];
};