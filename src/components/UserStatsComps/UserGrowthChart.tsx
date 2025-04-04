import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function UserGrowthChart() {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">User Growth</h3>
          <div className="flex space-x-2">
            <Button size="sm" className="text-xs bg-[#4FB372] text-white">
              Monthly
            </Button>
            <Button size="sm" variant="ghost" className="text-xs text-gray-600">
              Weekly
            </Button>
            <Button size="sm" variant="ghost" className="text-xs text-gray-600">
              Daily
            </Button>
          </div>
        </div>
        <div className="h-72 relative">
          <div className="absolute inset-0 flex items-end justify-between px-2">
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "40%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "55%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "45%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "60%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "75%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "65%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "80%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "70%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "85%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "92%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "88%" }}></div>
            <div className="w-1/12 bg-[#4FB372]/80 rounded-t" style={{ height: "95%" }}></div>
          </div>
          <div className="absolute bottom-0 inset-x-0 flex justify-between px-2 pt-2 border-t border-gray-200 text-xs text-gray-500">
            <div className="text-center">Jan</div>
            <div className="text-center">Feb</div>
            <div className="text-center">Mar</div>
            <div className="text-center">Apr</div>
            <div className="text-center">May</div>
            <div className="text-center">Jun</div>
            <div className="text-center">Jul</div>
            <div className="text-center">Aug</div>
            <div className="text-center">Sep</div>
            <div className="text-center">Oct</div>
            <div className="text-center">Nov</div>
            <div className="text-center">Dec</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}