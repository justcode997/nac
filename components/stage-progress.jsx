"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock, FileText, Shield, Network, Wrench } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function StageProgress({ request }) {
  const [selectedStage, setSelectedStage] = useState(null)

  // Define stages with their status
  const stages = [
    {
      id: "request-sent",
      name: "Request Sent",
      icon: FileText,
      status: "Completed",
      date: request.dateOfRequest,
      approver: request.requesterName,
      remarks: "Request submitted successfully",
    },
    {
      id: "network-approval",
      name: "Network Approval",
      icon: Network,
      status: request.networkApprovalStatus,
      date: request.networkApprovalDate,
      approver: request.networkApproverName,
      remarks: request.networkRemarks || request.networkRejectionReason,
    },
    {
      id: "network-security-approval",
      name: "Network Security Approval",
      icon: Shield,
      status: request.networkSecurityApprovalStatus,
      date: request.networkSecurityApprovalDate,
      approver: request.networkSecurityApproverName,
      remarks: request.networkSecurityRemarks || request.networkSecurityRejectionReason,
    },
    {
      id: "implementation",
      name: "Implementation",
      icon: Wrench,
      status: request.implementationStatus,
      date: request.implementationDate,
      approver: "System",
      remarks: request.implementationStatus === "Completed" ? "Implementation completed" : "Awaiting implementation",
    },
  ]

  const getStageIcon = (stage) => {
    const Icon = stage.icon
    if (stage.status === "Approved" || stage.status === "Completed") {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />
    } else if (stage.status === "Rejected" || stage.status === "Cancelled") {
      return <Circle className="h-5 w-5 text-red-600" />
    } else {
      return <Clock className="h-5 w-5 text-blue-600" />
    }
  }

  const getStatusBadge = (status) => {
    if (status === "Approved" || status === "Completed") {
      return <Badge className="bg-green-600 hover:bg-green-700">{status}</Badge>
    } else if (status === "Rejected" || status === "Cancelled") {
      return <Badge variant="destructive">{status}</Badge>
    } else {
      return <Badge className="bg-blue-600 hover:bg-blue-700">{status}</Badge>
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center">
            <button
              onClick={() => setSelectedStage(stage)}
              className="flex flex-col items-center gap-1 transition-opacity hover:opacity-80"
              title={stage.name}
            >
              {getStageIcon(stage)}
              <span className="text-xs text-muted-foreground hidden sm:block">{stage.name.split(" ")[0]}</span>
            </button>
            {index < stages.length - 1 && (
              <div
                className={`mx-2 h-0.5 w-8 ${
                  stage.status === "Approved" || stage.status === "Completed" ? "bg-green-600" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Dialog open={selectedStage !== null} onOpenChange={() => setSelectedStage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedStage?.name}</DialogTitle>
            <DialogDescription>Stage details and information</DialogDescription>
          </DialogHeader>
          {selectedStage && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                {getStatusBadge(selectedStage.status)}
              </div>
              {selectedStage.date && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Date</p>
                  <p className="text-sm font-medium">{selectedStage.date}</p>
                </div>
              )}
              {selectedStage.approver && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Approver</p>
                  <p className="text-sm font-medium">{selectedStage.approver}</p>
                </div>
              )}
              {selectedStage.remarks && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Remarks</p>
                  <p className="text-sm">{selectedStage.remarks}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
