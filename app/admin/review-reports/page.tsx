"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle, Eye, Clock, RefreshCw, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PendingReport {
  "Case ID": string
  Date: string
  Summary: string
  "Amount Lost": string
  "Scam Type": string
  State: string
  Scam_NonScam: string
  Confidence: string
  "Submitted By": string
  "Submitted At": string
  id: string
}

export default function ReviewReports() {
  const [pendingReports, setPendingReports] = useState<PendingReport[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState<PendingReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    fetchPendingReports()
  }, [])

  const fetchPendingReports = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/pending-reports")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Ensure data is an array
      if (Array.isArray(data)) {
        setPendingReports(data)
      } else {
        console.warn("API returned non-array data:", data)
        setPendingReports([])
      }
    } catch (error) {
      console.error("Error fetching pending reports:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch pending reports")
      setPendingReports([])
      toast({
        title: "Error",
        description: "Failed to fetch pending reports. Using demo data.",
        variant: "destructive",
      })

      // Set demo data as fallback
      setPendingReports([
        {
          "Case ID": "#P2001",
          Date: "2024-06-14",
          Summary: "Investment scam promising high returns on cryptocurrency",
          "Amount Lost": "25000",
          "Scam Type": "Investment Scam",
          State: "Selangor",
          Scam_NonScam: "1",
          Confidence: "0.95",
          "Submitted By": "user123",
          "Submitted At": "2024-06-14T10:30:00Z",
          id: "demo-1",
        },
        {
          "Case ID": "#P2002",
          Date: "2024-06-13",
          Summary: "Romance scam through dating app",
          "Amount Lost": "15000",
          "Scam Type": "Love Scam",
          State: "Kuala Lumpur",
          Scam_NonScam: "1",
          Confidence: "0.88",
          "Submitted By": "user456",
          "Submitted At": "2024-06-13T15:45:00Z",
          id: "demo-2",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleReportAction = async (caseId: string, action: "approve" | "reject") => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/approve-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caseId, action }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      toast({
        title: action === "approve" ? "Report Approved" : "Report Rejected",
        description: result.message,
      })

      // Remove the processed report from the list
      setPendingReports((prev) => prev.filter((report) => report["Case ID"] !== caseId))
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} report: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Reports</h1>
            <p className="text-gray-600">Review and approve/reject submitted fraud reports</p>
          </div>
          <Button onClick={fetchPendingReports} disabled={loading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Connection Issue</h3>
                <p className="text-sm text-yellow-700">{error}. Showing demo data for testing purposes.</p>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Reports
              <Badge variant="secondary" className="ml-2">
                {pendingReports.length} pending
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : pendingReports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <div>No pending reports to review</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3">Case ID</th>
                      <th className="text-left py-3">Date</th>
                      <th className="text-left py-3">Type</th>
                      <th className="text-left py-3">Amount (RM)</th>
                      <th className="text-left py-3">State</th>
                      <th className="text-left py-3">AI Prediction</th>
                      <th className="text-left py-3">Confidence</th>
                      <th className="text-left py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingReports.map((report) => (
                      <tr key={report.id || report["Case ID"]} className="border-b">
                        <td className="py-3 font-medium">{report["Case ID"]}</td>
                        <td className="py-3">{report.Date}</td>
                        <td className="py-3">{report["Scam Type"]}</td>
                        <td className="py-3">{Number.parseFloat(report["Amount Lost"]).toLocaleString()}</td>
                        <td className="py-3">{report.State}</td>
                        <td className="py-3">
                          <Badge variant={report["Scam_NonScam"] === "1" ? "destructive" : "default"}>
                            {report["Scam_NonScam"] === "1" ? "Scam" : "Non-Scam"}
                          </Badge>
                        </td>
                        <td className="py-3">
                          {report.Confidence ? `${(Number.parseFloat(report.Confidence) * 100).toFixed(1)}%` : "N/A"}
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Report Details - {report["Case ID"]}</DialogTitle>
                                </DialogHeader>
                                {selectedReport && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium">Date</label>
                                        <p className="text-sm text-gray-600">{selectedReport.Date}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Scam Type</label>
                                        <p className="text-sm text-gray-600">{selectedReport["Scam Type"]}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Amount Lost</label>
                                        <p className="text-sm text-gray-600">
                                          RM {Number.parseFloat(selectedReport["Amount Lost"]).toLocaleString()}
                                        </p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">State</label>
                                        <p className="text-sm text-gray-600">{selectedReport.State}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Submitted By</label>
                                        <p className="text-sm text-gray-600">{selectedReport["Submitted By"]}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Submitted At</label>
                                        <p className="text-sm text-gray-600">
                                          {new Date(selectedReport["Submitted At"]).toLocaleString()}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Summary</label>
                                      <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded">
                                        {selectedReport.Summary}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                      <div>
                                        <label className="text-sm font-medium">AI Prediction</label>
                                        <Badge
                                          variant={selectedReport["Scam_NonScam"] === "1" ? "destructive" : "default"}
                                          className="ml-2"
                                        >
                                          {selectedReport["Scam_NonScam"] === "1" ? "Scam" : "Non-Scam"}
                                        </Badge>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium">Confidence</label>
                                        <p className="text-sm text-gray-600">
                                          {selectedReport.Confidence
                                            ? `${(Number.parseFloat(selectedReport.Confidence) * 100).toFixed(1)}%`
                                            : "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-green-600 hover:text-green-700">
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Approve Report</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to approve this report? It will be added to the main dataset.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleReportAction(report["Case ID"], "approve")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Approve
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Report</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reject this report? It will be permanently removed.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleReportAction(report["Case ID"], "reject")}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
