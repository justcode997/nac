"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getAllRequests, updateRequest } from "@/lib/mock-data"
import { ArrowLeft, Search, CheckCircle, XCircle, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ApprovalsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [approvalType, setApprovalType] = useState("") // 'network' or 'networkSecurity'
  const [approvalAction, setApprovalAction] = useState("") // 'approve' or 'reject'
  const [remarks, setRemarks] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")

  const requests = getAllRequests()

  // Filter requests that need approval
  const pendingRequests = requests.filter(
    (req) => req.networkApprovalStatus === "Pending" || req.networkSecurityApprovalStatus === "Pending",
  )

  const filteredRequests = pendingRequests.filter(
    (req) =>
      req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.macAddress.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleApprovalClick = (request, type, action) => {
    setSelectedRequest(request)
    setApprovalType(type)
    setApprovalAction(action)
    setRemarks("")
    setRejectionReason("")
    setShowApprovalDialog(true)
  }

  const handleSubmitApproval = () => {
    if (!selectedRequest) return

    const updates = {
      [`${approvalType}ApprovalStatus`]: approvalAction === "approve" ? "Approved" : "Rejected",
      [`${approvalType}ApprovalDate`]: new Date().toISOString().split("T")[0],
      [`${approvalType}ApproverName`]: "Current User", // In real app, this would be the logged-in user
      [`${approvalType}Remarks`]: remarks,
    }

    if (approvalAction === "reject") {
      updates[`${approvalType}RejectionReason`] = rejectionReason
    }

    updateRequest(selectedRequest.id, updates)

    toast({
      title: approvalAction === "approve" ? "Request Approved" : "Request Rejected",
      description: `${selectedRequest.id} has been ${approvalAction === "approve" ? "approved" : "rejected"} successfully.`,
    })

    setShowApprovalDialog(false)
    setSelectedRequest(null)
    router.refresh()
  }

  const getPendingApprovalType = (request) => {
    if (request.networkApprovalStatus === "Pending") {
      return "Network Approval"
    } else if (request.networkSecurityApprovalStatus === "Pending") {
      return "Network Security Approval"
    }
    return "N/A"
  }

  const canApprove = (request, type) => {
    if (type === "network") {
      return request.networkApprovalStatus === "Pending"
    } else if (type === "networkSecurity") {
      return request.networkApprovalStatus === "Approved" && request.networkSecurityApprovalStatus === "Pending"
    }
    return false
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
                <CardTitle className="text-2xl">Pending Approvals</CardTitle>
                <CardDescription>Review and approve network access control requests</CardDescription>
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
                    <TableHead>Pending Stage</TableHead>
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
                      <TableCell>
                        <Badge className="bg-blue-600 hover:bg-blue-700">{getPendingApprovalType(request)}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/requests/${request.id}`)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canApprove(request, "network") && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprovalClick(request, "network", "approve")}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleApprovalClick(request, "network", "reject")}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                          {canApprove(request, "networkSecurity") && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprovalClick(request, "networkSecurity", "approve")}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Approve
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleApprovalClick(request, "networkSecurity", "reject")}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredRequests.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">No pending approvals</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {approvalAction === "approve" ? "Approve" : "Reject"} Request {selectedRequest?.id}
            </DialogTitle>
            <DialogDescription>
              {approvalType === "network" ? "Network Approval" : "Network Security Approval"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {approvalAction === "reject" && (
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Please provide a reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                placeholder="Add any additional remarks..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmitApproval}
              disabled={approvalAction === "reject" && !rejectionReason.trim()}
              className={approvalAction === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {approvalAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
