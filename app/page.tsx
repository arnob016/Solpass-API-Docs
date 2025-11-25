"use client"
import { Code2, TrendingUp, Blocks, Lock, ChevronDown, Shield, Database, Zap } from "lucide-react"
import { useState } from "react"

export default function Home() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null)

  const apiCategories = {
    Events: {
      color: "from-blue-50 to-blue-100",
      icon: Blocks,
      endpoints: [
        {
          id: "create-event",
          method: "POST",
          path: "/api/v1/events",
          summary: "Create a new event",
          description: "Create a new event (database only, blockchain init separate)",
          requestBody: {
            email: "CreateEventDto",
            fields: [
              "eventId",
              "name",
              "description",
              "venue",
              "eventDate",
              "totalTickets",
              "ticketPrice",
              "royaltyDistribution",
            ],
          },
          responses: {
            "201": "Event created successfully",
            "400": "Bad request",
            "401": "Unauthorized",
          },
        },
        {
          id: "get-events",
          method: "GET",
          path: "/api/v1/events",
          summary: "Get all events with filtering",
          description: "Get all events with filtering and pagination",
          queryParams: {
            page: "number",
            limit: "number",
            partnerId: "string",
            blockchainEnabled: "boolean",
            upcoming: "boolean",
            search: "string",
          },
          responses: {
            "200": "Events list retrieved",
          },
        },
        {
          id: "get-event-by-id",
          method: "GET",
          path: "/api/v1/events/{id}",
          summary: "Get event by ID",
          description: "Get event details by ID",
          pathParams: { id: "Event UUID" },
          responses: {
            "200": "Event details retrieved",
            "404": "Event not found",
          },
        },
        {
          id: "update-event",
          method: "PATCH",
          path: "/api/v1/events/{id}",
          summary: "Update event",
          description: "Update event details",
          requestBody: { schema: "UpdateEventDto" },
          responses: {
            "200": "Event updated successfully",
            "400": "Bad request",
            "401": "Unauthorized",
            "403": "Forbidden - not event owner",
            "404": "Event not found",
          },
        },
        {
          id: "delete-event",
          method: "DELETE",
          path: "/api/v1/events/{id}",
          summary: "Delete event",
          description: "Delete event (soft delete)",
          responses: {
            "200": "Event deleted successfully",
            "400": "Cannot delete blockchain-enabled events",
            "401": "Unauthorized",
            "403": "Forbidden - not event owner",
            "404": "Event not found",
          },
        },
        {
          id: "init-blockchain",
          method: "POST",
          path: "/api/v1/events/{id}/initialize-blockchain",
          summary: "Initialize blockchain",
          description: "Initialize event on blockchain",
          responses: {
            "200": "Blockchain initialized successfully",
            "400": "Already initialized",
            "401": "Unauthorized",
            "403": "Forbidden - not event owner",
            "404": "Event not found",
          },
        },
        {
          id: "event-stats",
          method: "GET",
          path: "/api/v1/events/{id}/stats",
          summary: "Get event statistics",
          description: "Get event statistics",
          responses: {
            "200": "Event stats retrieved",
            "401": "Unauthorized",
            "403": "Forbidden - not event owner",
            "404": "Event not found",
          },
        },
        {
          id: "distribute-royalty",
          method: "POST",
          path: "/api/v1/events/{id}/distribute",
          summary: "Distribute royalties",
          description: "Distribute royalties to party wallets (partners extracted from event.royaltyDistribution)",
          requestBody: { schema: "DistributeRoyaltyDto" },
          responses: {
            "200": "Royalties distributed successfully",
            "400": "Already distributed or missing USDC accounts",
            "401": "Unauthorized",
            "403": "Forbidden - not event owner",
            "404": "Event not found",
          },
        },
        {
          id: "escrow-balance",
          method: "GET",
          path: "/api/v1/events/{id}/escrow",
          summary: "Get escrow balance",
          description: "Get escrow balance for an event",
          responses: {
            "200": "Escrow balance retrieved",
            "401": "Unauthorized",
            "403": "Forbidden - not event owner",
            "404": "Event not found",
          },
        },
        {
          id: "enable-partner-usdc",
          method: "POST",
          path: "/api/v1/events/{id}/enable-partner-usdc",
          summary: "Enable partner USDC",
          description: "Enable USDC token accounts for all partners (server wallet pays for creation)",
          responses: {
            "200": "USDC accounts enabled for partners",
            "400": "Partners missing wallet addresses",
            "401": "Unauthorized",
            "403": "Forbidden - not event owner",
            "404": "Event not found",
          },
        },
      ],
    },
    Tickets: {
      color: "from-green-50 to-green-100",
      icon: Code2,
      endpoints: [
        {
          id: "create-ticket",
          method: "POST",
          path: "/api/v1/events/{eventId}/tickets",
          summary: "Purchase or resell ticket",
          description: "Purchase or resell a ticket",
          requestBody: { schema: "CreateTicketDto" },
          responses: {
            "201": "Ticket purchased successfully",
            "400": "Bad request",
            "404": "Event not found",
          },
        },
        {
          id: "get-event-tickets",
          method: "GET",
          path: "/api/v1/events/{eventId}/tickets",
          summary: "Get all tickets for event",
          description: "Get all tickets for an event",
          responses: {
            "200": "All tickets for event retrieved from blockchain",
          },
        },
        {
          id: "get-ticket-by-id",
          method: "GET",
          path: "/api/v1/events/{eventId}/tickets/{ticketId}",
          summary: "Get ticket details",
          description: "Get ticket details",
          responses: {
            "200": "Ticket details retrieved",
            "404": "Ticket not found",
          },
        },
      ],
    },
    Auth: {
      color: "from-purple-50 to-purple-100",
      icon: Lock,
      endpoints: [
        {
          id: "register",
          method: "POST",
          path: "/api/v1/auth/register",
          summary: "Register new user",
          description: "Register a new user/partner",
          requestBody: { schema: "RegisterDto" },
          responses: {
            "201": "User registered successfully",
            "409": "Email or wallet already exists",
          },
        },
        {
          id: "login",
          method: "POST",
          path: "/api/v1/auth/login",
          summary: "Login user",
          description: "Login with email and password",
          requestBody: { schema: "LoginDto" },
          responses: {
            "200": "Login successful, returns JWT token",
            "401": "Invalid credentials",
          },
        },
        {
          id: "get-profile",
          method: "GET",
          path: "/api/v1/auth/me",
          summary: "Get current user",
          description: "Get current user profile (verify JWT token)",
          responses: {
            "200": "Returns current user information",
            "401": "Unauthorized - Invalid or expired token",
          },
        },
      ],
    },
    Partners: {
      color: "from-orange-50 to-orange-100",
      icon: TrendingUp,
      endpoints: [
        {
          id: "create-partner",
          method: "POST",
          path: "/partner",
          summary: "Create partner",
          description: "Create a new partner",
          requestBody: { schema: "CreatePartnerDto" },
          responses: {
            "201": "Partner created successfully",
          },
        },
        {
          id: "get-partners",
          method: "GET",
          path: "/partner",
          summary: "Get all partners",
          description: "Get all partners",
          responses: {
            "200": "Partners list retrieved",
          },
        },
        {
          id: "get-partner-by-id",
          method: "GET",
          path: "/partner/{id}",
          summary: "Get partner by ID",
          description: "Get partner details by ID",
          responses: {
            "200": "Partner details retrieved",
          },
        },
        {
          id: "update-partner",
          method: "PATCH",
          path: "/partner/{id}",
          summary: "Update partner",
          description: "Update partner details",
          requestBody: { schema: "UpdatePartnerDto" },
          responses: {
            "200": "Partner updated successfully",
          },
        },
        {
          id: "delete-partner",
          method: "DELETE",
          path: "/partner/{id}",
          summary: "Delete partner",
          description: "Delete partner",
          responses: {
            "200": "Partner deleted successfully",
          },
        },
      ],
    },
  }

  const schemas = {
    CreateEventDto: {
      fields: [
        {
          name: "eventId",
          type: "string",
          required: true,
          example: "concert-001",
          desc: "Unique event identifier (max 16 chars)",
        },
        { name: "name", type: "string", required: true, example: "Rock Show", desc: "Event name (max 32 chars)" },
        {
          name: "description",
          type: "string",
          required: true,
          example: "Amazing rock concert",
          desc: "Event description",
        },
        { name: "venue", type: "string", required: true, example: "Madison Square Garden", desc: "Event venue" },
        {
          name: "eventDate",
          type: "string",
          required: true,
          example: "2025-12-31T20:00:00Z",
          desc: "Event date in ISO format",
        },
        { name: "totalTickets", type: "number", required: true, example: 1000, desc: "Total number of tickets" },
        { name: "ticketPrice", type: "number", required: true, example: 100, desc: "Ticket price in USD" },
        {
          name: "royaltyDistribution",
          type: "RoyaltyPartnerDto[]",
          required: true,
          example: "[{partyName: 'Artist', percentage: 5}]",
          desc: "Royalty distribution array",
        },
      ],
    },
    UpdateEventDto: {
      fields: [
        { name: "name", type: "string", example: "Rock Show", desc: "Event name (max 32 chars)" },
        { name: "description", type: "string", example: "Amazing rock concert", desc: "Event description" },
        { name: "venue", type: "string", example: "Madison Square Garden", desc: "Event venue" },
        { name: "eventDate", type: "string", example: "2025-12-31T20:00:00Z", desc: "Event date in ISO format" },
      ],
    },
    CreateTicketDto: {
      fields: [
        { name: "ticketId", type: "string", required: true, example: "ticket-001", desc: "Unique ticket identifier" },
        {
          name: "buyerWallet",
          type: "string",
          required: true,
          example: "7xKzU8fPPwV3wkF9YqGVXJb4qQZ3GqYvJ9Z3sV7wV7wV",
          desc: "Buyer wallet public key (base58)",
        },
        {
          name: "sellerWallet",
          type: "string",
          required: true,
          example: "8yKzU8fPPwV3wkF9YqGVXJb4qQZ3GqYvJ9Z3sV7wV7wX",
          desc: "Seller wallet public key (base58)",
        },
        { name: "newPrice", type: "number", required: true, example: 120, desc: "New resale price in USD" },
        { name: "originalPrice", type: "number", required: true, example: 100, desc: "Original ticket price in USD" },
        { name: "buyerId", type: "string", example: "buyer-123", desc: "Buyer ID for ticket ownership" },
        { name: "sellerId", type: "string", example: "seller-456", desc: "Seller ID for ticket ownership" },
      ],
    },
    RoyaltyPartnerDto: {
      fields: [
        { name: "partyName", type: "string", required: true, example: "Artist", desc: "Party name" },
        { name: "percentage", type: "number", required: true, example: 5, desc: "Percentage (0-100)" },
        { name: "walletAddress", type: "string", example: "Solana...wallet", desc: "Solana wallet address" },
      ],
    },
    RegisterDto: {
      fields: [
        { name: "email", type: "string", required: true, example: "partner@example.com", desc: "Email address" },
        { name: "password", type: "string", required: true, example: "StrongPass123!", desc: "Password" },
        {
          name: "walletAddress",
          type: "string",
          required: true,
          example: "7xKzU8fPPwV3wkF9YqGVXJb4qQZ3GqYvJ9Z3sV7wV7wV",
          desc: "Solana wallet address",
        },
      ],
    },
    LoginDto: {
      fields: [
        { name: "email", type: "string", required: true, example: "partner@example.com", desc: "Email address" },
        { name: "password", type: "string", required: true, example: "StrongPass123!", desc: "Password" },
      ],
    },
    DistributeRoyaltyDto: {
      fields: [
        {
          name: "Note",
          type: "info",
          desc: "No request body needed. Partners and their wallet addresses are automatically extracted from the event database.",
        },
      ],
    },
  }

  const methodColors = {
    POST: "bg-blue-100 text-blue-700 border-blue-200",
    GET: "bg-green-100 text-green-700 border-green-200",
    PATCH: "bg-amber-100 text-amber-700 border-amber-200",
    DELETE: "bg-red-100 text-red-700 border-red-200",
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
              <Blocks className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Solpass API</span>
          </div>
          <button className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Documentation
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 py-24 md:py-32 bg-gradient-to-b from-background to-card/50 border-b border-border">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">Solpass Ticket API</h1>
          <p className="text-xl text-muted-foreground mb-8">
            A Solana-based settlement and royalty-distribution system for transparent ticketing, secure escrow handling,
            and verifiable ownership history
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Transparent Royalties</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Secure Escrow</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">On-Chain Verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="px-6 py-16 md:py-20 border-b border-border bg-card/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Overview</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            SolPass enables partners such as Ticketing platforms to seamlessly integrate blockchain-based ticketing
            and royalty distribution. Partners gain access to APIs and on-chain tools to create events, manage
            contracts, track resales, and request fund settlements with complete transparency.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-background border border-border">
              <h3 className="font-semibold mb-3 text-primary">Partner Controlled</h3>
              <p className="text-sm text-muted-foreground">
                Partners maintain control over event creation, ticketing UI, and primary sales while leveraging
                blockchain for secondary sales and royalties.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border">
              <h3 className="font-semibold mb-3 text-primary">Transparent Distribution</h3>
              <p className="text-sm text-muted-foreground">
                Zero-manual royalty calculation with immutable payout history. All funds flow through secure escrow with
                percentage-based splits.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border">
              <h3 className="font-semibold mb-3 text-primary">Solana Powered</h3>
              <p className="text-sm text-muted-foreground">
                Program-Derived Addresses (PDAs) track event state, while automatic escrow accounts hold and distribute
                royalties securely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Onboarding Section */}
      <section className="px-6 py-16 md:py-20 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Partner Onboarding & Integration</h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <div className="w-1 h-24 bg-border hidden md:block"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-semibold mb-2">Registration</h3>
                <p className="text-muted-foreground">
                  A new partner (e.g., a ticketing platform) contacts SolPass to register their platform and gain API
                  access.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <div className="w-1 h-24 bg-border hidden md:block"></div>
              </div>
              <div className="pb-8">
                <h3 className="text-xl font-semibold mb-2">Authentication via JWT</h3>
                <p className="text-muted-foreground">
                  Partners authenticate through the{" "}
                  <code className="bg-card px-2 py-1 rounded text-sm">/api/v1/auth</code> endpoint and receive a JWT
                  token that grants permission to create events, manage metadata, initialize contracts, and interact
                  with primary and secondary sales.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Full API Access</h3>
                <p className="text-muted-foreground">
                  Partners can now manage events, track resales, distribute royalties, and initiate settlements through
                  the complete REST API.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event & Contract Lifecycle Section */}
      <section className="px-6 py-16 md:py-20 border-b border-border bg-card/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Event & Contract Lifecycle</h2>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-background border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Event Creation</h3>
                  <p className="text-muted-foreground mb-3">
                    A team, venue, or organizer requests event creation through a partner platform. The partner sends
                    event metadata to SolPass via the POST{" "}
                    <code className="bg-card px-2 py-1 rounded text-sm">/api/v1/events</code> endpoint.
                  </p>
                  <p className="text-sm font-mono text-primary bg-card px-3 py-2 rounded">
                    Stored: eventId, name, date, venue, totalTickets, ticketPrice, royaltyDistribution
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-background border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-semibold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">On-Chain Event Initialization</h3>
                  <p className="text-muted-foreground mb-3">
                    When the partner initializes an event on Solana, the SolPass contract automatically:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                    <li>Creates an Escrow Account for holding primary and secondary royalties</li>
                    <li>Creates a Program Derived Address (PDA) that uniquely tracks event state</li>
                    <li>Stores complete event metadata and royalty percentages on-chain</li>
                  </ul>
                  <p className="text-sm text-primary mt-3 font-medium">
                    This on-chain state becomes the single source of truth for royalty enforcement.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-background border border-border">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-semibold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Primary Sale (Partner-Managed)</h3>
                  <p className="text-muted-foreground">
                    The partner sells tickets normally on their platform. SolPass does{" "}
                    <span className="font-semibold">not</span> store primary sale data on-chain to keep the contract
                    lightweight. Partners may optionally send summary information to the SolPass backend.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-background border border-border">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-semibold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Secondary Sale (Resale) Workflow</h3>
                  <div className="space-y-4 mt-4">
                    <div className="border-l-2 border-purple-300 pl-4">
                      <p className="font-medium text-sm mb-1">Step 1: Partner → SolPass Backend</p>
                      <p className="text-sm text-muted-foreground">
                        Partner sends event ID, ticket ID, sale amount, buyer/seller info, and metadata
                      </p>
                    </div>
                    <div className="border-l-2 border-purple-300 pl-4">
                      <p className="font-medium text-sm mb-1">Step 2: SolPass → Blockchain Contract</p>
                      <p className="text-sm text-muted-foreground">
                        SolPass backend validates and writes resale information to the Solana contract
                      </p>
                    </div>
                    <div className="border-l-2 border-purple-300 pl-4">
                      <p className="font-medium text-sm mb-1">Step 3: Contract → Partner (Royalty Notification)</p>
                      <p className="text-sm text-muted-foreground">
                        Contract emits event ID, royalty percentage, total amount due, and payment instructions
                      </p>
                    </div>
                    <div className="border-l-2 border-purple-300 pl-4">
                      <p className="font-medium text-sm mb-1">Step 4: Payment & Settlement</p>
                      <p className="text-sm text-muted-foreground">
                        Buyer pays partner → Partner transfers royalty portion to SolPass → SolPass deposits to escrow →
                        SolPass notifies partner to release ticket
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Post-Event Distribution Section */}
      <section className="px-6 py-16 md:py-20 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Post-Event Fund Distribution</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg bg-background border border-border">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  1
                </span>
                Partner Initiates Settlement
              </h3>
              <p className="text-sm text-muted-foreground">
                Partner calls the SolPass API to initiate final settlement via POST{" "}
                <code className="bg-card px-1 rounded">/api/v1/events/{"{id}"}/distribute</code>
              </p>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  2
                </span>
                Contract Distribution
              </h3>
              <p className="text-sm text-muted-foreground">
                SolPass reads escrow balance and team wallet addresses, then distributes all funds with accurate
                percentage-based splits automatically
              </p>
            </div>
          </div>
          <div className="mt-6 p-6 rounded-lg bg-card border border-border">
            <p className="text-sm">
              <span className="font-semibold">Guarantees:</span> Accurate percentage-based splits • Zero-manual royalty
              calculation • Immutable payout history • Event state locked post-settlement
            </p>
          </div>
        </div>
      </section>

      {/* Responsibilities Table Section */}
      <section className="px-6 py-16 md:py-20 border-b border-border bg-card/30">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">System Responsibilities</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold">Entity</th>
                  <th className="px-4 py-3 text-left font-semibold">Responsibilities</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-background/50">
                  <td className="px-4 py-3 font-medium">Partner Platform</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Event creation, ticketing UI, primary sales, resale listing flow, transferring royalty funds to
                    SolPass
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-background/50">
                  <td className="px-4 py-3 font-medium">SolPass Backend</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Validating partner requests, syncing necessary data, triggering contract actions, managing
                    settlements
                  </td>
                </tr>
                <tr className="border-b border-border hover:bg-background/50">
                  <td className="px-4 py-3 font-medium">SolPass Solana Contract</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    Holding escrow, storing event data, enforcing royalties, notifying partner, distributing funds at
                    event end
                  </td>
                </tr>
                <tr className="hover:bg-background/50">
                  <td className="px-4 py-3 font-medium">Teams/Organizers</td>
                  <td className="px-4 py-3 text-muted-foreground">Receiving final royalties and funds</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="px-6 py-16 md:py-20 border-b border-border">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Technology Stack</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg bg-background border border-border">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Blockchain (Solana)
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc ml-4">
                <li>Smart contract/program for event state</li>
                <li>Program Derived Addresses (PDAs) for unique event tracking</li>
                <li>Escrow accounts for secure royalty holding</li>
                <li>On-chain event lifecycle management</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg bg-background border border-border">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Backend & API
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc ml-4">
                <li>JWT-secured partner endpoints</li>
                <li>Sale/resale synchronization</li>
                <li>Contract interaction layer</li>
                <li>Event settlement and payout orchestration</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Schemas Section */}
      <section className="px-6 py-16 md:py-20 border-b border-border bg-card/30">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Request/Response Schemas</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(schemas).map(([schemaName, schema]) => (
              <div key={schemaName} className="p-6 rounded-lg bg-background border border-border">
                <h3 className="text-lg font-semibold mb-4 text-primary">{schemaName}</h3>
                <div className="space-y-3">
                  {(schema as any).fields.map((field: any, i: number) => (
                    <div key={i} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="font-mono font-semibold text-foreground">{field.name}</code>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">{field.type}</span>
                        {field.required && (
                          <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">required</span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-xs ml-1 mb-1">{field.desc}</p>
                      {field.example && <p className="text-xs font-mono text-primary ml-1">Example: {field.example}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints by Category */}
      {Object.entries(apiCategories).map(([categoryName, category]: any) => {
        const IconComponent = category.icon
        return (
          <section key={categoryName} className="px-6 py-16 md:py-20 border-b border-border">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center gap-3 mb-8">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center`}
                >
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">{categoryName}</h2>
              </div>

              <div className="space-y-3">
                {category.endpoints.map((endpoint: any) => (
                  <div
                    key={endpoint.id}
                    className="border border-border rounded-lg overflow-hidden bg-background hover:border-primary/50 transition-colors"
                  >
                    {/* Endpoint Header */}
                    <button
                      onClick={() => setExpandedEndpoint(expandedEndpoint === endpoint.id ? null : endpoint.id)}
                      className="w-full p-6 flex items-center justify-between hover:bg-card/50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold border ${methodColors[endpoint.method]}`}
                        >
                          {endpoint.method}
                        </span>
                        <div>
                          <p className="font-mono text-primary text-sm text-left">{endpoint.path}</p>
                          <p className="text-muted-foreground text-sm text-left">{endpoint.summary}</p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform ${expandedEndpoint === endpoint.id ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Endpoint Details */}
                    {expandedEndpoint === endpoint.id && (
                      <div className="px-6 pb-6 pt-0 border-t border-border space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-muted-foreground text-sm">{endpoint.description}</p>
                        </div>

                        {endpoint.requestBody && (
                          <div>
                            <h4 className="font-semibold mb-2">Request Body</h4>
                            <p className="text-sm text-muted-foreground">
                              Schema:{" "}
                              <code className="bg-card px-2 py-1 rounded text-primary">
                                {endpoint.requestBody.schema || endpoint.requestBody.email}
                              </code>
                            </p>
                          </div>
                        )}

                        {endpoint.queryParams && (
                          <div>
                            <h4 className="font-semibold mb-3">Query Parameters</h4>
                            <div className="space-y-2">
                              {Object.entries(endpoint.queryParams).map(([name, type]: any) => (
                                <div
                                  key={name}
                                  className="flex items-center justify-between p-2 bg-card rounded text-sm"
                                >
                                  <code className="font-mono">{name}</code>
                                  <span className="text-xs text-muted-foreground">{type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {endpoint.pathParams && (
                          <div>
                            <h4 className="font-semibold mb-3">Path Parameters</h4>
                            <div className="space-y-2">
                              {Object.entries(endpoint.pathParams).map(([name, desc]: any) => (
                                <div
                                  key={name}
                                  className="flex items-center justify-between p-2 bg-card rounded text-sm"
                                >
                                  <code className="font-mono">{name}</code>
                                  <span className="text-xs text-muted-foreground">{desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h4 className="font-semibold mb-3">Responses</h4>
                          <div className="space-y-2">
                            {Object.entries(endpoint.responses).map(([code, desc]: any) => (
                              <div key={code} className="flex items-center justify-between p-2 bg-card rounded text-sm">
                                <span
                                  className={`font-semibold ${code.startsWith("2") ? "text-green-600" : code.startsWith("4") ? "text-amber-600" : "text-red-600"}`}
                                >
                                  {code}
                                </span>
                                <span className="text-muted-foreground text-xs">{desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-border bg-card/50">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          <p>Solpass API Documentation • Powered by Actionworks • Built for seamless partner integration</p>
        </div>
      </footer>
    </main>
  )
}
