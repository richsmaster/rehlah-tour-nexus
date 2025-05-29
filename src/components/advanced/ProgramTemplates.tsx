
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Crown, MapPin, Clock, Users, Sparkles } from 'lucide-react';

interface ProgramTemplate {
  id: string;
  name: string;
  country: string;
  duration: string;
  price: string;
  cities: string[];
  hotels: string[];
  activities: string[];
  includes: string[];
  description: string;
  category: string;
  difficulty_level: string;
  min_participants: number;
  max_participants: number;
  season: string;
  featured_image: string;
  gallery: string[];
  isLuxury: boolean;
  rating: number;
}

const luxuryTemplates: ProgramTemplate[] = [
  {
    id: 'luxury-maldives',
    name: 'جزر المالديف الفاخرة - تجربة الجنة الاستوائية',
    country: 'جزر المالديف',
    duration: '7 أيام / 6 ليالي',
    price: '15,000 ر.س',
    cities: ['ماليه', 'باا أتول', 'أري أتول'],
    hotels: ['منتجع سونيفا فوشي 5 نجوم', 'منتجع كونراد المالديف رانجالي أيلاند', 'منتجع شانجريلا فيلينجيلي'],
    activities: ['غوص مع أسماك القرش الحوت', 'عشاء تحت الماء', 'رحلة يخت خاص', 'سبا تقليدي مالديفي', 'رياضات مائية فاخرة'],
    includes: ['طيران درجة أولى', 'إقامة فيلا مائية خاصة', 'وجبات فاخرة', 'نقل بطائرة مائية', 'خدمة الخادم الشخصي'],
    description: 'استمتع بتجربة لا تُنسى في أفخم منتجعات جزر المالديف مع إقامة في فيلات مائية خاصة وخدمات حصرية على مدار 24 ساعة.',
    category: 'رفاهية وفخامة',
    difficulty_level: 'سهل',
    min_participants: 2,
    max_participants: 8,
    season: 'نوفمبر - أبريل',
    featured_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=400',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
      'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=400'
    ],
    isLuxury: true,
    rating: 5
  },
  {
    id: 'luxury-dubai',
    name: 'دبي الفاخرة - مدينة المستقبل والرفاهية',
    country: 'الإمارات العربية المتحدة',
    duration: '5 أيام / 4 ليالي',
    price: '8,500 ر.س',
    cities: ['دبي', 'أبوظبي'],
    hotels: ['برج العرب جميرا', 'أرماني هوتل دبي', 'فور سيزونز ريزورت دبي'],
    activities: ['جولة بالهليكوبتر فوق دبي', 'سفاري صحراوي فاخر', 'تسوق في دبي مول', 'عشاء في برج خليفة', 'رحلة يخت في دبي مارينا'],
    includes: ['طيران درجة رجال الأعمال', 'إقامة أجنحة ملكية', 'وجبات في أفخم المطاعم', 'نقل بسيارات فاخرة', 'مرشد سياحي خاص'],
    description: 'اكتشف روعة دبي الحديثة مع إقامة في أفخم الفنادق وتجارب حصرية لا تُنسى في مدينة الأحلام.',
    category: 'مدن حديثة',
    difficulty_level: 'سهل',
    min_participants: 1,
    max_participants: 6,
    season: 'أكتوبر - مارس',
    featured_image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400',
      'https://images.unsplash.com/photo-1546412414-e1885259563a?w=400',
      'https://images.unsplash.com/photo-1583419320021-04a2c5e94e6b?w=400'
    ],
    isLuxury: true,
    rating: 5
  },
  {
    id: 'luxury-switzerland',
    name: 'سويسرا الفاخرة - جبال الألب والبحيرات الكريستالية',
    country: 'سويسرا',
    duration: '8 أيام / 7 ليالي',
    price: '18,000 ر.س',
    cities: ['زيورخ', 'انترلاكن', 'زيرمات', 'جنيف'],
    hotels: ['دولدر جراند زيورخ', 'فيكتوريا يونغفراو انترلاكن', 'مونت سيرفين بالاس زيرمات'],
    activities: ['جولة بالقطار الذهبي', 'رحلة لقمة جونغفراو', 'تزلج في زيرمات', 'رحلة بحيرة جنيف', 'زيارة مصانع الشوكولاتة الفاخرة'],
    includes: ['طيران درجة أولى', 'إقامة قصور فاخرة', 'وجبات أوروبية راقية', 'نقل بقطارات فاخرة', 'جولات خاصة'],
    description: 'تمتع بجمال الطبيعة السويسرية الخلابة مع إقامة في أفخم القصور الجبلية وتجارب حصرية في قلب جبال الألب.',
    category: 'طبيعة وجبال',
    difficulty_level: 'متوسط',
    min_participants: 2,
    max_participants: 10,
    season: 'مايو - سبتمبر / ديسمبر - مارس',
    featured_image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    gallery: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
      'https://images.unsplash.com/photo-1530841344095-21b43f867a82?w=400',
      'https://images.unsplash.com/photo-1543970950-ee851c4b5ca9?w=400'
    ],
    isLuxury: true,
    rating: 5
  }
];

