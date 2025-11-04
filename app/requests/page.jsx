"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAllRequests, updateRequest } from "@/lib/mock-data"
import { ArrowLeft, Search, Eye, XCircle } from "lucide-react"
import { StageProgress } from "@/components/stage-progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function RequestsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const [cancelReason, setCancelReason] = useState("")
  const [requests, setRequests] = useState(getAllRequests())

  const filteredRequests = requests.filter(
    (req) =>
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.macAddress.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getOverallStatus = (request) => {
    if (request.networkApprovalStatus === "Rejected" || request.networkSecurityApprovalStatus === "Rejected") {
      return "Rejected"
    }
    if (request.networkApprovalStatus === "Cancelled" || request.networkSecurityApprovalStatus === "Cancelled") {
      return "Cancelled"
    }
    if (
      request.networkApprovalStatus === "Approved" &&
      request.networkSecurityApprovalStatus === "Approved" &&
      request.implementationStatus === "Completed"
    ) {
      return "Approved"
    }
    return "Pending Approval"
  }

  const getStatusBadge = (status) => {
    if (status === "Approved") {
      return <Badge className="bg-green-600 hover:bg-green-700">Approved</Badge>
    } else if (status === "Rejected" || status === "Cancelled") {
      return <Badge variant="destructive">{status}</Badge>
    } else {
      return <Badge className="bg-blue-600 hover:bg-blue-700">Pending Approval</Badge>
    }
  }

  const canCancelRequest = (request) => {
    const status = getOverallStatus(request)
    return status !== "Approved" && status !== "Rejected" && status !== "Cancelled"
  }

  const handleCancelRequest = (requestId) => {
    setSelectedRequestId(requestId)
    setCancelDialogOpen(true)
  }

  const confirmCancelRequest = () => {
    if (selectedRequestId) {
      updateRequest(selectedRequestId, {
        networkApprovalStatus: "Cancelled",
        networkSecurityApprovalStatus: "Cancelled",
        networkRemarks: cancelReason || "Request cancelled by user",
        networkSecurityRemarks: cancelReason || "Request cancelled by user",
      })
      setRequests(getAllRequests())
      setCancelDialogOpen(false)
      setSelectedRequestId(null)
      setCancelReason("")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" className="mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-2xl">All NAC Requests</CardTitle>
                <CardDescription>View and manage network access control requests</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Requester</TableHead>
                    <TableHead>MAC Address</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.requesterName}</TableCell>
                      <TableCell className="font-mono text-sm">{request.macAddress}</TableCell>
                      <TableCell>{request.dateOfRequest}</TableCell>
                      <TableCell>{getStatusBadge(getOverallStatus(request))}</TableCell>
                      <TableCell>
                        <StageProgress request={request} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/requests/${request.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          {canCancelRequest(request) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelRequest(request.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredRequests.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No requests found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Cancellation Reason (Optional)</Label>
              <Textarea
                id="cancelReason"
                placeholder="Enter reason for cancellation..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              No, Keep Request
            </Button>
            <Button variant="destructive" onClick={confirmCancelRequest}>
              Yes, Cancel Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
