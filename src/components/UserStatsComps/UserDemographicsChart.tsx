import { Card, CardContent } from "@/components/ui/card"
import { UserStatsData } from "./types"

interface UserDemographicsChartProps {
  statsData: UserStatsData | null;
}

export default function UserDemographicsChart({ statsData }: UserDemographicsChartProps) {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="text-lg font-medium text-gray-800 mb-4">User Demographics</h3>
        <div className="h-64 relative flex items-center justify-center">
          <div className="relative w-40 h-40">
            <div
              className="absolute inset-0 rounded-full border-8 border-[#4FB372]"
              style={{ clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)", transform: "rotate(0deg)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border-8 border-blue-400"
              style={{ clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)", transform: "rotate(90deg)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border-8 border-amber-400"
              style={{ clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)", transform: "rotate(198deg)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full border-8 border-purple-400"
              style={{ clipPath: "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)", transform: "rotate(270deg)" }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full w-28 h-28 m-auto">
              <span className="text-lg font-semibold text-gray-700">{statsData?.total_users || 0}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#4FB372] mr-2"></div>
            <span className="text-sm text-gray-600">18-24 (35%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
            <span className="text-sm text-gray-600">25-34 (28%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div>
            <span className="text-sm text-gray-600">35-44 (22%)</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-400 mr-2"></div>
            <span className="text-sm text-gray-600">45+ (15%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}