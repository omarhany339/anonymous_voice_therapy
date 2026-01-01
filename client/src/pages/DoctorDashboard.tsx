import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle } from "lucide-react";

interface Session {
  id: number;
  patientId: number;
  anonymousId: string;
  scheduledAt: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  duration: number;
  notes?: string;
  diagnosis?: string;
}

const mockSessions: Session[] = [
  {
    id: 1,
    patientId: 101,
    anonymousId: "703",
    scheduledAt: "2024-01-15 14:00",
    status: "completed",
    duration: 45,
    notes: "جلسة استشارية حول القلق والضغط النفسي",
    diagnosis: "اضطراب القلق العام",
  },
  {
    id: 2,
    patientId: 102,
    anonymousId: "504",
    scheduledAt: "2024-01-15 15:00",
    status: "in_progress",
    duration: 45,
  },
  {
    id: 3,
    patientId: 103,
    anonymousId: "812",
    scheduledAt: "2024-01-15 16:00",
    status: "scheduled",
    duration: 45,
  },
];

export default function DoctorDashboard() {
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>(mockSessions);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600">مكتملة</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-600">جاري</Badge>;
      case "scheduled":
        return <Badge className="bg-yellow-600">مجدولة</Badge>;
      case "cancelled":
        return <Badge className="bg-red-600">ملغاة</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">لوحة تحكم الطبيب</h1>
          <p className="text-muted-foreground">إدارة الجلسات والملاحظات</p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">الجلسات اليوم</p>
                <p className="text-3xl font-bold text-primary">3</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">جاري الآن</p>
                <p className="text-3xl font-bold text-blue-600">1</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">مكتملة</p>
                <p className="text-3xl font-bold text-green-600">1</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-muted-foreground text-sm mb-2">قادمة</p>
                <p className="text-3xl font-bold text-yellow-600">1</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sessions List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>الجلسات</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all">الكل</TabsTrigger>
                    <TabsTrigger value="today">اليوم</TabsTrigger>
                    <TabsTrigger value="upcoming">قادمة</TabsTrigger>
                    <TabsTrigger value="completed">مكتملة</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="border border-border rounded-lg p-4 hover:bg-muted cursor-pointer transition-colors"
                        onClick={() => setSelectedSession(session)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-foreground">
                              المريض #{session.anonymousId}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              معرف الجلسة: {session.id}
                            </p>
                          </div>
                          {getStatusBadge(session.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{session.scheduledAt}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{session.duration} دقيقة</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="today" className="space-y-4">
                    {sessions
                      .filter((s) => s.scheduledAt.includes("2024-01-15"))
                      .map((session) => (
                        <div
                          key={session.id}
                          className="border border-border rounded-lg p-4 hover:bg-muted cursor-pointer"
                          onClick={() => setSelectedSession(session)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">المريض #{session.anonymousId}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.scheduledAt}
                              </p>
                            </div>
                            {getStatusBadge(session.status)}
                          </div>
                        </div>
                      ))}
                  </TabsContent>

                  <TabsContent value="upcoming" className="space-y-4">
                    {sessions
                      .filter((s) => s.status === "scheduled")
                      .map((session) => (
                        <div
                          key={session.id}
                          className="border border-border rounded-lg p-4 hover:bg-muted cursor-pointer"
                          onClick={() => setSelectedSession(session)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">المريض #{session.anonymousId}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.scheduledAt}
                              </p>
                            </div>
                            {getStatusBadge(session.status)}
                          </div>
                        </div>
                      ))}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4">
                    {sessions
                      .filter((s) => s.status === "completed")
                      .map((session) => (
                        <div
                          key={session.id}
                          className="border border-border rounded-lg p-4 hover:bg-muted cursor-pointer"
                          onClick={() => setSelectedSession(session)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">المريض #{session.anonymousId}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.scheduledAt}
                              </p>
                            </div>
                            {getStatusBadge(session.status)}
                          </div>
                        </div>
                      ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Session Details */}
          <div>
            {selectedSession ? (
              <Card>
                <CardHeader>
                  <CardTitle>تفاصيل الجلسة</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">معرف المريض</p>
                    <p className="text-2xl font-bold text-primary">
                      #{selectedSession.anonymousId}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">الحالة</p>
                    {getStatusBadge(selectedSession.status)}
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">الموعد</p>
                    <p className="font-semibold">{selectedSession.scheduledAt}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">المدة</p>
                    <p className="font-semibold">{selectedSession.duration} دقيقة</p>
                  </div>

                  {selectedSession.status === "completed" && (
                    <>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">التشخيص</p>
                        <p className="font-semibold">{selectedSession.diagnosis}</p>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">الملاحظات</p>
                        <p className="text-sm">{selectedSession.notes}</p>
                      </div>

                      <Button className="w-full">تحرير الملاحظات</Button>
                    </>
                  )}

                  {selectedSession.status === "in_progress" && (
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      الدخول للجلسة
                    </Button>
                  )}

                  {selectedSession.status === "scheduled" && (
                    <div className="space-y-2">
                      <Button className="w-full">جاهز للجلسة</Button>
                      <Button variant="outline" className="w-full">
                        إلغاء الجلسة
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">اختر جلسة لعرض التفاصيل</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