interface ProgramTemplatesProps {
  onSelectTemplate: (template: ProgramTemplate) => void;
}

export const ProgramTemplates = ({ onSelectTemplate }: ProgramTemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<ProgramTemplate | null>(null);

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">البرامج العالمية الراقية</h2>
        <p className="text-gray-600">قوالب جاهزة لأفخم البرامج السياحية العالمية</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {luxuryTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
            <div className="relative">
              <img 
                src={template.featured_image} 
                alt={template.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-0">
                  <Crown className="w-3 h-3 ml-1" />
                  راقي
                </Badge>
              </div>
              <div className="absolute top-4 left-4">
                <div className="flex items-center space-x-reverse space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  {[...Array(template.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
              <CardDescription className="flex items-center space-x-reverse space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{template.country}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-reverse space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{template.duration}</span>
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {template.price}
                </div>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2">{template.description}</p>

              <div className="flex flex-wrap gap-1">
                {template.cities.slice(0, 2).map((city, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {city}
                  </Badge>
                ))}
                {template.cities.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{template.cities.length - 2} المزيد
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-reverse space-x-1 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{template.min_participants}-{template.max_participants}</span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      معاينة وتطبيق
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-xl">{template.name}</DialogTitle>
                      <DialogDescription>معاينة تفاصيل البرنامج الراقي</DialogDescription>
                    </DialogHeader>

                    {selectedTemplate && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <img 
                            src={selectedTemplate.featured_image} 
                            alt={selectedTemplate.name}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">الدولة</label>
                                <p className="font-semibold">{selectedTemplate.country}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">المدة</label>
                                <p className="font-semibold">{selectedTemplate.duration}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">السعر</label>
                                <p className="font-semibold text-green-600">{selectedTemplate.price}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">الفئة</label>
                                <p className="font-semibold">{selectedTemplate.category}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">الوصف</label>
                          <p className="mt-1 text-gray-700">{selectedTemplate.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-500">المدن</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedTemplate.cities.map((city, index) => (
                                <Badge key={index} variant="outline">{city}</Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500">الفنادق</label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedTemplate.hotels.slice(0, 2).map((hotel, index) => (
                                <Badge key={index} variant="outline" className="text-xs">{hotel}</Badge>
                              ))}
                              {selectedTemplate.hotels.length > 2 && (
                                <Badge variant="outline" className="text-xs">+{selectedTemplate.hotels.length - 2} المزيد</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-500">الأنشطة المميزة</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {selectedTemplate.activities.map((activity, index) => (
                              <Badge key={index} variant="secondary" className="bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700">
                                <Sparkles className="w-3 h-3 ml-1" />
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-reverse space-x-4">
                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600">
                              <Crown className="w-3 h-3 ml-1" />
                              برنامج راقي
                            </Badge>
                            <div className="flex items-center space-x-reverse space-x-1">
                              {[...Array(selectedTemplate.rating)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <Button 
                            onClick={() => onSelectTemplate(selectedTemplate)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                          >
                            <Sparkles className="w-4 h-4 ml-2" />
                            تطبيق هذا القالب
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
