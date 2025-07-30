import { formatLabel } from "@/utils/constant";
import { Props } from "@/utils/interface";
import { useMemo, useState } from "react";

export const ComplaintsOutcomeChart: React.FC<Props> = ({
  data,
  fallbackColors,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    return Object.entries(data).map(([key, value], index) => ({
      label: formatLabel(key),
      value,
      color: fallbackColors[index] || `hsl(${index * 72}, 70%, 60%)`,
    }));
  }, [data, fallbackColors]);

  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const max = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="w-full max-w-lg mx-auto p-4">
      {total === 0 ? (
        <div className="text-center text-gray-500 mt-4">
          No complaints found.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {chartData.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center relative">
                  <div className="w-32 text-sm font-medium text-gray-700">
                    {item.label}
                  </div>

                  <div
                    className="flex-1 h-6 bg-gray-200 rounded-md relative"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div
                      className="h-full rounded-md transition-all duration-300"
                      style={{
                        width: `${(item.value / max) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                    {hoveredIndex === index && (
                      <div
                        className="absolute top-[-35px] left-0 px-2 py-1 text-xs text-white bg-black rounded shadow"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {item.value} complaint{item.value !== 1 ? "s" : ""} (
                        {percentage}%)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 border-t pt-4 space-y-2">
            {chartData.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center text-sm">
                  <div
                    className="w-4 h-4 rounded mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-700">
                    {item.label}:
                  </span>
                  <span className="ml-1 text-gray-600">
                    {item.value} complaint{item.value !== 1 ? "s" : ""} (
                    {percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
