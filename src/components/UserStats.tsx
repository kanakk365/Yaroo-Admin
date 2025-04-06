import { useEffect, useState } from "react"
import axios from "axios"
import UserStatsHeader from "@/components/UserStatsComps/UserStatsHeader"
import UserMetricCards from "@/components/UserStatsComps/UserMetricCards"
import UserTable from "@/components/UserStatsComps/UserTable"
import { UserStatsData } from "@/components/UserStatsComps/types"

interface UserStatsProps {
  isActive: boolean
}

export default function UserStats({ isActive }: UserStatsProps) {
  const [statsData, setStatsData] = useState<UserStatsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string>("7days");

  useEffect(() => {
    if (isActive) {
      fetchUserStats();
    }
  }, [isActive, timeFilter]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/v1/admin/users", {
        headers: {
          "X-Karma-Admin-Auth": "sdbsdbjdasdabhjbjahbjbcj8367"
        }
      });
      
      if (response.data.success) {
        setStatsData(response.data.data);
      } else {
        throw new Error(response.data.message || "Error fetching user statistics");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || "Failed to fetch user stats");
      } else if (err instanceof Error) {
        setError(err.message || "Failed to fetch user stats");
      } else {
        setError("Failed to fetch user stats");
      }
      console.error("Error fetching user stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) return null;
  
  if (loading) {
    return (
      <div className="bg-gray-100 p-6 flex justify-center items-center h-full">
        <div className="text-center">
          <p className="text-gray-600">Loading user statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 p-6 flex justify-center items-center h-full">
        <div className="text-center">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={fetchUserStats} 
            className="mt-4 px-4 py-2 bg-[#4FB372] text-white rounded hover:bg-[#3d9059]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <UserStatsHeader 
          title="User Statistics & Insights" 
          description="Track user activity and analyze engagement metrics"
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
        />
        
        <UserMetricCards statsData={statsData} />

        <UserTable statsData={statsData} />
      </div>
    </div>
  )
}

