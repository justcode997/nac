"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createRequest } from "@/lib/mock-data"
import { ArrowLeft, Upload } from "lucide-react"
import { MacAddressInput } from "@/components/mac-address-input"

export default function CreateRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [fileName, setFileName] = useState("")
  const [formData, setFormData] = useState({
    lob: "",
    country: "",
    location: "",
    requesterName: "",
    requesterEmail: "",
    requesterContact: "",
    businessSystemOwner: "",
    technologySystemOwner: "",
    nacExclusionJustification: "",
    action: "",
    typeOfDevice: "",
    macAddress: "",
    iotSecurityStandard: false,
  })

  const lobOptions = ["CBGT", "CST", "DBSV", "HR", "IBGT", "ITT", "TS", "T&M", "LCS"]
  const countryOptions = [
    "China",
    "Hong Kong",
    "India",
    "Indonesia",
    "Taiwan",
    "Singapore",
    "ICIS (DAH2 etc)",
    "Thailand",
  ]
  const locationOptions = {
    China: ["CN-Branch", "CN-Building", "CN-SJV", "CN-DTC"],
    "Hong Kong": ["HK-Branch", "HK-Building"],
    India: ["INDIA-Branch", "INDIA-Building"],
    Indonesia: ["INDO-Branch", "INDO-Building"],
    Taiwan: ["TW-Branch", "TW-Building"],
    Singapore: ["SG-Branch", "SG-Building"],
    "ICIS (DAH2 etc)": ["ICIS-Branch", "ICIS-Building"],
    Thailand: ["TH-Branch", "TH-Building"],
  }
  const actionOptions = ["Add", "Remove", "Blacklist"]
  const deviceTypeOptions = [
    "Device not listed",
    "Access Point",
    "ATM",
    "CCTV",
    "Security Door",
    "DVR",
    "EQMS",
    "Imaging Dongle",
    "IPC Trader Phones",
    "Printer",
    "SCCM",
    "Smart Locker Controller",
    "TAU",
    "Video Conferencing Devices",
    "Wallboard",
  ]

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
    }
  }

  const validateMacAddress = (mac) => {
    const macRegex = /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/
    return macRegex.test(mac)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate MAC address
    if (!validateMacAddress(formData.macAddress)) {
      toast({
        title: "Invalid MAC Address",
        description: "Please enter a valid MAC address in format AA:BB:CC:DD:EE:FF",
        variant: "destructive",
      })
      return
    }

    // Create request
    const newRequest = createRequest({
      ...formData,
      attachmentName: fileName || "No file attached",
    })

    toast({
      title: "Request Created Successfully",
      description: `Request ID: ${newRequest.id}`,
    })

    router.push("/requests")
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">New Request</CardTitle>
            <CardDescription>Submit a new Network Access Control exclusion request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Line of Business, Country, Location */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="lob">Line of Business *</Label>
                  <Select value={formData.lob} onValueChange={(value) => handleChange("lob", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select LOB" />
                    </SelectTrigger>
                    <SelectContent>
                      {lobOptions.map((lob) => (
                        <SelectItem key={lob} value={lob}>
                          {lob}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select value={formData.country} onValueChange={(value) => handleChange("country", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryOptions.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => handleChange("location", value)}
                    required
                    disabled={!formData.country}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.country &&
                        locationOptions[formData.country]?.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                <div className="space-y-2">
                  <Label htmlFor="action">Action *</Label>
                  <Select value={formData.action} onValueChange={(value) => handleChange("action", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Action" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionOptions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="typeOfDevice">Type of Device *</Label>
                  <Select
                    value={formData.typeOfDevice}
                    onValueChange={(value) => handleChange("typeOfDevice", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Device Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypeOptions.map((device) => (
                        <SelectItem key={device} value={device}>
                          {device}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 min-w-fit">
                  <MacAddressInput
                    value={formData.macAddress}
                    onChange={(value) => handleChange("macAddress", value)}
                    required
                  />
                </div>
              </div>

              {/* Requester Information */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="requesterName">Requester Name *</Label>
                  <Input
                    id="requesterName"
                    value={formData.requesterName}
                    onChange={(e) => handleChange("requesterName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requesterEmail">Email *</Label>
                  <Input
                    id="requesterEmail"
                    type="email"
                    value={formData.requesterEmail}
                    onChange={(e) => handleChange("requesterEmail", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requesterContact">Contact *</Label>
                  <Input
                    id="requesterContact"
                    value={formData.requesterContact}
                    onChange={(e) => handleChange("requesterContact", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* System Owners */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessSystemOwner">Business System Owner *</Label>
                  <Input
                    id="businessSystemOwner"
                    value={formData.businessSystemOwner}
                    onChange={(e) => handleChange("businessSystemOwner", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technologySystemOwner">Technology System Owner *</Label>
                  <Input
                    id="technologySystemOwner"
                    value={formData.technologySystemOwner}
                    onChange={(e) => handleChange("technologySystemOwner", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">Email Approval Attachment *</Label>
                <div className="flex items-center gap-4">
                  <Input id="file" type="file" onChange={handleFileChange} className="hidden" />
                  <Button type="button" variant="outline" onClick={() => document.getElementById("file").click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                  {fileName && <span className="text-muted-foreground text-sm">{fileName}</span>}
                </div>
              </div>

              {/* IoT Security Standard Acknowledgement */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="iotSecurityStandard"
                  checked={formData.iotSecurityStandard}
                  onCheckedChange={(checked) => handleChange("iotSecurityStandard", checked)}
                />
                <Label htmlFor="iotSecurityStandard" className="font-normal text-sm">
                  I acknowledge the Internet of Things Security Standard *
                </Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" variant="secondary" className="flex-1" disabled={!formData.iotSecurityStandard}>
                  Submit Request
                </Button>
                <Button type="button" variant="outline" onClick={() => router.push("/")}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
