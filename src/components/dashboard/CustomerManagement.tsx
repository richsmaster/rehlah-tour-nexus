
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, User, Calendar, FileSearch, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CustomerManagementProps {
  currentUser: any;
}

export const CustomerManagement = ({ currentUser }: CustomerManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const { toast } = useToast();

  const customers = [
    {
      id: 1,
      name: "أحمد محمد الأحمد",
      email: "ahmed@email.com",
      phone: "966501234567",
      status: "حجز مؤكد",
      program: "برنامج تايلاند 7 أيام",
      bookingDate: "2024-01-15",
      notes: "يفضل الفنادق 5 نجوم",
      lastContact: "2024-01-10"
    },
    {
      id: 2,
      name: "فاطمة علي السالم",
      email: "fatima@email.com",
      phone: "966507654321",
      status: "استفسار",
      program: "برنامج ماليزيا 10 أيام",
      bookingDate: "",
      notes: "تسأل عن العروض العائلية",
      lastContact: "2024-01-12"
    },
    {
      id: 3,
      name: "محمد عبدالله الخالد",
      email: "mohammed@email.com",
      phone: "966503456789",
      status: "متابعة",
      program: "برنامج تركيا 5 أيام",
      bookingDate: "2024-02-01",
      notes: "يحتاج تأشيرة",
      lastContact: "2024-01-08"
    },
    {
      id: 4,
      name: "سارة محمود النعيمي",
      email: "sarah@email.com",
      phone: "966509876543",
      status: "حجز مؤكد",
      program: "برنامج الإمارات 3 أيام",
      bookingDate: "2024-01-20",
      notes: "سفر عمل",
      lastContact: "2024-01-11"
    }
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm);
    const matchesFilter = filterStatus === "all" || customer.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "حجز مؤكد":
        return "bg-green-100 text-green-800";
      case "استفسار":
        return "bg-blue-100 text-blue-800";
      case "متابعة":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddCustomer = () => {
    toast({
      title: "تم إضافة العميل",
      description: "تم إضافة عميل جديد بنجاح",
    });
    setIsAddingCustomer(false);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">إدارة العملاء</CardTitle>
              <CardDescription>إدارة وتتبع جميع العملاء والاستفسارات</CardDescription>
            </div>
            <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  إضافة عميل جديد
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                  <DialogTitle>إضافة عميل جديد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="customerName">الاسم</Label>
                    <Input id="customerName" placeholder="اسم العميل" className="text-right" dir="rtl" />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">البريد الإلكتروني</Label>
                    <Input id="customerEmail" type="email" placeholder="البريد الإلكتروني" className="text-right" dir="rtl" />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">رقم الهاتف</Label>
                    <Input id="customerPhone" placeholder="رقم الهاتف" className="text-right" dir="rtl" />
                  </div>
                  <div>
                    <Label htmlFor="customerStatus">حالة العميل</Label>
                    <Select dir="rtl">
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الحالة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inquiry">استفسار</SelectItem>
                        <SelectItem value="booking">حجز مؤكد</SelectItem>
                        <SelectItem value="followup">متابعة</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="customerNotes">ملاحظات</Label>
                    <Textarea id="customerNotes" placeholder="أي ملاحظات إضافية" className="text-right" dir="rtl" />
                  </div>
                  <Button onClick={handleAddCustomer} className="w-full">
                    إضافة العميل
                  </Button>
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
                placeholder="البحث في العملاء..."
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
                <SelectItem value="حجز مؤكد">حجز مؤكد</SelectItem>
                <SelectItem value="استفسار">استفسار</SelectItem>
                <SelectItem value="متابعة">متابعة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-reverse space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{customer.name}</h3>
                        <p className="text-gray-600">{customer.email}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-reverse space-x-2">
                      <span className="text-gray-600">الهاتف:</span>
                      <span className="font-medium">{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <span className="text-gray-600">البرنامج:</span>
                      <span className="font-medium">{customer.program}</span>
                    </div>
                    <div className="flex items-center space-x-reverse space-x-2">
                      <span className="text-gray-600">آخر تواصل:</span>
                      <span className="font-medium">{customer.lastContact}</span>
                    </div>
                  </div>

                  {customer.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{customer.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-end space-x-reverse space-x-2">
                    <Button variant="outline" size="sm">
                      <FileSearch className="w-4 h-4 ml-2" />
                      عرض التفاصيل
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 ml-2" />
                      تواصل
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="w-4 h-4 ml-2" />
                      إضافة حجز
                    </Button>
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
