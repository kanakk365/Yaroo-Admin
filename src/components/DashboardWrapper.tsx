"use client"

import { useState } from "react"
import { Layout } from "@/components/DashboardLayout"
import BannerManagement from "@/components/tabs/BannerManagement"
import HelpRequests from "@/components/tabs/HelpRequests"
import UserStats from "@/components/tabs/UserStats"
import Withdrawal from "@/components/tabs/Withdraw"
import { useAuth } from "@/hooks/use-auth"
import Products from "./tabs/Products"

export default function DashboardWrapper() {
  const [activeSection, setActiveSection] = useState<string>("user-stats")
  const { logout } = useAuth()

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection} onLogout={logout}>
      <main id="main-content" className="flex-1 relative h-full">
        <UserStats isActive={activeSection === "user-stats"} />
        <BannerManagement isActive={activeSection === "banners"} />
        <HelpRequests isActive={activeSection === "help-requests"} />
        <Withdrawal isActive={activeSection === "withdrawal"} />
        <Products isActive={activeSection==="products"} />
      </main>
    </Layout>
  )
}

