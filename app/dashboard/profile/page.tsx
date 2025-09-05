import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Calendar, Heart, Pill } from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and health details</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input id="full-name" defaultValue={profile?.full_name || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={data.user.email || ""} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" type="tel" defaultValue={profile?.phone || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" defaultValue={profile?.date_of_birth || ""} />
            </div>
            <Button className="w-full">Update Information</Button>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your account status and role information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Account Type</span>
              <Badge variant="secondary" className="capitalize">
                {profile?.role || "Patient"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Member Since</span>
              <span className="text-sm text-muted-foreground">
                {new Date(profile?.created_at || "").toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Verified</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Verified
              </Badge>
            </div>
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full bg-transparent">
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
            <CardDescription>Contact information for emergencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="emergency-name">Contact Name</Label>
              <Input id="emergency-name" defaultValue={profile?.emergency_contact_name || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emergency-phone">Contact Phone</Label>
              <Input id="emergency-phone" type="tel" defaultValue={profile?.emergency_contact_phone || ""} />
            </div>
            <Button className="w-full">Update Emergency Contact</Button>
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Medical Information
            </CardTitle>
            <CardDescription>Your health conditions and medications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="conditions">Medical Conditions</Label>
              <Textarea
                id="conditions"
                placeholder="List any medical conditions..."
                defaultValue={profile?.medical_conditions?.join(", ") || ""}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                placeholder="List current medications..."
                defaultValue={profile?.medications?.join(", ") || ""}
              />
            </div>
            <Button className="w-full">Update Medical Information</Button>
          </CardContent>
        </Card>
      </div>

      {/* Health Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Health Summary</CardTitle>
          <CardDescription>Overview of your health profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 border rounded-lg">
              <Heart className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Heart Health</h3>
              <p className="text-sm text-muted-foreground">Average: 72 BPM</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Measurements</h3>
              <p className="text-sm text-muted-foreground">Last: Today</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Pill className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold">Medications</h3>
              <p className="text-sm text-muted-foreground">{profile?.medications?.length || 0} active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
