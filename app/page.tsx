import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Shield, Users, Activity, Baby, CheckCircle, Star, ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-svh">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">HealthMonitor</span>
          </div>
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#monitoring" className="text-sm font-medium hover:text-primary transition-colors">
              Baby Monitoring
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <Badge variant="secondary" className="mb-4">
              <Shield className="mr-2 h-3 w-3" />
              Trusted by 10,000+ Healthcare Professionals
            </Badge>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-balance">
                Monitor Health with
                <span className="text-primary"> Confidence</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-pretty leading-relaxed">
                Professional health monitoring system for patients and caretakers. Track vital signs, manage care, and
                ensure safety with specialized baby monitoring featuring gentle, delicate frequency ranges.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/auth/sign-up">
                  Start Monitoring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                <Link href="#demo">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Demo
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>24/7 Monitoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-accent" />
                <span>Real-time Alerts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-balance">
              Complete Health Monitoring Solution
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg mt-4 text-pretty">
              Everything you need to monitor, track, and manage health with professional-grade tools
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant="secondary">For Patients</Badge>
                </div>
                <CardTitle className="text-xl">Patient Monitoring</CardTitle>
                <CardDescription className="text-base">
                  Comprehensive health tracking with intuitive dashboards and real-time monitoring capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Vital signs tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Medication reminders</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Health history charts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Personalized insights</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Users className="h-6 w-6 text-secondary" />
                  </div>
                  <Badge variant="secondary">For Caretakers</Badge>
                </div>
                <CardTitle className="text-xl">Caretaker Dashboard</CardTitle>
                <CardDescription className="text-base">
                  Professional tools for healthcare providers to monitor patients and coordinate care effectively
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Multi-patient management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Care coordination tools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Alert management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Progress tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                    <Baby className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                  </div>
                  <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">Specialized</Badge>
                </div>
                <CardTitle className="text-xl">Baby Monitoring</CardTitle>
                <CardDescription className="text-base">
                  Gentle monitoring with adjusted frequency ranges and alert thresholds designed for infant care
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Delicate frequency monitoring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Baby-safe thresholds</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Gentle sensor technology</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    <span>Instant safety alerts</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Baby Monitoring Highlight */}
      <section id="monitoring" className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                  <Baby className="mr-2 h-3 w-3" />
                  Specialized Baby Care
                </Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-balance">
                  Gentle Monitoring for Delicate Lives
                </h2>
                <p className="text-muted-foreground md:text-lg text-pretty">
                  Our baby monitoring system uses specially calibrated sensors and gentle frequency ranges designed
                  specifically for infant safety and comfort.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-pink-100 dark:bg-pink-900 rounded">
                    <Heart className="h-4 w-4 text-pink-600 dark:text-pink-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Safe Heart Rate</h3>
                    <p className="text-sm text-muted-foreground">100-160 BPM range with gentle monitoring</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-1 bg-pink-100 dark:bg-pink-900 rounded">
                    <Activity className="h-4 w-4 text-pink-600 dark:text-pink-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Breathing Tracking</h3>
                    <p className="text-sm text-muted-foreground">30-60 BrPM with instant alerts</p>
                  </div>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  Start Baby Monitoring
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Card className="p-6 bg-gradient-to-br from-pink-50 to-blue-50 dark:from-pink-950/20 dark:to-blue-950/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Emma's Monitoring</h3>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <Heart className="h-5 w-5 mx-auto mb-1 text-red-500" />
                      <div className="text-lg font-bold">125</div>
                      <div className="text-xs text-muted-foreground">BPM</div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <Activity className="h-5 w-5 mx-auto mb-1 text-green-500" />
                      <div className="text-lg font-bold">42</div>
                      <div className="text-xs text-muted-foreground">BrPM</div>
                    </div>
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <Shield className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                      <div className="text-lg font-bold">98.2°F</div>
                      <div className="text-xs text-muted-foreground">Temp</div>
                    </div>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    Monitoring every 30 seconds • All vitals normal
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-balance">
              Trusted by Healthcare Professionals
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-lg mt-4">
              See what doctors, nurses, and families are saying about HealthMonitor
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "The baby monitoring feature has been a game-changer for our NICU. The gentle frequency monitoring
                  gives us peace of mind while ensuring patient comfort."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">DR</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Dr. Sarah Chen</div>
                    <div className="text-xs text-muted-foreground">Pediatric Specialist</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "Managing multiple patients has never been easier. The caretaker dashboard gives me a complete view of
                  all my patients' health status in real-time."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">MJ</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Maria Johnson</div>
                    <div className="text-xs text-muted-foreground">Registered Nurse</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "As a new parent, the baby monitoring system gives me confidence that my little one is safe. The
                  alerts are immediate and the interface is so easy to use."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold">JS</span>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">James Smith</div>
                    <div className="text-xs text-muted-foreground">Parent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-balance">Ready to Start Monitoring?</h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-lg">
              Join thousands of healthcare professionals and families who trust HealthMonitor for their health
              monitoring needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="/auth/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
                asChild
              >
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">HealthMonitor</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional health monitoring platform built with care for patients, caretakers, and families.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#monitoring" className="hover:text-foreground transition-colors">
                    Baby Monitoring
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-up" className="hover:text-foreground transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/help" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/status" className="hover:text-foreground transition-colors">
                    System Status
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/hipaa" className="hover:text-foreground transition-colors">
                    HIPAA Compliance
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-foreground transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© 2024 HealthMonitor. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                HIPAA Compliant
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                SOC 2 Certified
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
