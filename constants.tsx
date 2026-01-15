
import { AchievementType, Achievement, SocialInitiative, Talent, Project, Newborn, Newlywed } from './types';

export const FAMILY_NAME = "أواصر";
export const FAMILY_DESCENDANTS = "ذرية محي الدين مليباري";
export const FOUNDER_NAME = "محي الدين مليباري";
export const FOUNDER_BIO = "رجل العلم والتقوى، الذي غرس في ذريته حب الخير والترابط، وبنى إرثاً يفتخر به أبناؤه وأحفاده في حواري مكة العريقة.";

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'أحمد مليباري', type: AchievementType.PHD, description: 'دكتوراه في علوم الحاسب من جامعة الملك سعود', year: '2023', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'سارة مليباري', type: AchievementType.MASTERS, description: 'ماجستير في إدارة الأعمال الدولية من جامعة الملك عبدالعزيز', year: '2024', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
];

export const MOCK_INITIATIVES: SocialInitiative[] = [
  { id: '1', title: 'حملة إفطار صائم بالكدوة', description: 'إحياءً لذكرى الجد، بادر شباب العائلة بتوزيع الوجبات في حارة الكدوة بمكة المكرمة.', date: 'رمضان 1445', image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800' },
];

export const MOCK_NEWBORNS: Newborn[] = [
  { id: '1', name: 'نورة', parents: 'خالد محمد مليباري', date: 'شوال 1445', image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65ee9?auto=format&fit=crop&q=80&w=400' },
  { id: '2', name: 'محي الدين', parents: 'عبدالله أحمد مليباري', date: 'رمضان 1445', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400' }
];

export const MOCK_NEWLYWEDS: Newlywed[] = [
  { id: '1', names: 'فهد مليباري & كريمة آل فلان', date: 'رجب 1445', image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800' }
];

export const MOCK_TALENTS: Talent[] = [
  { id: '1', owner: 'نورة مليباري', talentType: 'رسم', title: 'لوحات تراثية مكية', content: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200', description: 'مجموعة من الرسومات تحاكي الزوايا العتيقة في مكة.', date: '١٤٤٥ هـ' }
];

export const MOCK_PROJECTS: Project[] = [
  { id: '1', owner: 'ليلى مليباري', name: 'متجر شغف', description: 'مشروع متخصص في الهدايا اليدوية والتغليف الفاخر.', link: '#', logo: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=200' },
];
