"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, Shield, MapPin, Download, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalReports: number
  detectedScams: number
  legitimateCases: number
  detectionRate: number
  financialLoss: number
  activeCases: number
  highRiskAreas: number
}

interface RecentReport {
  id: string
  date: string
  type: string
  amount: number
  state: string
  status: "Scam" | "Legitimate" | "Under Review"
  summary: string
}

interface LookupData {
  states: Array<{ id: number; name: string; code: string }>
  scamTypes: Array<{ id: number; name: string; description: string }>
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalReports: 0,
    detectedScams: 0,
    legitimateCases: 0,
    detectionRate: 0,
    financialLoss: 0,
    activeCases: 0,
    highRiskAreas: 0,
  })

  const [recentReports, setRecentReports] = useState<RecentReport[]>([])
  const [lookupData, setLookupData] = useState<LookupData>({ states: [], scamTypes: [] })
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    state: "all",
    scamType: "all",
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchLookupData()
    fetchDashboardData()
  }, [])

  const fetchLookupData = async () => {
    try {
      // Try main API first
      const [statesRes, scamTypesRes] = await Promise.all([
        fetch("/api/lookup?type=states"),
        fetch("/api/lookup?type=scam_types"),
      ])

      let statesData, scamTypesData

      if (statesRes.ok && scamTypesRes.ok) {
        statesData = await statesRes.json()
        scamTypesData = await scamTypesRes.json()
      } else {
        // Fallback to local data
        const [fallbackStatesRes, fallbackScamTypesRes] = await Promise.all([
          fetch("/api/lookup-fallback?type=states"),
          fetch("/api/lookup-fallback?type=scam_types"),
        ])

        statesData = await fallbackStatesRes.json()
        scamTypesData = await fallbackScamTypesRes.json()
      }

      // Ensure we have arrays, fallback to empty arrays if not
      const states = Array.isArray(statesData) ? statesData : []
      const scamTypes = Array.isArray(scamTypesData) ? scamTypesData : []

      setLookupData({ states, scamTypes })
    } catch (error) {
      console.error("Error fetching lookup data:", error)
      // Set empty arrays as fallback
      setLookupData({ states: [], scamTypes: [] })
    }
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Build query parameters for filtering
      const params = new URLSearchParams()
      if (filters.dateFrom) params.append("start_date", filters.dateFrom)
      if (filters.dateTo) params.append("end_date", filters.dateTo)
      if (filters.state !== "all") params.append("state_filter", filters.state)
      if (filters.scamType !== "all") params.append("scam_type_filter", filters.scamType)

      // Try main APIs first, fallback if they fail
      let statsData, reportsData

      try {
        const [statsRes, reportsRes] = await Promise.all([
          fetch(`/api/dashboard-stats?${params.toString()}`),
          fetch("/api/reports"),
        ])

        if (statsRes.ok && reportsRes.ok) {
          statsData = await statsRes.json()
          reportsData = await reportsRes.json()
        } else {
          throw new Error("Main APIs failed")
        }
      } catch (apiError) {
        console.log("Main APIs failed, using fallback data")
        // Use fallback APIs
        const [fallbackStatsRes, fallbackReportsRes] = await Promise.all([
          fetch("/api/dashboard-stats-fallback"),
          fetch("/api/reports-fallback"),
        ])

        statsData = await fallbackStatsRes.json()
        reportsData = await fallbackReportsRes.json()
      }

      if (statsData && !statsData.error) {
        setStats(statsData)
      }

      if (Array.isArray(reportsData)) {
        setRecentReports(reportsData)
      } else {
        setRecentReports([])
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    await fetchDashboardData()
    setLastUpdated(new Date())
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated successfully",
    })
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Report ID", "Date", "Type", "Amount (RM)", "State", "Status"],
      ...recentReports.map((report) => [
        report.id,
        report.date,
        report.type,
        report.amount.toString(),
        report.state,
        report.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `fraud_reports_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Export Successful",
      description: "Report data has been exported to CSV",
    })
  }

  // Apply filters when they change
  useEffect(() => {
    fetchDashboardData()
  }, [filters])

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header with refresh and export */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Last updated: {lastUpdated.toLocaleString()}</p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={refreshData} disabled={loading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Anomaly Alert Banner */}
        {stats.detectionRate > 70 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">High Fraud Detection Rate</h3>
                <p className="text-sm text-yellow-700">
                  {stats.detectionRate.toFixed(1)}% of recent reports have been classified as fraudulent
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">From Date</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">To Date</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">State</label>
                <Select value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {Array.isArray(lookupData.states) &&
                      lookupData.states.map((state) => (
                        <SelectItem key={state.id} value={state.id.toString()}>
                          {state.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Scam Type</label>
                <Select value={filters.scamType} onValueChange={(value) => setFilters({ ...filters, scamType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Array.isArray(lookupData.scamTypes) &&
                      lookupData.scamTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Reports</p>
                  <p className="text-3xl font-bold">{stats.totalReports.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Financial Loss</p>
                  <p className="text-3xl font-bold">RM {(stats.financialLoss / 1000000).toFixed(1)}M</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Detection Rate</p>
                  <p className="text-3xl font-bold">{stats.detectionRate.toFixed(1)}%</p>
                </div>
                <Shield className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">High-Risk Areas</p>
                  <p className="text-3xl font-bold">{stats.highRiskAreas}</p>
                </div>
                <MapPin className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports (Latest 5)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Report ID</th>
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Type</th>
                      <th className="text-left py-2">Amount (RM)</th>
                      <th className="text-left py-2">State</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReports.map((report) => (
                      <tr key={report.id} className="border-b">
                        <td className="py-2 font-medium">{report.id}</td>
                        <td className="py-2">{report.date}</td>
                        <td className="py-2">{report.type}</td>
                        <td className="py-2">{report.amount.toLocaleString()}</td>
                        <td className="py-2">{report.state}</td>
                        <td className="py-2">
                          <Badge
                            variant={
                              report.status === "Scam"
                                ? "destructive"
                                : report.status === "Legitimate"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {report.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PowerBI Analytics - Made Bigger */}
        <Card>
          <CardHeader>
            <CardTitle>Fraud Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[700px] border rounded-lg overflow-hidden">
              <iframe
                title="Malaysia Fraud Analytics"
                width="100%"
                height="100%"
                src="https://app.powerbi.com/view?r=eyJrIjoiODBmNTZhNDUtOTg3Yi00MGY3LTk3ZmYtNDI1MDA1Mzc1ZDBjIiwidCI6IjBlMGRiMmFkLWM0MTYtNDdjNy04OGVjLWNlYWM0ZWU3Njc2NyIsImMiOjEwfQ%3D%3D"
                frameBorder="0"
                allowFullScreen={true}
                className="w-full h-full"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
