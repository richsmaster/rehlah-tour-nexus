
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Calendar, User, Globe, FileSearch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookingManagementProps {
  currentUser: any;
}

export const BookingManagement = ({ currentUser }: BookingManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddingBooking, setIsAddingBooking] = useState(false);
  const { toast } = useToast();

  const bookings = [
    {
      id: "BK001",
      customerName: "أحمد محمد الأحمد",
      program: "برنامج تايلاند الكلاسيكي",
      destination: "تايلاند",
      startDate: "2024-02-15",
      endDate: "2024-02-22",
      travelers: 2,
      totalPrice: "7,000 ر.س",
      status: "مؤكد",
      paymentStatus: "مدفوع بالكامل",
      bookingDate: "2024-01-15",
      notes: "يفضل غرف متجاورة"
    },
    {
      id: "BK002",
      customerName: "فاطمة علي السالم",
      program: "برنامج ماليزيا الشامل",
      destination: "ماليزيا",
      startDate: "2024-03-01",
      endDate: "2024-03-08",
      travelers: 4,
      totalPrice: "15,200 ر.س",
      status: "قيد المراجعة",
      paymentStatus: "عربون مدفوع",
      bookingDate: "2024-01-20",
      notes: "سفر عائلي مع أطفال"
    },
    {
      id: "BK003",
      customerName: "محمد عبدالله الخالد",
      program: "برنامج تركيا التاريخي",
      destination: "تركيا",
      startDate: "2024-02-28",
      endDate: "2024-03-05",
      travelers: 1,
      totalPrice: "2,800 ر.س",
      status: "ملغي",
      paymentStatus: "مسترد",
      bookingDate: "2024-01-10",
      notes: "إلغاء لظروف شخصية"
    },
    {
      id: "BK004",
      customerName: "سارة محمود النعيمي",
      program: "برنامج الإمارات السريع",
      destination: "الإمارات",
      startDate: "2024-02-10",
      endDate: "2024-02-13",
      travelers: 1,
      totalPrice: "1,800 ر.س",
      status: "مكتمل",
      paymentStatus: "مدفوع بالكامل",
      bookingDate: "2024-01-05",
      notes: "سفر عمل"
    }
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "مؤكد":
        return "bg-green-100 text-green-800";
      case "قيد المراجعة":
        return "bg-yellow-100 text-yellow-800";
      case "ملغي":
        return "bg-red-100 text-red-800";
      case "مكتمل":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "مدفوع بالكامل":
        return "bg-green-100 text-green-800";
      case "عربون مدفوع":
        return "bg-yellow-100 text-yellow-800";
      case "غير مدفوع":
        return "bg-red-100 text-red-800";
      case "مسترد":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddBooking = () => {
    toast({
      title: "تم إضافة الحجز",
      description: "تم إضافة حجز جديد بنجاح",
    });
    setIsAddingBooking(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">إدارة الحجوزات</CardTitle>
              <CardDescription>تتبع وإدارة جميع الحجوزات والخدمات</CardDescription>
            </div>
            <Dialog open={isAddingBooking} onOpenChange={setIsAddingBooking}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  إضافة حجز جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle>إضافة حجز جديد</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerSelect">العميل</Label>
                    <Select dir="rtl">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر العميل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer1">أحمد محمد الأحمد</SelectItem>
                        <SelectItem value="customer2">فاطمة علي السالم</SelectItem>
                        <SelectItem value="customer3">محمد عبدالله الخالد</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="programSelect">البرنامج</Label>
                    <Select dir="rtl">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر البرنامج" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thailand7">برنامج تايلاند 7 أيام</SelectItem>
                        <SelectItem value="malaysia8">برنامج ماليزيا 8 أيام</SelectItem>
                        <SelectItem value="turkey6">برنامج تركيا 6 أيام</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="startDate">تاريخ البداية</Label>
                    <Input id="startDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="endDate">تاريخ النهاية</Label>
                    <Input id="endDate" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="travelers">عدد المسافرين</Label>
                    <Input id="travelers" type="number" placeholder="عدد المسافرين" />
                  </div>
                  <div>
                    <Label htmlFor="totalPrice">السعر الإجمالي</Label>
                    <Input id="totalPrice" placeholder="السعر بالريال السعودي" className="text-right" dir="rtl" />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="bookingNotes">ملاحظات</Label>
                    <Textarea id="bookingNotes" placeholder="أي ملاحظات خاصة بالحجز" className="text-right" dir="rtl" />
                  </div>
                  <div className="col-span-2">
                    <Button onClick={handleAddBooking} className="w-full">
                      إضافة الحجز
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="البحث في الحجوزات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right"
                dir="rtl"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus} dir="rtl">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="تصفية حسب الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="مؤكد">مؤكد</SelectItem>
                <SelectItem value="قيد المراجعة">قيد المراجعة</SelectItem>
                <SelectItem value="ملغي">ملغي</SelectItem>
                <SelectItem value="مكتمل">مكتمل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow border-r-4 border-r-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-reverse space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">حجز #{booking.id}</h3>
                        <p className="text-gray-600">{booking.customerName}</p>
                      </div>
                    </div>
                    <div className="flex space-x-reverse space-x-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                        {booking.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-gray-600 text-sm">البرنامج:</span>
                      <p className="font-medium">{booking.program}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">الوجهة:</span>
                      <p className="font-medium flex items-center space-x-reverse space-x-1">
                        <Globe className="w-4 h-4" />
                        <span>{booking.destination}</span>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">تاريخ السفر:</span>
                      <p className="font-medium">{booking.startDate} إلى {booking.endDate}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">عدد المسافرين:</span>
                      <p className="font-medium flex items-center space-x-reverse space-x-1">
                        <User className="w-4 h-4" />
                        <span>{booking.travelers}</span>
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">السعر الإجمالي:</span>
                      <p className="font-bold text-blue-600">{booking.totalPrice}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">تاريخ الحجز:</span>
                      <p className="font-medium">{booking.bookingDate}</p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-reverse space-x-2">
                    <Button variant="outline" size="sm">
                      <FileSearch className="w-4 h-4 ml-2" />
                      عرض التفاصيل
                    </Button>
                    <Button variant="outline" size="sm">
                      تعديل الحجز
                    </Button>
                    <Button variant="outline" size="sm">
                      طباعة الفاتورة
                    </Button>
                    {booking.status === "قيد المراجعة" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        تأكيد الحجز
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
