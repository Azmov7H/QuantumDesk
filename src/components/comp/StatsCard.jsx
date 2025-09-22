import { Card, CardContent } from "@/components/ui/card"

export default function StatsCard({ title, value }) {
  return (
    <Card className="border border-white/10 text-white bg-transparent">
      <CardContent className="pt-4">
        <h3 className="text-sm text-gray-400">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  )
}
