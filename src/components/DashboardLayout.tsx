"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ImageIcon, HelpCircle, BarChart3, Wallet, LogOut, Menu, X, Box } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

interface LayoutProps {
  children: React.ReactNode
  activeSection: string
  setActiveSection: (section: string) => void
  onLogout: () => void
}

export function Layout({ children, activeSection, setActiveSection, onLogout }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isMobile = useMobile()

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-900">
      <nav className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200/30 h-screen">
        <div className="p-5 border-b border-gray-200/20">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#4FB372] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-800">AdminDash</span>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto">
          <ul className="py-4">
            <li className="px-5 py-3">
              <button
                onClick={() => handleSectionChange("user-stats")}
                className={`flex items-center w-full text-left ${
                  activeSection === "user-stats" ? "text-[#4FB372]" : "text-gray-700 hover:text-[#4FB372]"
                } transition-colors group`}
              >
                <BarChart3
                  className={`h-5 w-5 mr-3 ${
                    activeSection === "user-stats" ? "text-[#4FB372]" : "text-gray-500 group-hover:text-[#4FB372]"
                  }`}
                />
                User Statistics
              </button>
            </li>
            <li className="px-5 py-3">
              <button
                onClick={() => handleSectionChange("banners")}
                className={`flex items-center w-full text-left ${
                  activeSection === "banners" ? "text-[#4FB372]" : "text-gray-700 hover:text-[#4FB372]"
                } transition-colors group`}
              >
                <ImageIcon
                  className={`h-5 w-5 mr-3 ${
                    activeSection === "banners" ? "text-[#4FB372]" : "text-gray-500 group-hover:text-[#4FB372]"
                  }`}
                />
                Banner Management
              </button>
            </li>
            <li className="px-5 py-3">
              <button
                onClick={() => handleSectionChange("help-requests")}
                className={`flex items-center w-full text-left ${
                  activeSection === "help-requests" ? "text-[#4FB372]" : "text-gray-700 hover:text-[#4FB372]"
                } transition-colors group`}
              >
                <HelpCircle
                  className={`h-5 w-5 mr-3 ${
                    activeSection === "help-requests" ? "text-[#4FB372]" : "text-gray-500 group-hover:text-[#4FB372]"
                  }`}
                />
                Help &amp; Contact
              </button>
            </li>
            <li className="px-5 py-3">
              <button
                onClick={() => handleSectionChange("withdrawal")}
                className={`flex items-center w-full text-left ${
                  activeSection === "withdrawal" ? "text-[#4FB372]" : "text-gray-700 hover:text-[#4FB372]"
                } transition-colors group`}
              >
                <Wallet
                  className={`h-5 w-5 mr-3 ${
                    activeSection === "withdrawal" ? "text-[#4FB372]" : "text-gray-500 group-hover:text-[#4FB372]"
                  }`}
                />
                Withdrawal Requests
              </button>
            </li>
            <li className="px-5 py-3">
              <button
                onClick={() => handleSectionChange("products")}
                className={`flex items-center w-full text-left ${
                  activeSection === "products" ? "text-[#4FB372]" : "text-gray-700 hover:text-[#4FB372]"
                } transition-colors group`}
              >
                <Box
                  className={`h-5 w-5 mr-3 ${
                    activeSection === "products" ? "text-[#4FB372]" : "text-gray-500 group-hover:text-[#4FB372]"
                  }`}
                />
                Products
              </button>
            </li>
          </ul>
        </div>

        <div className="p-5 border-t border-gray-200/20">
          <div className="flex items-center">
            <Image
              src="/placeholder.svg?height=40&width=40"
              alt="Admin profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>

            <button type="button" className="ml-auto text-gray-500 hover:text-gray-700" onClick={onLogout}>
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="lg:hidden">
        <nav className="bg-white border-b border-gray-200/30 w-full px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-[#4FB372] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <span className="ml-3 text-xl font-semibold text-gray-800">AdminDash</span>
          </div>

          <button
            type="button"
            className="text-neutral-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {isMobileMenuOpen && (
          <div id="mobile-menu" className="lg:hidden absolute z-50 w-full bg-neutral-800/80 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleSectionChange("user-stats")}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#4FB372]/70 hover:text-white"
              >
                User Statistics
              </button>
              <button
                onClick={() => handleSectionChange("banners")}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#4FB372]/70 hover:text-white"
              >
                Banner Management
              </button>
              <button
                onClick={() => handleSectionChange("help-requests")}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#4FB372]/70 hover:text-white"
              >
                Help &amp; Contact
              </button>
              <button
                onClick={() => handleSectionChange("withdrawal")}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#4FB372]/70 hover:text-white"
              >
                Withdrawal Requests
              </button>
            </div>
            <div className="border-t border-gray-200/10 pt-4 pb-3">
              <div className="flex items-center px-5">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Admin profile"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
                <div className="ml-3">
                  <p className="text-base font-medium text-white">Admin User</p>
                  <p className="text-sm text-gray-400">admin@example.com</p>
                </div>
              </div>
              <div className="mt-3 px-2">
                <Link
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#4FB372]/70 hover:text-white"
                >
                  Your Profile
                </Link>
                <Link
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#4FB372]/70 hover:text-white"
                >
                  Settings
                </Link>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-[#4FB372]/70 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

