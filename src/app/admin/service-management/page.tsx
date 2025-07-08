"use client"

import { useState } from "react"
import CategoryManagement from "@/components/admin/service-management/CategoryManagement"
import SkillsManagement from "@/components/admin/service-management/SkillsManagement"
import TierManagement from "@/components/admin/service-management/TierManagement"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TTab = "skills" | "tiers" | "categories"

export default function ManagementPage() {
    const [tab, setTab] = useState<TTab>("skills")

    const handleTabChange = (newTabValue: TTab) => {
        setTab(newTabValue)
    }

    const renderTabContent = (tab: TTab) => {
        switch (tab) {
            case "skills":
                return <SkillsManagement />
            case "tiers":
                return <TierManagement />
            case "categories":
                return <CategoryManagement />
            default:
                return null
        }
    }

    return (
        <div className="space-y-6">
            <Tabs value={tab} onValueChange={(newVal) => handleTabChange(newVal as TTab)} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="tiers">Tiers</TabsTrigger>
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="mt-4">
                {renderTabContent(tab)}
            </div>
        </div>
    )
}
