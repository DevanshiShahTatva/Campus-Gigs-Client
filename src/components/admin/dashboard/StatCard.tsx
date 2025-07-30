import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCardProps } from "@/utils/interface";

export const StatCard: React.FC<StatCardProps> = ({
  title,
  icon,
  bgColor,
  textColor,
  value,
  percentage,
  percentageTextColor = "text-green-600",
  subtext,
  isCurrency = false,
  isDualStat = false,
  secondValue,
  secondLabel,
  secondTextColor = "text-green-600",
}) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
    <CardHeader className="pb-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-slate-500">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${bgColor}`}>{icon}</div>
      </div>
    </CardHeader>
    <CardContent
      className={isDualStat ? "flex justify-between items-center" : ""}
    >
      {isDualStat ? (
        <>
          <div>
            <div className="text-2xl font-bold text-slate-800">{value}</div>
            <p className={`text-xs font-medium ${textColor}`}>{subtext}</p>
          </div>
          <div className="h-10 w-px bg-slate-200 mx-4" />
          <div>
            <div className="text-2xl font-bold text-slate-800">
              {secondValue}
            </div>
            <p className={`text-xs font-medium ${secondTextColor}`}>
              {secondLabel}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold text-slate-800">
            {isCurrency ? `₹${(+value).toLocaleString()}` : value}
          </div>
          {percentage && (
            <p className={`text-xs font-medium mt-1 ${percentageTextColor}`}>
              +{percentage}% {subtext || "from last month"}
            </p>
          )}
        </>
      )}
    </CardContent>
  </Card>
);