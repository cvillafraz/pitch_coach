"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mic,
  Users,
  Building2,
  TrendingUp,
  Briefcase,
  Globe,
  Plus,
  Search,
  ArrowRight,
  User,
  Target,
} from "lucide-react"
import Link from "next/link"

const investorPersonas = [
  {
    id: "tech-vc",
    name: "Sarah Chen",
    title: "Partner at TechVentures",
    type: "VC Investor",
    focus: "Early-stage SaaS",
    personality: "Analytical, data-driven, asks tough questions about metrics and scalability",
    background: "Former product manager at Google, 8 years in VC",
    interests: ["B2B SaaS", "AI/ML", "Developer Tools"],
    investmentRange: "$1M - $10M",
    icon: TrendingUp,
    difficulty: "Advanced",
    color: "primary",
  },
  {
    id: "angel-investor",
    name: "Michael Rodriguez",
    title: "Serial Entrepreneur & Angel",
    type: "Angel Investor",
    focus: "Consumer & Mobile",
    personality: "Supportive, experience-focused, cares about team and market timing",
    background: "Founded 3 startups, 2 successful exits, active angel investor",
    interests: ["Consumer Apps", "E-commerce", "Fintech"],
    investmentRange: "$25K - $250K",
    icon: User,
    difficulty: "Beginner",
    color: "secondary",
  },
  {
    id: "corporate-buyer",
    name: "Jennifer Park",
    title: "VP of Innovation at Fortune 500",
    type: "Corporate Customer",
    focus: "Enterprise Solutions",
    personality: "Risk-averse, ROI-focused, needs clear business case and implementation plan",
    background: "15 years in enterprise software, leads digital transformation initiatives",
    interests: ["Enterprise Software", "Automation", "Security"],
    investmentRange: "$100K - $5M",
    icon: Building2,
    difficulty: "Intermediate",
    color: "primary",
  },
]

export default function PersonasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const filteredPersonas = investorPersonas.filter((persona) => {
    const matchesSearch =
      persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.focus.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || persona.type === selectedType
    const matchesDifficulty = selectedDifficulty === "all" || persona.difficulty === selectedDifficulty

    return matchesSearch && matchesType && matchesDifficulty
  })

  const uniqueTypes = [...new Set(investorPersonas.map((p) => p.type))]
  const uniqueDifficulties = [...new Set(investorPersonas.map((p) => p.difficulty))]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Mic className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Micdrop</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/practice">Practice</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Choose Your Investor Persona</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Practice with different types of investors to prepare for any scenario. Each persona has unique
            characteristics, questions, and expectations.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search personas by name, type, or focus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {uniqueDifficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Create Custom</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Custom Persona</DialogTitle>
                <DialogDescription>Design a custom investor persona tailored to your specific needs</DialogDescription>
              </DialogHeader>
              <CustomPersonaForm onClose={() => setIsCreateDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Personas Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonas.map((persona) => {
            const Icon = persona.icon
            return (
              <Card key={persona.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 bg-${persona.color}/10 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${persona.color}`} />
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge
                        variant={
                          persona.difficulty === "Beginner"
                            ? "secondary"
                            : persona.difficulty === "Intermediate"
                              ? "default"
                              : "outline"
                        }
                      >
                        {persona.difficulty}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {persona.type}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{persona.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-muted-foreground">
                    {persona.title}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Focus Area</p>
                    <p className="text-sm text-muted-foreground">{persona.focus}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Investment Range</p>
                    <p className="text-sm text-muted-foreground">{persona.investmentRange}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground mb-2">Interests</p>
                    <div className="flex flex-wrap gap-1">
                      {persona.interests.slice(0, 3).map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <Button className="w-full group-hover:bg-primary/90 transition-colors" asChild>
                      <Link
                        href={`/practice?persona=${persona.id}`}
                        className="flex items-center justify-center space-x-2"
                      >
                        <span>Practice with {persona.name.split(" ")[0]}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredPersonas.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No personas found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  )
}

function CustomPersonaForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    type: "",
    focus: "",
    personality: "",
    background: "",
    interests: "",
    investmentRange: "",
    difficulty: "Intermediate",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically save the custom persona
    console.log("Custom persona created:", formData)
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Alex Johnson"
            required
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Partner at ABC Ventures"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">Investor Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VC Investor">VC Investor</SelectItem>
              <SelectItem value="Angel Investor">Angel Investor</SelectItem>
              <SelectItem value="Corporate Customer">Corporate Customer</SelectItem>
              <SelectItem value="Growth VC">Growth VC</SelectItem>
              <SelectItem value="Industry Expert">Industry Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select
            value={formData.difficulty}
            onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="focus">Focus Area</Label>
        <Input
          id="focus"
          value={formData.focus}
          onChange={(e) => setFormData({ ...formData, focus: e.target.value })}
          placeholder="e.g., Early-stage B2B SaaS"
          required
        />
      </div>

      <div>
        <Label htmlFor="investmentRange">Investment Range</Label>
        <Input
          id="investmentRange"
          value={formData.investmentRange}
          onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
          placeholder="e.g., $1M - $10M"
          required
        />
      </div>

      <div>
        <Label htmlFor="interests">Interests (comma-separated)</Label>
        <Input
          id="interests"
          value={formData.interests}
          onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
          placeholder="e.g., AI/ML, Developer Tools, B2B SaaS"
        />
      </div>

      <div>
        <Label htmlFor="personality">Personality & Style</Label>
        <Textarea
          id="personality"
          value={formData.personality}
          onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
          placeholder="Describe their questioning style, personality traits, and what they focus on..."
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="background">Background</Label>
        <Textarea
          id="background"
          value={formData.background}
          onChange={(e) => setFormData({ ...formData, background: e.target.value })}
          placeholder="Their professional background and experience..."
          rows={2}
          required
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Create Persona</Button>
      </div>
    </form>
  )
}
