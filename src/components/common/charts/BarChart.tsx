import { BarChartProps } from "@/utils/interface";
import { useMemo } from "react";

export const BarChart: React.FC<BarChartProps> = ({
  data,
  color = "bg-blue-500",
  height = 150,
}) => {
  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.amount)),
    [data]
  );

  return (
    <div className="flex items-end h-full gap-2" style={{ height }}>
      {data.map(({ amount }, index) => {
        const barHeight = maxValue > 0 ? (amount / maxValue) * 100 : 0;
        return (
          <div
            key={index}
            className={`flex-1 ${color} rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer relative group`}
            style={{
              height: `${barHeight}%`,
              minHeight: "4px",
              animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
              ₹{amount}
            </div>
          </div>
        );
      })}
      <style jsx>{`
        @keyframes slideUp {
          from {
            height: 0%;
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
