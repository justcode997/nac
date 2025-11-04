// Mock data store for NAC requests
export const mockRequests = [
  {
    id: "REQ-001",
    dateOfRequest: "2025-01-15",
    lob: "CBGT",
    country: "Singapore",
    location: "SG-Branch",
    requesterName: "John Tan",
    requesterEmail: "john.tan@dbs.com",
    requesterContact: "+65 9123 4567",
    businessSystemOwner: "Sarah Lee",
    technologySystemOwner: "Michael Wong",
    nacExclusionJustification: "Legacy CCTV system requires network access for security monitoring",
    action: "Add",
    typeOfDevice: "CCTV",
    macAddress: "AA:BB:CC:DD:EE:FF",
    iotSecurityStandard: true,
    networkApproverName: "David Chen",
    networkApprovalStatus: "Approved",
    networkApprovalDate: "2025-01-16",
    networkRejectionReason: "",
    networkRemarks: "Approved for security purposes",
    networkSecurityApproverName: "Lisa Kumar",
    networkSecurityApprovalStatus: "Approved",
    networkSecurityApprovalDate: "2025-01-17",
    networkSecurityRejectionReason: "",
    networkSecurityRemarks: "Security standards met",
    implementationDate: "2025-01-18",
    implementationStatus: "Completed",
    attachmentName: "approval-email.pdf",
  },
  // {
  //   id: "REQ-002",
  //   dateOfRequest: "2025-01-20",
  //   lob: "ITT",
  //   country: "Hong Kong",
  //   location: "HK-Building",
  //   requesterName: "Emily Zhang",
  //   requesterEmail: "emily.zhang@dbs.com",
  //   requesterContact: "+852 9876 5432",
  //   businessSystemOwner: "Robert Lim",
  //   technologySystemOwner: "Angela Ng",
  //   nacExclusionJustification: "New printer for trading floor requires network connectivity",
  //   action: "Add",
  //   typeOfDevice: "Printer",
  //   macAddress: "11:22:33:44:55:66",
  //   iotSecurityStandard: true,
  //   networkApproverName: "",
  //   networkApprovalStatus: "Pending",
  //   networkApprovalDate: "",
  //   networkRejectionReason: "",
  //   networkRemarks: "",
  //   networkSecurityApproverName: "",
  //   networkSecurityApprovalStatus: "Pending",
  //   networkSecurityApprovalDate: "",
  //   networkSecurityRejectionReason: "",
  //   networkSecurityRemarks: "",
  //   implementationDate: "",
  //   implementationStatus: "Pending",
  //   attachmentName: "printer-approval.pdf",
  // },
  {
    id: "REQ-003",
    dateOfRequest: "2025-01-22",
    lob: "DBSV",
    country: "India",
    location: "INDIA-Branch",
    requesterName: "Raj Patel",
    requesterEmail: "raj.patel@dbs.com",
    requesterContact: "+91 98765 43210",
    businessSystemOwner: "Priya Sharma",
    technologySystemOwner: "Amit Kumar",
    nacExclusionJustification: "Access Point for new office wing",
    action: "Add",
    typeOfDevice: "Access Point",
    macAddress: "AA:11:BB:22:CC:33",
    iotSecurityStandard: true,
    networkApproverName: "Kevin Tan",
    networkApprovalStatus: "Approved",
    networkApprovalDate: "2025-01-23",
    networkRejectionReason: "",
    networkRemarks: "Infrastructure upgrade approved",
    networkSecurityApproverName: "",
    networkSecurityApprovalStatus: "Pending",
    networkSecurityApprovalDate: "",
    networkSecurityRejectionReason: "",
    networkSecurityRemarks: "",
    implementationDate: "",
    implementationStatus: "Pending",
    attachmentName: "access-point-approval.pdf",
  },
]

// Helper functions
export function getAllRequests() {
  return mockRequests
}

export function getRequestById(id) {
  return mockRequests.find((req) => req.id === id)
}

export function updateRequest(id, updates) {
  const index = mockRequests.findIndex((req) => req.id === id)
  if (index !== -1) {
    mockRequests[index] = { ...mockRequests[index], ...updates }
    return mockRequests[index]
  }
  return null
}

export function createRequest(requestData) {
  const newId = `REQ-${String(mockRequests.length + 1).padStart(3, "0")}`
  const newRequest = {
    id: newId,
    dateOfRequest: new Date().toISOString().split("T")[0],
    networkApproverName: "",
    networkApprovalStatus: "Pending",
    networkApprovalDate: "",
    networkRejectionReason: "",
    networkRemarks: "",
    networkSecurityApproverName: "",
    networkSecurityApprovalStatus: "Pending",
    networkSecurityApprovalDate: "",
    networkSecurityRejectionReason: "",
    networkSecurityRemarks: "",
    implementationDate: "",
    implementationStatus: "Pending",
    ...requestData,
  }
  mockRequests.push(newRequest)
  return newRequest
}
