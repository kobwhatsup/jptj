import { Law } from '../types/law';

export const laws: Law[] = [
  {
    id: '1',
    title: '中华人民共和国人民调解法',
    content: '为了完善人民调解制度，规范人民调解工作，发挥人民调解在维护社会和谐稳定中的作用，制定本法。',
    category: '民事调解',
    publishDate: '2010-08-28',
    effectiveDate: '2011-01-01',
    department: '全国人民代表大会常务委员会',
    level: '法律',
    status: 'active',
  },
  {
    id: '2',
    title: '人民调解委员会组织条例',
    content: '为了加强人民调解委员会组织建设，充分发挥人民调解在化解矛盾纠纷中的作用，制定本条例。',
    category: '基层调解',
    publishDate: '2019-03-15',
    effectiveDate: '2019-04-01',
    department: '司法部',
    level: '部门规章',
    status: 'active',
  },
  {
    id: '3',
    title: '最高人民法院关于人民调解协议司法确认程序的规定',
    content: '为了规范人民调解协议司法确认程序，依法保护当事人合法权益，根据《中华人民共和国民事诉讼法》等法律规定，制定本规定。',
    category: '民事调解',
    publishDate: '2020-02-25',
    effectiveDate: '2020-03-01',
    department: '最高人民法院',
    level: '司法解释',
    status: 'active',
  }
];