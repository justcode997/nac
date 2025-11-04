"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, List, Shield } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 font-bold text-4xl text-foreground text-balance">MAC Whitelisting Request Portal</h1>
        </div>

        {/* Action Cards */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => router.push("/create")}>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <Plus className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Create New Request</CardTitle>
              <CardDescription>Submit a new NAC exclusion request for device network access</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer transition-shadow hover:shadow-lg" onClick={() => router.push("/requests")}>
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <List className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>View All Requests</CardTitle>
              <CardDescription>Review, edit, and manage existing NAC requests and approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full bg-transparent">
                View Requests
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="mb-2">Two-Level Approval Process</CardTitle>
                <CardDescription className="text-foreground/70">
                  All requests require approval from both Network and Network Security teams before implementation.
                  Approved requests are automatically processed at midnight for device whitelisting.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  )
}
