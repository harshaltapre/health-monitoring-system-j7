"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Eye, EyeOff, Wifi, Activity } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApiKey {
  id: string
  key_name: string
  api_key: string
  device_type: string
  is_active: boolean
  created_at: string
}

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newKey, setNewKey] = useState({
    key_name: "",
    api_key: "",
    device_type: "esp32",
  })
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase.from("api_keys").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setApiKeys(data || [])
    } catch (error) {
      console.error("[v0] Error fetching API keys:", error)
      toast({
        title: "Error",
        description: "Failed to load API keys",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addApiKey = async () => {
    if (!newKey.key_name || !newKey.api_key) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsAdding(true)
    try {
      const { error } = await supabase.from("api_keys").insert([newKey])

      if (error) throw error

      toast({
        title: "Success",
        description: "API key added successfully",
      })

      setNewKey({ key_name: "", api_key: "", device_type: "esp32" })
      fetchApiKeys()
    } catch (error) {
      console.error("[v0] Error adding API key:", error)
      toast({
        title: "Error",
        description: "Failed to add API key",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const deleteApiKey = async (id: string) => {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Success",
        description: "API key deleted successfully",
      })
      fetchApiKeys()
    } catch (error) {
      console.error("[v0] Error deleting API key:", error)
      toast({
        title: "Error",
        description: "Failed to delete API key",
        variant: "destructive",
      })
    }
  }

  const toggleKeyVisibility = (id: string) => {
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your device connections and API keys</p>
      </div>

      {/* Add New API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Device API Key
          </CardTitle>
          <CardDescription>Connect your ESP32 or other monitoring devices for real-time data streaming</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="key-name">Device Name</Label>
              <Input
                id="key-name"
                placeholder="My ESP32 ECG Monitor"
                value={newKey.key_name}
                onChange={(e) => setNewKey((prev) => ({ ...prev, key_name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="device-type">Device Type</Label>
              <Select
                value={newKey.device_type}
                onValueChange={(value) => setNewKey((prev) => ({ ...prev, device_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="esp32">ESP32</SelectItem>
                  <SelectItem value="thingspeak">ThingSpeak</SelectItem>
                  <SelectItem value="custom">Custom Device</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                placeholder="Enter your API key"
                value={newKey.api_key}
                onChange={(e) => setNewKey((prev) => ({ ...prev, api_key: e.target.value }))}
              />
            </div>
          </div>
          <Button onClick={addApiKey} disabled={isAdding}>
            {isAdding ? "Adding..." : "Add API Key"}
          </Button>
        </CardContent>
      </Card>

      {/* Existing API Keys */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connected Devices
          </CardTitle>
          <CardDescription>Manage your connected monitoring devices and their API keys</CardDescription>
        </CardHeader>
        <CardContent>
          {apiKeys.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No devices connected yet</p>
              <p className="text-sm text-muted-foreground">
                Add your first device above to start receiving real-time health data
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{key.key_name}</h3>
                      <Badge variant={key.is_active ? "default" : "secondary"}>
                        {key.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {key.device_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {showKeys[key.id] ? key.api_key : "•".repeat(20)}
                      </code>
                      <Button variant="ghost" size="sm" onClick={() => toggleKeyVisibility(key.id)}>
                        {showKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Added {new Date(key.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteApiKey(key.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device Integration Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Integration Instructions</CardTitle>
          <CardDescription>How to connect your ESP32 device for ECG monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">ESP32 Setup:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
              <li>Connect your ECG sensor to ESP32 analog pins</li>
              <li>Use the API key above in your ESP32 code</li>
              <li>
                Send POST requests to: <code className="bg-background px-1 rounded">/api/health-data</code>
              </li>
              <li>Include your API key in the Authorization header</li>
              <li>Send ECG data in JSON format with timestamp</li>
            </ol>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Sample ESP32 Code:</h4>
            <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
              {`// ESP32 ECG Data Transmission
#include <WiFi.h>
#include <HTTPClient.h>

void sendECGData(float ecgValue) {
  HTTPClient http;
  http.begin("https://your-app.vercel.app/api/health-data");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Authorization", "Bearer YOUR_API_KEY");
  
  String payload = "{\\"metric_type\\":\\"ecg\\",\\"value\\":" + String(ecgValue) + "}";
  int httpResponseCode = http.POST(payload);
  http.end();
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
