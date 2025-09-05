"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Baby, Heart, Thermometer, Activity, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewBabyMonitoringPage() {
  const [sessionName, setSessionName] = useState("")
  const [selectedBaby, setSelectedBaby] = useState("")
  const [frequency, setFrequency] = useState([30])
  const [heartRateMin, setHeartRateMin] = useState([100])
  const [heartRateMax, setHeartRateMax] = useState([160])
  const [tempMin, setTempMin] = useState([96.8])
  const [tempMax, setTempMax] = useState([99.5])
  const [breathingMin, setBreathingMin] = useState([30])
  const [breathingMax, setBreathingMax] = useState([60])

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/caretaker/baby-monitoring">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Monitoring
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Baby Monitoring Session</h1>
          <p className="text-muted-foreground">Set up gentle monitoring with baby-safe parameters</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Session Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Baby className="h-5 w-5" />
              Session Details
            </CardTitle>
            <CardDescription>Configure the monitoring session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="session-name">Session Name</Label>
              <Input
                id="session-name"
                placeholder="e.g., Emma's Nap Time"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="baby-select">Select Baby</Label>
              <Select value={selectedBaby} onValueChange={setSelectedBaby}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a baby to monitor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baby1">Emma Johnson</SelectItem>
                  <SelectItem value="baby2">Liam Smith</SelectItem>
                  <SelectItem value="baby3">Olivia Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Monitoring Frequency: {frequency[0]} seconds</Label>
              <Slider value={frequency} onValueChange={setFrequency} max={120} min={10} step={5} className="w-full" />
              <p className="text-xs text-muted-foreground">
                Gentle monitoring interval (recommended: 30-60 seconds for babies)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Alert Thresholds */}
        <Card>
          <CardHeader>
            <CardTitle>Safety Thresholds</CardTitle>
            <CardDescription>Set baby-safe alert ranges</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Heart Rate */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <Label className="font-medium">Heart Rate (BPM)</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Minimum: {heartRateMin[0]}</Label>
                  <Slider value={heartRateMin} onValueChange={setHeartRateMin} max={120} min={80} step={5} />
                </div>
                <div>
                  <Label className="text-xs">Maximum: {heartRateMax[0]}</Label>
                  <Slider value={heartRateMax} onValueChange={setHeartRateMax} max={200} min={140} step={5} />
                </div>
              </div>
            </div>

            {/* Temperature */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-blue-500" />
                <Label className="font-medium">Temperature (°F)</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Minimum: {tempMin[0]}°F</Label>
                  <Slider value={tempMin} onValueChange={setTempMin} max={98} min={95} step={0.1} />
                </div>
                <div>
                  <Label className="text-xs">Maximum: {tempMax[0]}°F</Label>
                  <Slider value={tempMax} onValueChange={setTempMax} max={101} min={99} step={0.1} />
                </div>
              </div>
            </div>

            {/* Breathing Rate */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-green-500" />
                <Label className="font-medium">Breathing Rate (BrPM)</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Minimum: {breathingMin[0]}</Label>
                  <Slider value={breathingMin} onValueChange={setBreathingMin} max={40} min={20} step={2} />
                </div>
                <div>
                  <Label className="text-xs">Maximum: {breathingMax[0]}</Label>
                  <Slider value={breathingMax} onValueChange={setBreathingMax} max={80} min={50} step={2} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle>Baby Monitoring Safety Guidelines</CardTitle>
          <CardDescription>Important considerations for infant monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Gentle Monitoring</h4>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Non-invasive sensors designed specifically for delicate baby skin
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100">Safe Frequencies</h4>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                Monitoring intervals optimized for baby comfort and safety
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100">Instant Alerts</h4>
              <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                Immediate notifications for any values outside safe ranges
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button size="lg" className="flex-1">
          Start Monitoring Session
        </Button>
        <Button variant="outline" size="lg">
          Save as Template
        </Button>
      </div>
    </div>
  )
}
