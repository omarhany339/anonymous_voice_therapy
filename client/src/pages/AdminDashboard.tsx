import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Calendar, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  sessionsCount: number;
  rating: number;
  status: "active" | "inactive";
}

interface Transaction {
  id: number;
  patientId: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
}

const mockDoctors: Doctor[] = [
  {
    id: 1,
    name: "د. أحمد محمد",
    specialization: "متخصص في القلق والاكتئاب",
    sessionsCount: 24,
    rating: 4.8,
    status: "active",
  },
  {
    id: 2,
    name: "د. فاطمة علي",
    specialization: "متخصصة في مشاكل العلاقات",
    sessionsCount: 18,
    rating: 4.9,
    status: "active",
  },
  {
    id: 3,
    name: "د. محمود حسن",
    specialization: "متخصص في الضغط النفسي",
    sessionsCount: 15,
    rating: 4.7,
    status: "inactive",
  },
];

const mockTransactions: Transaction[] = [
  {
    id: 1,
    patientId: "703",
    amount: 499,
    status: "completed",
    date: "2024-01-15 14:30",
  },
  {
    id: 2,
    patientId: "504",
    amount: 499,
    status: "completed",
    date: "2024-01-15 13:15",
  },
  {
    id: 3,
    patientId: "812",
    amount: 499,
    status: "pending",
    date: "2024-01-15 12:00",
  },
];

export default function AdminDashboard() {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">مكتملة</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">قيد الانتظار</Badge>;
      case "failed":
        return <Badge className="bg-red-600">فشلت</Badge>;
      case "active":
        return <Badge className="bg-green-600">نشط</Badge>;
      case "inactive":
        return <Badge className="bg-gray-600">غير نشط</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">لوحة تحكم الإدارة</h1>
          <p className="text-muted-foreground">إدارة النظام والأطباء والمعاملات المالية</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">إجمالي الأطباء</p>
                  <p className="text-3xl font-bold text-primary">{doctors.length}</p>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">إجمالي الإيرادات</p>
                  <p className="text-3xl font-bold text-green-600">{totalRevenue} ج.م</p>
                </div>
                <DollarSign className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">إجمالي الجلسات</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {doctors.reduce((sum, d) => sum + d.sessionsCount, 0)}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">معدل الرضا</p>
                  <p className="text-3xl font-bold text-yellow-600">4.8/5</p>
                </div>
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Doctors Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>إدارة الأطباء</CardTitle>
                  <Button>إضافة طبيب</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="border border-border rounded-lg p-4 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">{doctor.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doctor.specialization}
                          </p>
                        </div>
                        {getStatusBadge(doctor.status)}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">الجلسات</p>
                          <p className="font-semibold">{doctor.sessionsCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">التقييم</p>
                          <p className="font-semibold">{doctor.rating}/5</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">الحالة</p>
                          <p className="font-semibold">{doctor.status === "active" ? "نشط" : "غير نشط"}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          تحرير
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          عرض الجلسات
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>آخر المعاملات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="border border-border rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">المريض #{transaction.patientId}</p>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-muted-foreground">{transaction.date}</p>
                      <p className="font-semibold text-green-600">{transaction.amount} ج.م</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Report */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>التقرير المالي</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-muted-foreground text-sm mb-2">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-green-600">{totalRevenue} ج.م</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">المعاملات المكتملة</p>
                <p className="text-2xl font-bold">
                  {transactions.filter((t) => t.status === "completed").length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">المعاملات المعلقة</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {transactions.filter((t) => t.status === "pending").length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-2">المعاملات الفاشلة</p>
                <p className="text-2xl font-bold text-red-600">
                  {transactions.filter((t) => t.status === "failed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
