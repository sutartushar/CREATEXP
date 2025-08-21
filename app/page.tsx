"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Bell, Filter, Plus, ChevronDown, X } from "lucide-react"

interface Client {
  id: number
  name: string
  type: "Individual" | "Company"
  email: string
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}

const initialClients: Client[] = [
  {
    id: 20,
    name: "John Doe",
    type: "Individual",
    email: "johndoe@email.com",
    updatedBy: "hello world",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: 21,
    name: "Test Test",
    type: "Individual",
    email: "test@test.com",
    updatedBy: "hello world",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: 22,
    name: "Acme Corp",
    type: "Company",
    email: "contact@acme.com",
    updatedBy: "admin",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: 23,
    name: "Jane Smith",
    type: "Individual",
    email: "jane@example.com",
    updatedBy: "manager",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: 24,
    name: "Tech Solutions Inc",
    type: "Company",
    email: "info@techsolutions.com",
    updatedBy: "admin",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-02-20"),
  },
]

type SortField = "name" | "createdAt" | "updatedAt" | "id"
type SortDirection = "asc" | "desc"

interface SortConfig {
  field: SortField
  direction: SortDirection
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [activeTab, setActiveTab] = useState("All")
  const [sortMenuOpen, setSortMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [addClientOpen, setAddClientOpen] = useState(false)
  const [newClient, setNewClient] = useState({
    name: "",
    type: "Individual" as "Individual" | "Company",
    email: "",
    updatedBy: "current user",
  })

  const filteredClients = useMemo(() => {
    let filtered = clients

    // Filter by tab
    if (activeTab !== "All") {
      filtered = filtered.filter((client) => client.type === activeTab)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.id.toString().includes(searchQuery),
      )
    }

    return filtered
  }, [clients, activeTab, searchQuery])

