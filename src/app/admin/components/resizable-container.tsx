"use client";


export default function ResizableContainer({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="h-full bg-gray-100 overflow-x-auto min-w-[200px] max-w-[800px] relative"
            style={{ width: '16rem' }}
        >
            <div
                className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 hover:opacity-50"
                onMouseDown={(e) => {
                    e.preventDefault();
                    const startX = e.pageX;
                    const container = e.currentTarget.parentElement;
                    const startWidth = container?.offsetWidth || 0;

                    const onMouseMove = (e: MouseEvent) => {
                        if (container) {
                            const newWidth = startWidth + (e.pageX - startX);
                            container.style.width = `${Math.min(Math.max(newWidth, 200), 800)}px`;
                        }
                    };

                    const onMouseUp = () => {
                        document.removeEventListener('mousemove', onMouseMove);
                        document.removeEventListener('mouseup', onMouseUp);
                    };

                    document.addEventListener('mousemove', onMouseMove);
                    document.addEventListener('mouseup', onMouseUp);
                }}
            />
            {children}
        </div>
    )
}

