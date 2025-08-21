"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"
import BottomNavigation from "@/components/bottom-navigation"
import { Award, Calendar, FileText, Plus, Download, Eye, Upload } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"

interface Certificate {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate?: string
  type: "vaccination" | "training" | "registration" | "insurance" | "other"
  status: "valid" | "expired" | "expiring_soon"
  fileUrl?: string
}

export default function CertificatesPage() {
  const router = useRouter()
  const { currentTheme } = useTheme()
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      name: "狂犬病予防注射済票",
      issuer: "東京都",
      issueDate: "2024年1月15日",
      expiryDate: "2025年1月14日",
      type: "vaccination",
      status: "valid"
    },
    {
      id: "2", 
      name: "混合ワクチン接種証明書",
      issuer: "田中動物病院",
      issueDate: "2024年1月10日",
      expiryDate: "2025年1月9日",
      type: "vaccination",
      status: "valid"
    },
    {
      id: "3",
      name: "犬の登録証明書",
      issuer: "新宿区",
      issueDate: "2023年3月20日",
      type: "registration",
      status: "valid"
    },
    {
      id: "4",
      name: "ペット保険証券",
      issuer: "アニコム損保",
      issueDate: "2023年4月1日",
      expiryDate: "2024年3月31日",
      type: "insurance",
      status: "expired"
    },
    {
      id: "5",
      name: "しつけ教室修了証",
      issuer: "ドッグスクール東京",
      issueDate: "2023年6月30日",
      type: "training",
      status: "valid"
    }
  ])

  const [isAddingCertificate, setIsAddingCertificate] = useState(false)
  const [newCertificate, setNewCertificate] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    type: "other" as Certificate["type"]
  })

  const getStatusBadge = (status: Certificate["status"]) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-green-100 text-green-800">有効</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">期限切れ</Badge>
      case "expiring_soon":
        return <Badge style={{ backgroundColor: 'rgb(0, 50, 115)', color: 'white' }}>期限間近</Badge>
      default:
        return <Badge variant="secondary">不明</Badge>
    }
  }

  const getTypeIcon = (type: Certificate["type"]) => {
    switch (type) {
      case "vaccination":
        return "💉"
      case "training":
        return "🎓"
      case "registration":
        return "📋"
      case "insurance":
        return "🛡️"
      default:
        return "📄"
    }
  }

  const getTypeName = (type: Certificate["type"]) => {
    switch (type) {
      case "vaccination":
        return "予防接種"
      case "training":
        return "訓練・しつけ"
      case "registration":
        return "登録"
      case "insurance":
        return "保険"
      default:
        return "その他"
    }
  }

  const handleAddCertificate = () => {
    if (newCertificate.name && newCertificate.issuer && newCertificate.issueDate) {
      const certificate: Certificate = {
        id: Date.now().toString(),
        ...newCertificate,
        status: "valid"
      }
      setCertificates([...certificates, certificate])
      setNewCertificate({
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        type: "other"
      })
      setIsAddingCertificate(false)
    }
  }

  const validCertificates = certificates.filter(cert => cert.status === "valid")
  const expiredCertificates = certificates.filter(cert => cert.status === "expired")
  const expiringSoonCertificates = certificates.filter(cert => cert.status === "expiring_soon")

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-md mx-auto bg-white">
          <PageHeader 
            title="証明書・資格" 
            subtitle="愛犬の各種証明書と資格の管理" 
            showBackButton 
          />

          <div className="p-4 space-y-6">
            {/* サマリー */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{validCertificates.length}</div>
                <div className="text-xs text-gray-600">有効</div>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ backgroundColor: 'rgb(224, 242, 254)' }}>
                <div className="text-xl font-bold" style={{ color: 'rgb(0, 50, 115)' }}>{expiringSoonCertificates.length}</div>
                <div className="text-xs text-gray-600">期限間近</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-xl font-bold text-red-600">{expiredCertificates.length}</div>
                <div className="text-xs text-gray-600">期限切れ</div>
              </div>
            </div>

            {/* 新規追加ボタン */}
            <Dialog open={isAddingCertificate} onOpenChange={setIsAddingCertificate}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  新しい証明書を追加
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>証明書の追加</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cert-name">証明書名</Label>
                    <Input
                      id="cert-name"
                      value={newCertificate.name}
                      onChange={(e) => setNewCertificate({...newCertificate, name: e.target.value})}
                      placeholder="例: 狂犬病予防注射済票"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cert-issuer">発行機関</Label>
                    <Input
                      id="cert-issuer"
                      value={newCertificate.issuer}
                      onChange={(e) => setNewCertificate({...newCertificate, issuer: e.target.value})}
                      placeholder="例: 東京都"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cert-issue-date">発行日</Label>
                    <Input
                      id="cert-issue-date"
                      type="date"
                      value={newCertificate.issueDate}
                      onChange={(e) => setNewCertificate({...newCertificate, issueDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cert-expiry-date">有効期限（任意）</Label>
                    <Input
                      id="cert-expiry-date"
                      type="date"
                      value={newCertificate.expiryDate}
                      onChange={(e) => setNewCertificate({...newCertificate, expiryDate: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddCertificate} className="flex-1">
                      追加
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingCertificate(false)} className="flex-1">
                      キャンセル
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* 証明書一覧 */}
            <div className="space-y-4">
              <h3 className="font-semibold">証明書一覧</h3>
              
              {certificates.map((certificate) => (
                <Card key={certificate.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(certificate.type)}</span>
                        <div>
                          <h4 className="font-medium">{certificate.name}</h4>
                          <p className="text-sm text-gray-500">{certificate.issuer}</p>
                        </div>
                      </div>
                      {getStatusBadge(certificate.status)}
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        発行日: {certificate.issueDate}
                      </div>
                      {certificate.expiryDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          有効期限: {certificate.expiryDate}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Award className="w-3 h-3" />
                        種類: {getTypeName(certificate.type)}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        詳細
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        ダウンロード
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {certificates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>証明書が登録されていません</p>
                  <p className="text-sm">「新しい証明書を追加」ボタンから追加してください</p>
                </div>
              )}
            </div>

            {/* アップロード案内 */}
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">証明書のスキャン</h4>
                    <p className="text-sm text-blue-700">
                      紙の証明書をスマホで撮影してデジタル保存できます
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <BottomNavigation />
    </>
  )
}
