"use client"

import { Card, CardContent } from "./card"
import { Badge } from "./badge"
import { Calendar, MapPin } from "lucide-react"

export interface BookingCardProps {
  service: string
  date: string
  time: string
  location?: string
  status: string
  className?: string
  onClick?: () => void
}

export function BookingCard({ 
  service, 
  date, 
  time, 
  location, 
  status, 
  className, 
  onClick 
}: BookingCardProps) {
  return (
    <Card className={className} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium">{service}</h3>
          <Badge variant={status === "確定" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{date} {time}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
