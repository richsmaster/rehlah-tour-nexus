
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Tag, Globe, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProgramCategory {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

interface City {
  id: string;
  name: string;
  country_id: string;
  created_at: string;
}

interface CategoriesManagementProps {
  categories: ProgramCategory[];
  countries: Country[];
  cities: City[];
  onCategoriesUpdate: () => void;
  canManage: boolean;
}

export const CategoriesManagement = ({ 
  categories, 
  countries, 
  cities, 
  onCategoriesUpdate, 
  canManage 
}: CategoriesManagementProps) => {
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isCountryDialogOpen, setIsCountryDialogOpen] = useState(false);
  const [isCityDialogOpen, setIsCityDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ProgramCategory | null>(null);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(false);

  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    description: ''
  });

  const [countryFormData, setCountryFormData] = useState({
    name: '',
    code: ''
  });

  const [cityFormData, setCityFormData] = useState({
    name: '',
    country_id: ''
  });

  const { toast } = useToast();

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: '',
      description: ''
    });
    setEditingCategory(null);
  };

  const resetCountryForm = () => {
    setCountryFormData({
      name: '',
      code: ''
    });
    setEditingCountry(null);
  };

  const resetCityForm = () => {
    setCityFormData({
      name: '',
      country_id: ''
    });
    setEditingCity(null);
  };

  const handleCategoryEdit = (category: ProgramCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      description: category.description || ''
    });
    setIsCategoryDialogOpen(true);
  };

  const handleCountryEdit = (country: Country) => {
    setEditingCountry(country);
    setCountryFormData({
      name: country.name,
      code: country.code
    });
    setIsCountryDialogOpen(true);
  };

  const handleCityEdit = (city: City) => {
    setEditingCity(city);
    setCityFormData({
      name: city.name,
      country_id: city.country_id
    });
    setIsCityDialogOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('program_categories')
          .update(categoryFormData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث الفئة بنجاح',
        });
      } else {
        const { error } = await supabase
          .from('program_categories')
          .insert([categoryFormData]);

        if (error) throw error;
        toast({
          title: 'تم الإضافة بنجاح',
          description: 'تم إضافة الفئة الجديدة بنجاح',
        });
      }

      setIsCategoryDialogOpen(false);
      resetCategoryForm();
      onCategoriesUpdate();
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ الفئة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCountry) {
        const { error } = await supabase
          .from('countries')
          .update(countryFormData)
          .eq('id', editingCountry.id);

        if (error) throw error;
        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث الدولة بنجاح',
        });
      } else {
        const { error } = await supabase
          .from('countries')
          .insert([countryFormData]);

        if (error) throw error;
        toast({
          title: 'تم الإضافة بنجاح',
          description: 'تم إضافة الدولة الجديدة بنجاح',
        });
      }

      setIsCountryDialogOpen(false);
      resetCountryForm();
      onCategoriesUpdate();
    } catch (error) {
      console.error('Error saving country:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ الدولة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingCity) {
        const { error } = await supabase
          .from('cities')
          .update(cityFormData)
          .eq('id', editingCity.id);

        if (error) throw error;
        toast({
          title: 'تم التحديث بنجاح',
          description: 'تم تحديث المدينة بنجاح',
        });
      } else {
        const { error } = await supabase
          .from('cities')
          .insert([cityFormData]);

        if (error) throw error;
        toast({
          title: 'تم الإضافة بنجاح',
          description: 'تم إضافة المدينة الجديدة بنجاح',
        });
      }

      setIsCityDialogOpen(false);
      resetCityForm();
      onCategoriesUpdate();
    } catch (error) {
      console.error('Error saving city:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حفظ المدينة',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الفئة؟')) return;

    try {
      const { error } = await supabase
        .from('program_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف الفئة بنجاح',
      });
      onCategoriesUpdate();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف الفئة',
        variant: 'destructive',
      });
    }
  };

  const handleCountryDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الدولة؟ سيتم حذف جميع المدن المرتبطة بها.')) return;

    try {
      const { error } = await supabase
        .from('countries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف الدولة بنجاح',
      });
      onCategoriesUpdate();
    } catch (error) {
      console.error('Error deleting country:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف الدولة',
        variant: 'destructive',
      });
    }
  };

  const handleCityDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المدينة؟')) return;

    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'تم الحذف بنجاح',
        description: 'تم حذف المدينة بنجاح',
      });
      onCategoriesUpdate();
    } catch (error) {
      console.error('Error deleting city:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ في حذف المدينة',
        variant: 'destructive',
      });
    }
  };

  const getCountryName = (countryId: string) => {
    const country = countries.find(c => c.id === countryId);
    return country ? country.name : 'غير محدد';
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h3 className="text-xl font-bold text-gray-900">إدارة الفئات والتصنيفات</h3>
        <p className="text-gray-600">إدارة فئات البرامج والدول والمدن السياحية</p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories">فئات البرامج</TabsTrigger>
          <TabsTrigger value="countries">الدول</TabsTrigger>
          <TabsTrigger value="cities">المدن</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">فئات البرامج السياحية</h4>
            {canManage && (
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                    onClick={resetCategoryForm}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة فئة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCategory ? 'تعديل الفئة' : 'إضافة فئة جديدة'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCategory ? 'قم بتعديل بيانات الفئة' : 'أدخل بيانات الفئة الجديدة'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="category_name">اسم الفئة</Label>
                      <Input
                        id="category_name"
                        value={categoryFormData.name}
                        onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                        placeholder="برامج عائلية"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category_description">وصف الفئة</Label>
                      <Textarea
                        id="category_description"
                        value={categoryFormData.description}
                        onChange={(e) => setCategoryFormData({...categoryFormData, description: e.target.value})}
                        placeholder="وصف تفصيلي للفئة"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'جاري الحفظ...' : editingCategory ? 'تحديث' : 'إضافة'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-reverse space-x-2">
                        <Tag className="w-5 h-5 text-orange-600" />
                        <span>{category.name}</span>
                      </CardTitle>
                      {category.description && (
                        <CardDescription className="mt-1">{category.description}</CardDescription>
                      )}
                    </div>
                    {canManage && (
                      <div className="flex items-center space-x-reverse space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCategoryEdit(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCategoryDelete(category.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="countries" className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">الدول السياحية</h4>
            {canManage && (
              <Dialog open={isCountryDialogOpen} onOpenChange={setIsCountryDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={resetCountryForm}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة دولة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCountry ? 'تعديل الدولة' : 'إضافة دولة جديدة'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCountry ? 'قم بتعديل بيانات الدولة' : 'أدخل بيانات الدولة الجديدة'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCountrySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="country_name">اسم الدولة</Label>
                      <Input
                        id="country_name"
                        value={countryFormData.name}
                        onChange={(e) => setCountryFormData({...countryFormData, name: e.target.value})}
                        placeholder="تايلاند"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country_code">رمز الدولة</Label>
                      <Input
                        id="country_code"
                        value={countryFormData.code}
                        onChange={(e) => setCountryFormData({...countryFormData, code: e.target.value.toUpperCase()})}
                        placeholder="TH"
                        maxLength={2}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCountryDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'جاري الحفظ...' : editingCountry ? 'تحديث' : 'إضافة'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {countries.map((country) => (
              <Card key={country.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-reverse space-x-2">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold">{country.name}</span>
                      </div>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {country.code}
                      </Badge>
                    </div>
                    {canManage && (
                      <div className="flex items-center space-x-reverse space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCountryEdit(country)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCountryDelete(country.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cities" className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">المدن السياحية</h4>
            {canManage && (
              <Dialog open={isCityDialogOpen} onOpenChange={setIsCityDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                    onClick={resetCityForm}
                  >
                    <Plus className="w-4 h-4 ml-2" />
                    إضافة مدينة جديدة
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg" dir="rtl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingCity ? 'تعديل المدينة' : 'إضافة مدينة جديدة'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingCity ? 'قم بتعديل بيانات المدينة' : 'أدخل بيانات المدينة الجديدة'}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleCitySubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="city_name">اسم المدينة</Label>
                      <Input
                        id="city_name"
                        value={cityFormData.name}
                        onChange={(e) => setCityFormData({...cityFormData, name: e.target.value})}
                        placeholder="بانكوك"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city_country">الدولة</Label>
                      <select
                        id="city_country"
                        value={cityFormData.country_id}
                        onChange={(e) => setCityFormData({...cityFormData, country_id: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">اختر الدولة</option>
                        {countries.map((country) => (
                          <option key={country.id} value={country.id}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCityDialogOpen(false)}>
                        إلغاء
                      </Button>
                      <Button type="submit" disabled={loading}>
                        {loading ? 'جاري الحفظ...' : editingCity ? 'تحديث' : 'إضافة'}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Card key={city.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-reverse space-x-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="font-semibold">{city.name}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {getCountryName(city.country_id)}
                      </p>
                    </div>
                    {canManage && (
                      <div className="flex items-center space-x-reverse space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCityEdit(city)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCityDelete(city.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