  const sortedClients = useMemo(() => {
    if (!sortConfig) return filteredClients

    return [...filteredClients].sort((a, b) => {
      let aValue: any = a[sortConfig.field]
      let bValue: any = b[sortConfig.field]

      if (sortConfig.field === "createdAt" || sortConfig.field === "updatedAt") {
        aValue = aValue.getTime()
        bValue = bValue.getTime()
      } else if (sortConfig.field === "name") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }, [filteredClients, sortConfig])

  const handleSort = (field: SortField, direction: SortDirection) => {
    setSortConfig({ field, direction })
  }

  const clearSort = () => {
    setSortConfig(null)
  }

  const applySort = () => {
    setSortMenuOpen(false)
  }

  const handleAddClient = () => {
    if (!newClient.name || !newClient.email) {
      alert("Please fill in all required fields")
      return
    }

    const nextId = Math.max(...clients.map((c) => c.id)) + 1
    const now = new Date()

    const clientToAdd: Client = {
      id: nextId,
      name: newClient.name,
      type: newClient.type,
      email: newClient.email,
      updatedBy: newClient.updatedBy,
      createdAt: now,
      updatedAt: now,
    }

    setClients([...clients, clientToAdd])
    setNewClient({
      name: "",
      type: "Individual",
      email: "",
      updatedBy: "current user",
    })
    setAddClientOpen(false)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Clients</h1>

          <div className="flex items-center gap-3">
            {showSearch ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowSearch(false)
                    setSearchQuery("")
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(true)}>
                <Search className="h-5 w-5" />
              </Button>
            )}

            <div className="relative">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                2
              </Badge>
            </div>

            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>

            <Dialog open={addClientOpen} onOpenChange={setAddClientOpen}>
              <DialogTrigger asChild>
                <Button className="bg-black text-white hover:bg-gray-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Client Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter client name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Client Type</Label>
                    <Select
                      value={newClient.type}
                      onValueChange={(value: "Individual" | "Company") => setNewClient({ ...newClient, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Company">Company</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="updatedBy">Updated By</Label>
                    <Input
                      id="updatedBy"
                      placeholder="Enter your name"
                      value={newClient.updatedBy}
                      onChange={(e) => setNewClient({ ...newClient, updatedBy: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAddClientOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddClient} className="bg-black text-white hover:bg-gray-800">
                    Add Client
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-8 mb-6 border-b border-border">
          {["All", "Individual", "Company"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-black text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              <span className="ml-2 text-xs text-muted-foreground">
                ({tab === "All" ? clients.length : clients.filter((c) => c.type === tab).length})
              </span>
            </button>
          ))}
        </div>

        {searchQuery && (
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {sortedClients.length} results for "{searchQuery}"
          </div>
        )}

        {/* Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b border-border text-sm font-medium text-muted-foreground">
            <div className="col-span-1">Client ID</div>
            <div className="col-span-2">Client Name</div>
            <div className="col-span-2">Client Type</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1">S</div>
            <div className="col-span-2 flex items-center gap-2">
              <DropdownMenu open={sortMenuOpen} onOpenChange={setSortMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                    Sort By
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-80">
                  <div className="p-2">
                    <div className="space-y-3">
                      {/* Client Name */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border border-input ${
                              sortConfig?.field === "name" ? "bg-blue-600" : "bg-background"
                            }`}
                          ></div>
                          <span className="text-sm">Client Name</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 text-xs ${
                              sortConfig?.field === "name" && sortConfig?.direction === "asc" ? "text-blue-600" : ""
                            }`}
                            onClick={() => handleSort("name", "asc")}
                          >
                            A-Z
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 text-xs ${
                              sortConfig?.field === "name" && sortConfig?.direction === "desc" ? "text-blue-600" : ""
                            }`}
                            onClick={() => handleSort("name", "desc")}
                          >
                            Z-A
                          </Button>
                        </div>
                      </div>

                      {/* Created At */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border border-input ${
                              sortConfig?.field === "createdAt" ? "bg-blue-600" : "bg-background"
                            }`}
                          ></div>
                          <span className="text-sm">Created At</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 text-xs ${
                              sortConfig?.field === "createdAt" && sortConfig?.direction === "desc"
                                ? "text-blue-600"
                                : ""
                            }`}
                            onClick={() => handleSort("createdAt", "desc")}
                          >
                            Newest to Oldest
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 text-xs ${
                              sortConfig?.field === "createdAt" && sortConfig?.direction === "asc"
                                ? "text-blue-600"
                                : ""
                            }`}
                            onClick={() => handleSort("createdAt", "asc")}
                          >
                            Oldest to Newest
                          </Button>
                        </div>
                      </div>

                      {/* Updated At */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border border-input ${
                              sortConfig?.field === "updatedAt" ? "bg-blue-600" : "bg-background"
                            }`}
                          ></div>
                          <span className="text-sm">Updated At</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 text-xs ${
                              sortConfig?.field === "updatedAt" && sortConfig?.direction === "desc"
                                ? "text-blue-600"
                                : ""
                            }`}
                            onClick={() => handleSort("updatedAt", "desc")}
                          >
                            Newest to Oldest
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 text-xs ${
                              sortConfig?.field === "updatedAt" && sortConfig?.direction === "asc"
                                ? "text-blue-600"
                                : ""
                            }`}
                            onClick={() => handleSort("updatedAt", "asc")}
                          >
                            Oldest to Newest
                          </Button>
                        </div>
                      </div>

                      {/* Client ID */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-4 h-4 rounded border border-input ${
                              sortConfig?.field === "id" ? "bg-blue-600" : "bg-background"
                            }`}
                          ></div>
                          <span className="text-sm">Client ID</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 text-xs ${
                              sortConfig?.field === "id" && sortConfig?.direction === "asc" ? "text-blue-600" : ""
                            }`}
                            onClick={() => handleSort("id", "asc")}
                          >
                            A-Z
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-6 px-2 text-xs ${
                              sortConfig?.field === "id" && sortConfig?.direction === "desc" ? "text-blue-600" : ""
                            }`}
                            onClick={() => handleSort("id", "desc")}
                          >
                            Z-A
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                      <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearSort}>
                        Clear all
                      </Button>
                      <Button size="sm" className="bg-black text-white hover:bg-gray-800" onClick={applySort}>
                        Apply Sort
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="col-span-1">Updated By</div>
          </div>

          {/* Table Rows */}
          {sortedClients.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No clients found matching your criteria.</div>
          ) : (
            sortedClients.map((client) => (
              <div
                key={client.id}
                className="grid grid-cols-12 gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/30"
              >
                <div className="col-span-1 text-blue-600 font-medium">{client.id}</div>
                <div className="col-span-2 text-foreground">{client.name}</div>
                <div className="col-span-2 text-foreground">{client.type}</div>
                <div className="col-span-3 text-foreground">{client.email}</div>
                <div className="col-span-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="col-span-2 text-foreground">M</div>
                <div className="col-span-1 text-foreground">{client.updatedBy}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
