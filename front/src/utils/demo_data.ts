import { Message } from 'src/types'

export const demoMessages: Message[] = [{
  id: 1,
  icon: 'info',
  color: 'primary',
  type: '系统通知',
  content: '系统将于今晚22:00进行例行维护',
  timestamp: '10分钟前'
},
{
  id: 2,
  icon: 'warning',
  color: 'warning',
  type: '警告',
  content: '您的账户存在异常登录',
  timestamp: '30分钟前'
},
{
  id: 3,
  icon: 'mail',
  color: 'positive',
  type: '新消息',
  content: '您有一条新的未读消息',
  timestamp: '1小时前'
}]
