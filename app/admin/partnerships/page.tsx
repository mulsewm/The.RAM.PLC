import { getPartnerships } from "@/lib/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function PartnershipsAdminPage() {
  const partnerships = await getPartnerships()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Partnership Requests</h1>
        <p className="text-gray-600 mt-2">Manage and review partnership applications</p>
      </div>

      <div className="grid gap-6">
        {partnerships.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">No partnership requests yet.</p>
            </CardContent>
          </Card>
        ) : (
          partnerships.map((partnership) => (
            <Card key={partnership.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{partnership.company_name}</CardTitle>
                    <CardDescription className="mt-1">
                      {partnership.email}
                      {partnership.phone && ` • ${partnership.phone}`}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{new Date(partnership.created_at).toLocaleDateString()}</Badge>
                </div>
              </CardHeader>
              {partnership.message && (
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Message:</h4>
                    <p className="text-gray-700">{partnership.message}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
