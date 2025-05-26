
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, User, Users, Search, Calendar, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InternalChatProps {
  currentUser: any;
}

export const InternalChat = ({ currentUser }: InternalChatProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState("general");
  const [messageText, setMessageText] = useState("");
  const { toast } = useToast();

  const departments = [
    { id: "general", name: "عام", icon: Users, count: 12 },
    { id: "bookings", name: "الحجوزات", icon: Calendar, count: 5 },
    { id: "flights", name: "التذاكر", icon: Globe, count: 3 },
    { id: "hotels", name: "الفنادق", icon: User, count: 7 },
  ];

  const messages = {
    general: [
      {
        id: 1,
        sender: "أحمد المدير",
        message: "مرحباً بالجميع، نرجو التركيز على خدمة العملاء اليوم",
        time: "10:30 ص",
        department: "الإدارة",
        isCurrentUser: false
      },
      {
        id: 2,
        sender: "سارة الحجوزات",
        message: "تم تأكيد حجز العميل أحمد محمد للبرنامج التايلاندي",
        time: "11:15 ص",
        department: "الحجوزات",
        isCurrentUser: false
      },
      {
        id: 3,
        sender: currentUser?.name || "أنت",
        message: "شكراً سارة، سأقوم بمتابعة ترتيب الفندق",
        time: "11:20 ص",
        department: currentUser?.role || "موظف",
        isCurrentUser: true
      }
    ],
    bookings: [
      {
        id: 4,
        sender: "فاطمة الحجوزات",
        message: "يوجد استفسار من عميل عن تغيير تاريخ السفر",
        time: "09:45 ص",
        department: "الحجوزات",
        isCurrentUser: false
      },
      {
        id: 5,
        sender: "محمد المبيعات",
        message: "ما هي رسوم التغيير للبرنامج الماليزي؟",
        time: "10:00 ص",
        department: "المبيعات",
        isCurrentUser: false
      }
    ],
    flights: [
      {
        id: 6,
        sender: "علي التذاكر",
        message: "تم تأكيد جميع تذاكر رحلات الغد",
        time: "08:30 ص",
        department: "التذاكر",
        isCurrentUser: false
      }
    ],
    hotels: [
      {
        id: 7,
        sender: "نورا الفنادق",
        message: "فندق بوكيت أكد توفر الغرف للمجموعة القادمة",
        time: "12:00 م",
        department: "الفنادق",
        isCurrentUser: false
      }
    ]
  };

  const onlineUsers = [
    { name: "أحمد المدير", department: "الإدارة", status: "متاح" },
    { name: "سارة الحجوزات", department: "الحجوزات", status: "مشغول" },
    { name: "محمد المبيعات", department: "المبيعات", status: "متاح" },
    { name: "فاطمة الحجوزات", department: "الحجوزات", status: "بعيد" },
    { name: "علي التذاكر", department: "التذاكر", status: "متاح" },
    { name: "نورا الفنادق", department: "الفنادق", status: "متاح" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "متاح":
        return "bg-green-500";
      case "مشغول":
        return "bg-red-500";
      case "بعيد":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      toast({
        title: "تم إرسال الرسالة",
        description: "تم إرسال رسالتك بنجاح",
      });
      setMessageText("");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Chat Area */}
      <div className="lg:col-span-3">
        <Card className="shadow-lg h-[600px] flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl">التواصل الداخلي</CardTitle>
            <CardDescription>تواصل مع فريق العمل حسب التخصص</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Tabs value={selectedDepartment} onValueChange={setSelectedDepartment} className="flex-1 flex flex-col" dir="rtl">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 mb-4">
                {departments.map((dept) => (
                  <TabsTrigger 
                    key={dept.id} 
                    value={dept.id}
                    className="flex items-center space-x-reverse space-x-2"
                  >
                    <dept.icon className="w-4 h-4" />
                    <span>{dept.name}</span>
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {dept.count}
                    </Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              {departments.map((dept) => (
                <TabsContent key={dept.id} value={dept.id} className="flex-1 flex flex-col">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto max-h-[400px]">
                    <div className="space-y-4">
                      {messages[dept.id as keyof typeof messages]?.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                              message.isCurrentUser
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-200'
                            }`}
                          >
                            {!message.isCurrentUser && (
                              <div className="flex items-center space-x-reverse space-x-2 mb-1">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">
                                    {message.sender.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-medium text-gray-900">
                                  {message.sender}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {message.department}
                                </Badge>
                              </div>
                            )}
                            <p className={`text-sm ${message.isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                              {message.message}
                            </p>
                            <p className={`text-xs mt-1 ${message.isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-reverse space-x-2">
                    <Input
                      placeholder="اكتب رسالتك..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 text-right"
                      dir="rtl"
                    />
                    <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700">
                      إرسال
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Online Users Sidebar */}
      <div className="lg:col-span-1">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-reverse space-x-2">
              <Users className="w-5 h-5" />
              <span>الموظفون المتصلون</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onlineUsers.map((user, index) => (
                <div key={index} className="flex items-center space-x-reverse space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-sm">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-600">{user.department}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      user.status === "متاح" ? "text-green-700 border-green-200" :
                      user.status === "مشغول" ? "text-red-700 border-red-200" :
                      "text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {user.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg mt-4">
          <CardHeader>
            <CardTitle className="text-sm">إحصائيات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>الرسائل اليوم:</span>
                <span className="font-bold">47</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>المتصلون الآن:</span>
                <span className="font-bold">6</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>متوسط الرد:</span>
                <span className="font-bold">2 دقيقة</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
