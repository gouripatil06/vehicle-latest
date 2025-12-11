"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Smartphone, Server, Database } from "lucide-react"

interface TechStackCategoryProps {
  icon: React.ElementType
  title: string
  iconColor: string
  items: string[]
}

function TechStackCategory({ icon: Icon, title, iconColor, items }: TechStackCategoryProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        {title}
      </h3>
      <ul className="space-y-1 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}

export function TechStackSection() {
  const categories = [
    {
      icon: Smartphone,
      title: "Frontend",
      iconColor: "text-blue-500",
      items: [
        "Next.js 16 (React Framework)",
        "TypeScript",
        "Tailwind CSS",
        "Mapbox GL JS (Maps)",
        "Framer Motion (Animations)",
        "Recharts (Charts)",
        "Clerk (Authentication)"
      ]
    },
    {
      icon: Server,
      title: "Backend",
      iconColor: "text-green-500",
      items: [
        "Node.js",
        "Express.js",
        "REST API",
        "Vehicle Simulator",
        "Faker.js (Data Generation)",
        "Mapbox Directions API"
      ]
    },
    {
      icon: Database,
      title: "Database & Services",
      iconColor: "text-purple-500",
      items: [
        "Supabase (PostgreSQL)",
        "Supabase Realtime",
        "Row Level Security (RLS)",
        "Deployed on Vercel (Frontend)",
        "Deployed on Railway (Backend)"
      ]
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-12"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Code className="h-6 w-6 text-orange-500" />
            </div>
            <CardTitle className="text-2xl">Technology Stack</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <TechStackCategory key={category.title} {...category} />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

