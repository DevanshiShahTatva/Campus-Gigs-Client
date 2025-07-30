import { fallbackColors, generateColor, popUpHeaders } from "@/utils/constant";
import { DoughnutChartProps, IUsers } from "@/utils/interface";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomTable } from "../CustomTable";

export const DoughnutChart: React.FC<DoughnutChartProps> = ({
  data,
  size = 200,
}) => {
  const total = data.reduce((sum, item) => sum + item.userCount, 0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  let cumulativePercent = 0;

  const colorizedData = useMemo(
    () =>
      data.map((item, index) => ({
        ...item,
        color: fallbackColors[index] || generateColor(index),
      })),
    [data]
  );

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="relative flex flex-col items-center">
        <svg
          width={size}
          height={size}
          viewBox="-1 -1 2 2"
          className="rotate-[-90deg] w-full max-w-[240px] h-auto"
        >
          {colorizedData.map((slice, index) => {
            const [startX, startY] =
              getCoordinatesForPercent(cumulativePercent);
            const slicePercent = slice.userCount / total;
            cumulativePercent += slicePercent;
            const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
            const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M 0 0 L ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                fill={slice.color}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseMove={(e) => {
                  const bounds = (
                    e.target as SVGPathElement
                  ).getBoundingClientRect();
                  setMousePos({
                    x: e.clientX - bounds.left,
                    y: e.clientY - bounds.top,
                  });
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  setSelectedIndex(index);
                  setOpen(true);
                }}
              />
            );
          })}

          <circle cx="0" cy="0" r="0.5" fill="white" />
        </svg>

        {hoveredIndex !== null && (
          <div
            className="absolute z-10 px-3 py-1 text-xs bg-gray-700 text-white rounded shadow border border-slate-200 pointer-events-none"
            style={{
              top: mousePos.y,
              left: mousePos.x + 20,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="font-medium">
              {colorizedData[hoveredIndex].planName}
            </div>
            <div>{colorizedData[hoveredIndex].userCount} users</div>
          </div>
        )}

        <div className="mt-4 w-full">
          {colorizedData.map((slice, index) => (
            <div
              key={index}
              className="flex items-center text-sm mb-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
              onClick={() => {
                setSelectedIndex(index);
                setOpen(true);
              }}
            >
              <span
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-slate-700 font-medium">
                {slice.planName}
              </span>
              <span className="ml-auto text-slate-500">{slice.userCount}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedIndex !== null && (
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {colorizedData[selectedIndex].planName} Plan
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 text-sm text-gray-700">
            <CustomTable<IUsers>
              searchPlaceholder="Search by Name or Email"
              data={colorizedData[selectedIndex].users.map((user) => ({
                ...user,
                plan: colorizedData[selectedIndex].planName,
              }))}
              columns={popUpHeaders}
              pageSize={5}
            />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
