"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PredictionResult {
  prediction: "Scam" | "Non-Scam"
  confidence: number
  risk_level: "Low" | "Medium" | "High"
}

const malaysianStates = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Kuala Lumpur",
  "Labuan",
  "Malacca",
  "Negeri Sembilan",
  "Pahang",
  "Penang",
  "Perak",
  "Perlis",
  "Putrajaya",
  "Sabah",
  "Sarawak",
  "Selangor",
  "Terengganu",
]

export default function GenerateReport() {
  const [formData, setFormData] = useState({
    summary: "",
    amountLost: "",
    state: "",
    scamType: "",
  })

  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [scamTypes, setScamTypes] = useState<string[]>([])
  const [loadingScamTypes, setLoadingScamTypes] = useState(true)

  const { toast } = useToast()

  useEffect(() => {
    async function fetchScamTypes() {
      setLoadingScamTypes(true)
      try {
        const res = await fetch("/api/scam-types")
        const json = await res.json()
        if (json.data) {
          setScamTypes(json.data.map((item: any) => item.name))
        }
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoadingScamTypes(false)
      }
    }
    fetchScamTypes()
  }, [])

  const validateForm = () => {
    if (!formData.summary.trim()) {
      toast({
        title: "Validation Error",
        description: "Case summary is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.amountLost || Number.parseFloat(formData.amountLost) < 0) {
      toast({
        title: "Validation Error",
        description: "Amount lost must be 0 or greater",
        variant: "destructive",
      })
      return false
    }

    if (!formData.state) {
      toast({
        title: "Validation Error",
        description: "State is required",
        variant: "destructive",
      })
      return false
    }

    if (!formData.scamType) {
      toast({
        title: "Validation Error",
        description: "Scam type is required",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const analyzeReport = async () => {
    if (!validateForm()) return

    setLoading(true)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: formData.summary,
          amountLost: Number.parseFloat(formData.amountLost),
          scamType: formData.scamType,
          state: formData.state,
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setPrediction({
        prediction: result.prediction,
        confidence: result.confidence,
        risk_level: result.risk_level,
      })
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const submitReport = async () => {
    if (!prediction) return

    setLoading(true)

    try {
      const response = await fetch("/api/pending-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          prediction: prediction.prediction,
          confidence: prediction.confidence,
          userId: "current-user-id", // Replace with actual user ID
        }),
      })

      const result = await response.json()

      if (result.error) {
        throw new Error(result.error)
      }

      setSubmitted(true)
      toast({
        title: "Report Submitted Successfully",
        description: `Your report (${result.caseId}) has been submitted for admin review.`,
      })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit the report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      summary: "",
      amountLost: "",
      state: "",
      scamType: "",
    })
    setPrediction(null)
    setSubmitted(false)
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Generate Report</h1>
          <p className="text-gray-600">Analyze and submit fraud reports using AI detection</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Case Summary *</label>
                <Textarea
                  placeholder="Describe the fraud case in detail..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={4}
                  disabled={submitted}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Amount Lost (RM) *</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={formData.amountLost}
                  onChange={(e) => setFormData({ ...formData, amountLost: e.target.value })}
                  disabled={submitted}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">State *</label>
                <Select
                  value={formData.state}
                  onValueChange={(value) => setFormData({ ...formData, state: value })}
                  disabled={submitted}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {malaysianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Scam Type *</label>
                <Select
                  value={formData.scamType}
                  onValueChange={(value) => setFormData({ ...formData, scamType: value })}
                  disabled={submitted || loadingScamTypes}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={loadingScamTypes ? "Loading..." : "Select scam type"} />
                  </SelectTrigger>
                  <SelectContent>
                    {scamTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button onClick={analyzeReport} disabled={loading || submitted} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Report"
                  )}
                </Button>

                {prediction && !submitted && (
                  <Button onClick={submitReport} disabled={loading} variant="outline">
                    Submit Report
                  </Button>
                )}

                <Button onClick={resetForm} variant="outline" disabled={loading}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {!prediction && !submitted ? (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <div>Fill out the form and click "Analyze Report" to see results</div>
                </div>
              ) : submitted ? (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Report has been successfully submitted for admin review. You will be notified once it's processed.
                  </AlertDescription>
                </Alert>
              ) : prediction ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Badge
                      variant={prediction.prediction === "Scam" ? "destructive" : "default"}
                      className="text-lg px-4 py-2"
                    >
                      {prediction.prediction}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Confidence</p>
                      <p className="text-2xl font-bold">{(prediction.confidence * 100).toFixed(1)}%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Risk Level</p>
                      <Badge
                        variant={
                          prediction.risk_level === "High"
                            ? "destructive"
                            : prediction.risk_level === "Medium"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {prediction.risk_level}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Analysis Summary</h4>
                    <p className="text-sm text-gray-600">
                      Based on the case summary, amount lost, and historical patterns, our trained AI model has
                      classified this case as {prediction.prediction.toLowerCase()} with{" "}
                      {(prediction.confidence * 100).toFixed(1)}% confidence.
                    </p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
