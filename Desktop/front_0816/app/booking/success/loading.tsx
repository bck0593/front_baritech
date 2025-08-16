import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function BookingSuccessLoading() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        <div className="p-4 space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-6 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>

          <Card>
            <CardContent className="p-6 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
