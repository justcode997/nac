"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { getRequestById } from "@/lib/mock-data"
import { ArrowLeft } from "lucide-react"

export default function RequestDetailClient({ id }) {
  const router = useRouter()
  const [request] = useState(getRequestById(id))

  if (!request) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Request not found</p>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    if (status === "Approved") {
      return <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>
    } else if (status === "Pending" || status === "Pending Approval") {
      return <Badge className="bg-blue-600 hover:bg-blue-700">{status}</Badge>
    } else if (status === "Rejected" || status === "Cancelled") {
      return <Badge className="bg-red-600 hover:bg-red-700">{status}</Badge>
    }
    return <Badge>{status}</Badge>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/requests")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Requests
        </Button>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <CardTitle className="text-2xl">{request.id}</CardTitle>
                  <CardDescription>Request Details</CardDescription>
                </div>
                <div className="flex gap-3">
                  {getStatusBadge(
                    request.networkApprovalStatus === "Approved" && request.networkSecurityApprovalStatus === "Approved"
                      ? "Approved"
                      : "Pending Approval",
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Line of Business, Country, Location */}
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <Label className="text-muted-foreground">Line of Business</Label>
                  <p className="mt-1.5 font-medium">{request.lob}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Country</Label>
                  <p className="mt-1.5 font-medium">{request.country}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Location</Label>
                  <p className="mt-1.5 font-medium">{request.location}</p>
                </div>
              </div>

              {/* Action, Type of Device, MAC Address */}
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <Label className="text-muted-foreground">Action</Label>
                  <p className="mt-1.5 font-medium">{request.action}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Type of Device</Label>
                  <p className="mt-1.5 font-medium">{request.typeOfDevice}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">MAC Address</Label>
                  <p className="mt-1.5 font-medium font-mono">{request.macAddress}</p>
                </div>
              </div>

              {/* Requester Name, Email, Contact */}
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <Label className="text-muted-foreground">Requester Name</Label>
                  <p className="mt-1.5 font-medium">{request.requesterName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="mt-1.5 font-medium">{request.requesterEmail}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Contact</Label>
                  <p className="mt-1.5 font-medium">{request.requesterContact}</p>
                </div>
              </div>

              {/* Business System Owner, Technology System Owner */}
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Business System Owner</Label>
                  <p className="mt-1.5 font-medium">{request.businessSystemOwner}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Technology System Owner</Label>
                  <p className="mt-1.5 font-medium">{request.technologySystemOwner}</p>
                </div>
              </div>

              {/* Email Approval Attachment */}
              <div>
                <Label className="text-muted-foreground">Email Approval Attachment</Label>
                <p className="mt-1.5 font-medium">{request.attachmentName}</p>
              </div>

              {/* Acknowledgement */}
              <div>
                <Label className="text-muted-foreground">IoT Security Standard Acknowledgement</Label>
                <p className="mt-1.5 font-medium">
                  {request.iotSecurityStandard ? "Acknowledged" : "Not Acknowledged"}
                </p>
              </div>

              {/* Date of Request */}
              <div>
                <Label className="text-muted-foreground">Date of Request</Label>
                <p className="mt-1.5 font-medium">{request.dateOfRequest}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
