import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PROBLEM_TYPES, DURATION_OPTIONS, URGENCY_OPTIONS, PREVIOUS_DIAGNOSIS_OPTIONS, MEDICATIONS_OPTIONS } from "@shared/constants";
import { ChevronRight, ChevronLeft } from "lucide-react";

type BookingStep = "intake" | "doctor_selection" | "date_selection" | "confirmation";

export default function Booking() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("intake");
  const [intakeAnswers, setIntakeAnswers] = useState<Record<string, string[]>>({
    problem_type: [],
    duration: [],
    urgency: [],
    diagnosis: [],
    medications: [],
  });

  const handleIntakeChange = (category: string, value: string, isMultiple: boolean = false) => {
    setIntakeAnswers((prev) => {
      if (isMultiple) {
        const current = prev[category] || [];
        if (current.includes(value)) {
          return {
            ...prev,
            [category]: current.filter((v) => v !== value),
          };
        } else {
          return {
            ...prev,
            [category]: [...current, value],
          };
        }
      } else {
        return {
          ...prev,
          [category]: [value],
        };
      }
    });
  };

  const isIntakeComplete = Object.values(intakeAnswers).every((v) => v.length > 0);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                currentStep === "intake" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                1
              </div>
              <span className="text-sm font-medium">الأسئلة الأولية</span>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep === "doctor_selection" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              2
            </div>
            <span className="text-sm font-medium">اختيار الطبيب</span>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep === "date_selection" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              3
            </div>
            <span className="text-sm font-medium">اختيار الموعد</span>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep === "confirmation" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              4
            </div>
            <span className="text-sm font-medium">التأكيد</span>
          </div>
        </div>

        {/* Step 1: Intake Questions */}
        {currentStep === "intake" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>الأسئلة الأولية</CardTitle>
                <CardDescription>
                  ساعدنا في فهم احتياجاتك بشكل أفضل لتوجيهك للمعالج المناسب
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Problem Type */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">ما نوع المشكلة التي تواجهها؟</Label>
                  <div className="space-y-3">
                    {PROBLEM_TYPES.map((option) => (
                      <div key={option.id} className="flex items-center gap-3">
                        <Checkbox
                          id={`problem_${option.id}`}
                          checked={intakeAnswers.problem_type.includes(option.id)}
                          onCheckedChange={() => handleIntakeChange("problem_type", option.id, true)}
                        />
                        <Label htmlFor={`problem_${option.id}`} className="font-normal cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">كم مدة المشكلة؟</Label>
                  <RadioGroup value={intakeAnswers.duration[0] || ""} onValueChange={(v) => handleIntakeChange("duration", v)}>
                    <div className="space-y-3">
                      {DURATION_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <RadioGroupItem value={option.id} id={`duration_${option.id}`} />
                          <Label htmlFor={`duration_${option.id}`} className="font-normal cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Urgency */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">ما درجة الإلحاح؟</Label>
                  <RadioGroup value={intakeAnswers.urgency[0] || ""} onValueChange={(v) => handleIntakeChange("urgency", v)}>
                    <div className="space-y-3">
                      {URGENCY_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <RadioGroupItem value={option.id} id={`urgency_${option.id}`} />
                          <Label htmlFor={`urgency_${option.id}`} className="font-normal cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Previous Diagnosis */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">هل لديك تشخيصات نفسية سابقة؟</Label>
                  <RadioGroup value={intakeAnswers.diagnosis[0] || ""} onValueChange={(v) => handleIntakeChange("diagnosis", v)}>
                    <div className="space-y-3">
                      {PREVIOUS_DIAGNOSIS_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <RadioGroupItem value={option.id} id={`diagnosis_${option.id}`} />
                          <Label htmlFor={`diagnosis_${option.id}`} className="font-normal cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Medications */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">هل تتناول أي أدوية نفسية حالياً؟</Label>
                  <RadioGroup value={intakeAnswers.medications[0] || ""} onValueChange={(v) => handleIntakeChange("medications", v)}>
                    <div className="space-y-3">
                      {MEDICATIONS_OPTIONS.map((option) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <RadioGroupItem value={option.id} id={`medications_${option.id}`} />
                          <Label htmlFor={`medications_${option.id}`} className="font-normal cursor-pointer">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 pt-6">
                  <Button variant="outline" disabled>
                    السابق
                  </Button>
                  <Button
                    onClick={() => setCurrentStep("doctor_selection")}
                    disabled={!isIntakeComplete}
                    className="ml-auto"
                  >
                    التالي
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Doctor Selection */}
        {currentStep === "doctor_selection" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>اختر المعالج</CardTitle>
                <CardDescription>
                  اختر من بين المعالجين المتخصصين المتاحين
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Doctor Cards - Placeholder */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="border-border hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-foreground">د. معالج {i}</h3>
                            <p className="text-sm text-muted-foreground">متخصص في القلق والاكتئاب</p>
                            <p className="text-sm text-muted-foreground mt-2">الخبرة: 5 سنوات</p>
                          </div>
                          <Button variant="outline">اختر</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex gap-4 pt-6">
                  <Button variant="outline" onClick={() => setCurrentStep("intake")}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    السابق
                  </Button>
                  <Button onClick={() => setCurrentStep("date_selection")} className="ml-auto">
                    التالي
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Date Selection */}
        {currentStep === "date_selection" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>اختر موعد الجلسة</CardTitle>
                <CardDescription>
                  اختر من بين المواعيد المتاحة
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calendar - Placeholder */}
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <button
                      key={i}
                      className="p-3 border border-border rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors text-center text-sm"
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {/* Time Slots */}
                <div>
                  <Label className="font-semibold mb-4 block">اختر الوقت</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {["09:00", "11:00", "14:00", "16:00", "18:00", "20:00"].map((time) => (
                      <button
                        key={time}
                        className="p-3 border border-border rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 pt-6">
                  <Button variant="outline" onClick={() => setCurrentStep("doctor_selection")}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    السابق
                  </Button>
                  <Button onClick={() => setCurrentStep("confirmation")} className="ml-auto">
                    التالي
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === "confirmation" && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>تأكيد الحجز</CardTitle>
                <CardDescription>
                  تحقق من تفاصيل جلستك
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-6 rounded-lg space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المعالج:</span>
                    <span className="font-semibold">د. معالج 1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">التاريخ:</span>
                    <span className="font-semibold">15 يناير 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الوقت:</span>
                    <span className="font-semibold">14:00</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-4">
                    <span className="text-muted-foreground">السعر:</span>
                    <span className="font-semibold text-primary">مجاني (جلسة أولى)</span>
                  </div>
                </div>

                {/* Consent */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox id="consent_privacy" />
                    <Label htmlFor="consent_privacy" className="text-sm font-normal">
                      أوافق على سياسة الخصوصية وأفهم أن بياناتي ستكون مشفرة بالكامل
                    </Label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox id="consent_terms" />
                    <Label htmlFor="consent_terms" className="text-sm font-normal">
                      أوافق على شروط الخدمة
                    </Label>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex gap-4 pt-6">
                  <Button variant="outline" onClick={() => setCurrentStep("date_selection")}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    السابق
                  </Button>
                  <Button className="ml-auto bg-primary hover:bg-primary/90">
                    تأكيد الحجز
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
