"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, AlertTriangle, BookOpen, HelpCircle } from "lucide-react"

export default function Policies() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Policies & How to Use</h1>
          <p className="text-gray-600">Important information about using the Malaysia Fraud Detection System</p>
        </div>

        <div className="grid gap-6">
          {/* Project Background */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Project Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                The Malaysia Fraud Detection System is an advanced AI-powered platform designed to help identify and
                analyze fraudulent activities across Malaysia. This system uses machine learning algorithms trained on
                historical fraud data to provide accurate predictions and insights.
              </div>
              <div>
                Our mission is to protect Malaysian citizens and businesses from fraud by providing law enforcement
                agencies, financial institutions, and other stakeholders with powerful tools for fraud detection and
                prevention.
              </div>
            </CardContent>
          </Card>

          {/* Data Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Data Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Primary Data Sources:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Royal Malaysia Police (PDRM) fraud reports</li>
                  <li>Bank Negara Malaysia financial crime data</li>
                  <li>Malaysian Communications and Multimedia Commission (MCMC) reports</li>
                  <li>Commercial Crime Investigation Department records</li>
                  <li>Public fraud reports and news articles</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Processing:</h3>
                <p className="text-gray-700">
                  All data is anonymized and processed in compliance with the Personal Data Protection Act 2010 (PDPA).
                  Personal identifiers are removed or encrypted to protect individual privacy while maintaining the
                  analytical value of the data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How to Interpret Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                How to Interpret the Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Dashboard Statistics</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">Total Reports</h4>
                    <p className="text-sm text-gray-600">
                      The total number of fraud cases reported and analyzed by the system within the selected time
                      period.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Detection Rate</h4>
                    <p className="text-sm text-gray-600">
                      The percentage of cases correctly identified as fraudulent by our AI model, based on validation
                      against known outcomes.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium">Financial Loss</h4>
                    <p className="text-sm text-gray-600">
                      The total monetary amount lost to fraud cases within the reporting period, expressed in Malaysian
                      Ringgit (RM).
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">AI Prediction Confidence Levels</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">High Risk (80-100%)</span>
                    <span className="text-sm text-red-700">Very likely to be fraudulent</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="font-medium">Medium Risk (60-79%)</span>
                    <span className="text-sm text-yellow-700">Requires further investigation</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium">Low Risk (0-59%)</span>
                    <span className="text-sm text-green-700">Likely to be legitimate</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Regional Analysis</h3>
                <p className="text-sm text-gray-600 mb-2">
                  State-wise fraud statistics help identify regional patterns and hotspots. Consider these factors when
                  interpreting regional data:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Population density and urbanization levels</li>
                  <li>Economic activity and business concentration</li>
                  <li>Digital literacy and internet penetration rates</li>
                  <li>Local law enforcement reporting practices</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Terms of Use */}
          <Card>
            <CardHeader>
              <CardTitle>Terms of Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Authorized Use</h3>
                <p className="text-sm text-gray-700">
                  This system is intended for use by authorized personnel including law enforcement officers, financial
                  institution staff, government officials, and approved researchers. Unauthorized access or misuse of
                  this system is strictly prohibited.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Confidentiality</h3>
                <p className="text-sm text-gray-700">
                  Users must maintain the confidentiality of all data accessed through this system. Information should
                  not be shared with unauthorized parties or used for purposes other than fraud prevention and
                  investigation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">User Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Maintain secure login credentials</li>
                  <li>Report suspected system vulnerabilities</li>
                  <li>Use the system only for legitimate purposes</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center text-yellow-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Important Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-yellow-800">
              <div>
                <h3 className="font-semibold mb-2">Prediction Accuracy</h3>
                <p className="text-sm">
                  While our AI model achieves high accuracy rates, no automated system is 100% accurate. All predictions
                  should be used as guidance and supplemented with human judgment and additional investigation where
                  appropriate.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Legal Considerations</h3>
                <p className="text-sm">
                  This system provides analytical insights and should not be used as the sole basis for legal action.
                  All findings should be verified through proper investigative procedures and due process before any
                  legal proceedings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Limitations</h3>
                <p className="text-sm">
                  The system's effectiveness depends on the quality and completeness of input data. Results may be
                  affected by reporting biases, data gaps, or changes in fraud patterns not yet captured in the training
                  data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Support & Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium">Technical Support</h4>
                  <p className="text-sm text-gray-600">
                    For technical issues or system problems, contact: support@frauddetection.gov.my
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Data Inquiries</h4>
                  <p className="text-sm text-gray-600">
                    For questions about data sources or methodology: data@frauddetection.gov.my
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">System Administration</h4>
                  <p className="text-sm text-gray-600">
                    For user access requests or permissions: admin@frauddetection.gov.my
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
