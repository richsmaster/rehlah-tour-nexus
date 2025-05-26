
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Globe, Calendar, User } from "lucide-react";

interface ProgramsManagementProps {
  currentUser: any;
}

export const ProgramsManagement = ({ currentUser }: ProgramsManagementProps) => {
  const [selectedCountry, setSelectedCountry] = useState("thailand");

  const programs = {
    thailand: [
      {
        id: 1,
        name: "برنامج تايلاند الكلاسيكي",
        duration: "7 أيام / 6 ليالي",
        price: "3,500 ر.س",
        cities: ["بانكوك", "بوكيت"],
        hotels: ["فندق 5 نجوم في بانكوك", "منتجع شاطئي في بوكيت"],
        activities: ["جولة المعابد", "رحلة الجزر", "عرض الألوان والأصوات"],
        includes: ["الطيران", "الإقامة", "الإفطار", "التنقلات"],
        available: true
      },
      {
        id: 2,
        name: "برنامج تايلاند العائلي",
        duration: "10 أيام / 9 ليالي",
        price: "4,200 ر.س",
        cities: ["بانكوك", "بوكيت", "كرابي"],
        hotels: ["فندق عائلي 4 نجوم", "منتجع شاطئي للعائلات"],
        activities: ["حديقة السفاري", "عالم المحيطات", "القرية العائمة"],
        includes: ["الطيران", "الإقامة", "وجبتين", "التنقلات", "دليل سياحي"],
        available: true
      }
    ],
    malaysia: [
      {
        id: 3,
        name: "برنامج ماليزيا الشامل",
        duration: "8 أيام / 7 ليالي",
        price: "3,800 ر.س",
        cities: ["كوالالمبور", "لنكاوي"],
        hotels: ["فندق 5 نجوم وسط المدينة", "منتجع استوائي"],
        activities: ["أبراج بتروناس", "جنتنج هايلاند", "تلفريك لنكاوي"],
        includes: ["الطيران", "الإقامة", "الإفطار", "التنقلات"],
        available: true
      },
      {
        id: 4,
        name: "برنامج ماليزيا الاقتصادي",
        duration: "5 أيام / 4 ليالي",
        price: "2,400 ر.س",
        cities: ["كوالالمبور"],
        hotels: ["فندق 4 نجوم"],
        activities: ["جولة المدينة", "التسوق", "الحي الصيني"],
        includes: ["الطيران", "الإقامة", "الإفطار"],
        available: true
      }
    ],
    turkey: [
      {
        id: 5,
        name: "برنامج تركيا التاريخي",
        duration: "6 أيام / 5 ليالي",
        price: "2,800 ر.س",
        cities: ["إسطنبول", "كابادوكيا"],
        hotels: ["فندق تاريخي في السلطان أحمد", "فندق كهفي في كابادوكيا"],
        activities: ["آيا صوفيا", "قصر توب كابي", "رحلة البالون"],
        includes: ["الطيران", "الإقامة", "الإفطار", "التنقلات"],
        available: true
      }
    ]
  };

  const countries = [
    { id: "thailand", name: "تايلاند", flag: "🇹🇭", color: "from-red-500 to-orange-500" },
    { id: "malaysia", name: "ماليزيا", flag: "🇲🇾", color: "from-blue-500 to-green-500" },
    { id: "turkey", name: "تركيا", flag: "🇹🇷", color: "from-red-600 to-red-400" },
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">إدارة البرامج السياحية</CardTitle>
          <CardDescription>تصفح وإدارة جميع البرامج السياحية حسب الوجهة</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCountry} onValueChange={setSelectedCountry} className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100">
              {countries.map((country) => (
                <TabsTrigger 
                  key={country.id} 
                  value={country.id}
                  className="flex items-center space-x-reverse space-x-2"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {countries.map((country) => (
              <TabsContent key={country.id} value={country.id} className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-reverse space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${country.color} rounded-full flex items-center justify-center text-white text-xl`}>
                      {country.flag}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">برامج {country.name}</h3>
                      <p className="text-gray-600">{programs[country.id as keyof typeof programs]?.length || 0} برنامج متاح</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    إضافة برنامج جديد
                  </Button>
                </div>

                <div className="grid gap-6">
                  {programs[country.id as keyof typeof programs]?.map((program) => (
                    <Card key={program.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{program.name}</h4>
                            <div className="flex items-center space-x-reverse space-x-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-reverse space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{program.duration}</span>
                              </div>
                              <div className="flex items-center space-x-reverse space-x-1">
                                <Globe className="w-4 h-4" />
                                <span>{program.cities.join(" - ")}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-left">
                            <p className="text-2xl font-bold text-blue-600">{program.price}</p>
                            <Badge className={program.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {program.available ? "متاح" : "غير متاح"}
                            </Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">الفنادق:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {program.hotels.map((hotel, index) => (
                                <li key={index}>• {hotel}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-semibold text-gray-900 mb-2">الأنشطة:</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {program.activities.map((activity, index) => (
                                <li key={index}>• {activity}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="mb-4">
                          <h5 className="font-semibold text-gray-900 mb-2">يشمل البرنامج:</h5>
                          <div className="flex flex-wrap gap-2">
                            {program.includes.map((item, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-end space-x-reverse space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                عرض التفاصيل
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl" dir="rtl">
                              <DialogHeader>
                                <DialogTitle>{program.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <strong>المدة:</strong> {program.duration}
                                  </div>
                                  <div>
                                    <strong>السعر:</strong> {program.price}
                                  </div>
                                </div>
                                <div>
                                  <strong>المدن:</strong> {program.cities.join(", ")}
                                </div>
                                <div>
                                  <strong>الفنادق:</strong>
                                  <ul className="mt-2 space-y-1">
                                    {program.hotels.map((hotel, index) => (
                                      <li key={index}>• {hotel}</li>
                                    ))}
                                  </ul>
                                </div>
                                <div>
                                  <strong>الأنشطة:</strong>
                                  <ul className="mt-2 space-y-1">
                                    {program.activities.map((activity, index) => (
                                      <li key={index}>• {activity}</li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm">
                            تعديل البرنامج
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                            إضافة حجز
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
