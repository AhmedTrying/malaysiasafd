"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FileDown, Eye, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function GeneratePDF() {
  const [options, setOptions] = useState({
    dateFrom: new Date().toISOString().split("T")[0],
    dateTo: new Date().toISOString().split("T")[0],
    includeSummaryCards: true,
    includeRecentReports: true,
    includeFraudAnalytics: false,
  })

  const [loading, setLoading] = useState(false)
  const [previewData, setPreviewData] = useState<any>(null)

  const { toast } = useToast()

  const previewReport = async () => {
    setLoading(true)

    try {
      // Simulate generating preview data
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockData = {
        dateRange: `${options.dateFrom} to ${options.dateTo}`,
        summaryCards: {
          totalReports: 1342,
          detectedScams: 892,
          financialLoss: 3400000,
          activeCases: 785,
        },
        recentReports: [
          { id: "#0599", date: "2024-06-14", type: "Investment Scam", amount: 25000, state: "Selangor" },
          { id: "#0598", date: "2024-06-14", type: "Love Scam", amount: 15000, state: "Kuala Lumpur" },
          { id: "#0597", date: "2024-06-13", type: "Phishing", amount: 0, state: "Penang" },
        ],
        generatedAt: new Date().toLocaleString(),
        version: "v1.0.0",
      }

      setPreviewData(mockData)
    } catch (error) {
      toast({
        title: "Preview Failed",
        description: "Failed to generate report preview",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = async () => {
    if (!previewData) {
      toast({
        title: "No Preview",
        description: "Please preview the report first",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, this would generate and download a PDF
      const filename = `fraud_report_${options.dateFrom}_to_${options.dateTo}.pdf`

      toast({
        title: "PDF Generated",
        description: `Report "${filename}" has been generated and downloaded`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate PDF report",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate PDF Report</h1>
          <p className="text-gray-600">Create a downloadable PDF report of fraud statistics and data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Report Options */}
          <Card>
            <CardHeader>
              <CardTitle>Report Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Date Range</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">From Date</label>
                    <Input
                      type="date"
                      value={options.dateFrom}
                      onChange={(e) => setOptions({ ...options, dateFrom: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">To Date</label>
                    <Input
                      type="date"
                      value={options.dateTo}
                      onChange={(e) => setOptions({ ...options, dateTo: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Include Sections</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="summary-cards"
                      checked={options.includeSummaryCards}
                      onCheckedChange={(checked) => setOptions({ ...options, includeSummaryCards: !!checked })}
                    />
                    <label htmlFor="summary-cards" className="text-sm font-medium">
                      Summary Cards
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="recent-reports"
                      checked={options.includeRecentReports}
                      onCheckedChange={(checked) => setOptions({ ...options, includeRecentReports: !!checked })}
                    />
                    <label htmlFor="recent-reports" className="text-sm font-medium">
                      Recent Reports
                    </label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fraud-analytics"
                      checked={options.includeFraudAnalytics}
                      onCheckedChange={(checked) => setOptions({ ...options, includeFraudAnalytics: !!checked })}
                    />
                    <label htmlFor="fraud-analytics" className="text-sm font-medium">
                      Fraud Analytics
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={previewReport} disabled={loading} variant="outline" className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Report
                    </>
                  )}
                </Button>

                <Button onClick={generatePDF} disabled={loading || !previewData} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileDown className="mr-2 h-4 w-4" />
                      Generate PDF
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Report Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {!previewData ? (
                <div className="text-center py-12 text-gray-500">
                  <FileDown className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <div>Select options and click "Preview Report" to see the report</div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Report Header */}
                  <div className="border-b pb-4">
                    <h2 className="text-xl font-bold">Malaysia Fraud Detection Report</h2>
                    <p className="text-sm text-gray-600">Period: {previewData.dateRange}</p>
                    <p className="text-sm text-gray-600">Generated: {previewData.generatedAt}</p>
                  </div>

                  {/* Summary Cards */}
                  {options.includeSummaryCards && (
                    <div>
                      <h3 className="font-medium mb-3">Summary Statistics</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded">
                          <p className="text-sm text-blue-600">Total Reports</p>
                          <p className="text-lg font-bold text-blue-800">
                            {previewData.summaryCards.totalReports.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-red-50 p-3 rounded">
                          <p className="text-sm text-red-600">Detected Scams</p>
                          <p className="text-lg font-bold text-red-800">
                            {previewData.summaryCards.detectedScams.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded">
                          <p className="text-sm text-yellow-600">Financial Loss</p>
                          <p className="text-lg font-bold text-yellow-800">
                            RM {(previewData.summaryCards.financialLoss / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <div className="bg-green-50 p-3 rounded">
                          <p className="text-sm text-green-600">Active Cases</p>
                          <p className="text-lg font-bold text-green-800">
                            {previewData.summaryCards.activeCases.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recent Reports */}
                  {options.includeRecentReports && (
                    <div>
                      <h3 className="font-medium mb-3">Recent Reports</h3>
                      <div className="space-y-2">
                        {previewData.recentReports.map((report: any) => (
                          <div key={report.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <p className="font-medium">{report.id}</p>
                              <p className="text-sm text-gray-600">
                                {report.type} - {report.state}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">RM {report.amount.toLocaleString()}</p>
                              <p className="text-sm text-gray-600">{report.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="border-t pt-4 mt-6">
                    <p className="text-xs text-gray-500">
                      Report generated by Malaysia Fraud Detection System {previewData.version}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
