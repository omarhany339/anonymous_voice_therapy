import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Heart, Lock, Headphones, Shield, Clock, Users } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-12 w-12 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">صوت الراحة</span>
          </div>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Button variant="outline" onClick={() => navigate("/dashboard")}>
                  لوحة التحكم
                </Button>
              </>
            ) : (
              <Button onClick={() => (window.location.href = getLoginUrl())}>
                دخول
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            استشارات نفسية <span className="text-primary">مجهولة وآمنة</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            منصة متخصصة للاستشارات النفسية الصوتية مع أعلى مستويات الخصوصية والسرية. تحدث مع معالجين نفسيين محترفين دون الكشف عن هويتك.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate("/booking")}>
              ابدأ جلستك الأولى مجاناً
            </Button>
            <Button size="lg" variant="outline">
              تعرف على المزيد
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-card border-t border-b border-border py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            لماذا صوت الراحة؟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Lock className="w-12 h-12 text-primary mb-4" />
                <CardTitle>خصوصية تامة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  هوية رقمية مجهولة بدون اسم أو بريد إلكتروني. جميع بياناتك مشفرة بالكامل.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Headphones className="w-12 h-12 text-primary mb-4" />
                <CardTitle>جلسات صوتية مباشرة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  تحدث مع معالجين نفسيين حقيقيين عبر الموقع مباشرة. لا تطبيقات معقدة.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="w-12 h-12 text-primary mb-4" />
                <CardTitle>معالجون معتمدون</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  جميع المعالجين حاصلون على شهادات واعتمادات رسمية في الصحة النفسية.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="w-12 h-12 text-primary mb-4" />
                <CardTitle>جلسة أولى مجانية</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  جلسة استشارية مجانية لمدة 45 دقيقة لتقييم احتياجاتك. مرة واحدة فقط.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>متابعة منظمة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  خطط متابعة مخصصة مع ملاحظات وتشخيصات مبدئية بعد كل جلسة.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mb-4" />
                <CardTitle>دعم شامل</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  فريق دعم متاح لمساعدتك في أي استفسارات أو مشاكل تقنية.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            كيف يعمل؟
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  أنشئ هويتك المجهولة
                </h3>
                <p className="text-muted-foreground">
                  احصل على معرّف رقمي فريد بدون الحاجة لتقديم معلومات شخصية. كل شيء يبقى مجهول.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  أجب على الأسئلة الأولية
                </h3>
                <p className="text-muted-foreground">
                  أخبرنا عن احتياجاتك من خلال استبيان بسيط. هذا يساعدنا في توجيهك للمعالج المناسب.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  احجز جلستك
                </h3>
                <p className="text-muted-foreground">
                  اختر من قائمة المعالجين المتاحين واختر الموعد الذي يناسبك.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  ابدأ جلستك الصوتية
                </h3>
                <p className="text-muted-foreground">
                  تحدث مع معالجك مباشرة عبر الموقع. جلسة آمنة وسرية تماماً.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-card border-t border-b border-border py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            الأسعار
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free Session */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>الجلسة الأولى</CardTitle>
                <CardDescription>مجاني</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-primary">مجاني</div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> 45 دقيقة
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> استشارة تقييمية
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> مرة واحدة فقط
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => navigate("/booking")}>
                  ابدأ الآن
                </Button>
              </CardContent>
            </Card>

            {/* Paid Session */}
            <Card className="border-primary border-2">
              <CardHeader>
                <CardTitle>الجلسات المتابعة</CardTitle>
                <CardDescription>متكررة</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-primary">499 ج.م</div>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> 45 دقيقة
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> متابعة علاجية
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">✓</span> ملاحظات وتشخيص
                  </li>
                </ul>
                <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => navigate("/booking")}>
                  احجز جلسة
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            هل أنت مستعد للبدء؟
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            لا تتردد. خطوتك الأولى نحو الشعور بالأفضل تبدأ هنا. جلستك الأولى مجانية تماماً.
          </p>
          <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => navigate("/booking")}>
            احصل على جلستك المجانية الآن
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">عن صوت الراحة</h3>
              <p className="text-muted-foreground text-sm">
                منصة متخصصة في الاستشارات النفسية الآمنة والمجهولة.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">الخدمات</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">استشارات فردية</a></li>
                <li><a href="#" className="hover:text-primary">متابعة علاجية</a></li>
                <li><a href="#" className="hover:text-primary">جلسات مجانية</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">المساعدة</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">الأسئلة الشائعة</a></li>
                <li><a href="#" className="hover:text-primary">الدعم</a></li>
                <li><a href="#" className="hover:text-primary">اتصل بنا</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">القانوني</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">سياسة الخصوصية</a></li>
                <li><a href="#" className="hover:text-primary">شروط الخدمة</a></li>
                <li><a href="#" className="hover:text-primary">الموافقات</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
            <p>&copy; 2024 صوت الراحة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
