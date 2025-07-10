"use client"

import { useState } from "react"
import CategoryManagement from "@/components/admin/service-management/CategoryManagement"
import SkillsManagement from "@/components/admin/service-management/SkillsManagement"
import TierManagement from "@/components/admin/service-management/TierManagement"

type TTab = "Skills" | "Tiers" | "Categories"
const tabs: TTab[] = ["Skills", "Tiers", "Categories"]

export default function ManagementPage() {
    const [tab, setTab] = useState<TTab>("Skills")

    const handleTabChange = (newTabValue: TTab) => {
        setTab(newTabValue)
    }

    const renderTabContent = (tab: TTab) => {
        switch (tab) {
            case "Skills":
                return <SkillsManagement />
            case "Tiers":
                return <TierManagement />
            case "Categories":
                return <CategoryManagement />
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white w-full border-b border-gray-300">
                <div className="relative flex w-full">
                    {tabs.map((tabItem,index) => (
                        <button
                            key={index}
                            onClick={() => handleTabChange(tabItem)}
                            className={`relative pb-3 px-3 sm:px-4 text-sm sm:text-base font-medium transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 ${tab === tabItem
                                ? "text-[var(--base)] after:content-[''] after:absolute after:-bottom-[1px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--base)]"
                                : "text-gray-600 hover:text-[var(--base)]"
                                }`}
                        >
                            {tabItem}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-4">
                {renderTabContent(tab)}
            </div>
        </div>
    )
}
