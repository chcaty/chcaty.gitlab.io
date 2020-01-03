---
title: CSharp-发送邮件
date: 2019-05-30 00:08:16
categories: C# 
tags: 
 - 邮件
 - C#
---
#### 起源
最近负责的一个项目,客户提了一个需求,自动导出输出,按格式生成xls,并将xls文件当成附件发送邮件,就此,研究了一下C#怎么发送邮件.
<!--more-->

#### MailHelper.cs
```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;

namespace FrmSendMail
{
    class MailHelper
    {

        /// 正则表达式检测Email格式
        /// </summary>
        /// <param name="Email"></param>
        /// <returns></returns>
        public static bool CheckEmail(string Email)
        {
            bool Flag = false;
            string str = "([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,5})+";
            string[] result = GetPathPoint(Email, str);
            if (result != null)
            {
                Flag = result.Contains(Email) ? true : Flag;
            }

            return Flag;
        }

        /// <summary>
        /// 获取正则表达式匹配结果集
        /// </summary>
        /// <param name="value">字符串</param>
        /// <param name="regx">正则表达式</param>
        /// <returns></returns>
        public static string[] GetPathPoint(string value, string regx)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;
            bool isMatch = System.Text.RegularExpressions.Regex.IsMatch(value, regx);
            if (!isMatch)
                return null;
            System.Text.RegularExpressions.MatchCollection matchCol = System.Text.RegularExpressions.Regex.Matches(value, regx);
            string[] result = new string[matchCol.Count];
            if (matchCol.Count > 0)
            {
                for (int i = 0; i < matchCol.Count; i++)
                {
                    result[i] = matchCol[i].Value;
                }
            }
            return result;
        }

        /// <summary>
        /// 设置邮件信息
        /// </summary>
        /// <param name="strToAddress">收件人地址,多个用;分隔</param>
        /// <param name="strCcAddress">抄送人地址,多个用;分隔</param>
        /// <param name="strSendAddress">发件人地址</param>
        /// <param name="strSendName">发件人姓名</param>
        /// <param name="strSubject">邮件主题</param>
        /// <param name="strBody">邮件内容</param>
        /// <param name="strFilePath">邮件附件(绝对路径)</param>
        /// <returns></returns>
        public static MailMessage SetMailInfo(string strToAddress, string strCcAddress, string strSendAddress, string strSendName, string strSubject, string strBody, string strFilePath)
        {
            MailMessage msg = new System.Net.Mail.MailMessage();
            //收件人邮箱
            string[] toToAddressStrings = strToAddress.Split(";");
            foreach (var str in toToAddressStrings)
            {
                if (CheckEmail(str))
                {
                    msg.To.Add(str);
                }
            }
            //抄送人邮箱
            string[] toCcAddressStrings = strCcAddress.Split(";");
            foreach (var str in toCcAddressStrings)
            {
                if (CheckEmail(str))
                {
                    msg.CC.Add(str);
                }
            }
            //发件人信息(地址,姓名,(编码))
            msg.From = new MailAddress(strSendAddress, strSendName, Encoding.UTF8);
            //邮件标题
            msg.Subject = strSubject;
            //邮件标题编码 
            msg.SubjectEncoding = Encoding.UTF8;
            //邮件内容   
            msg.Body = strBody;
            //邮件内容编码   
            msg.BodyEncoding = Encoding.UTF8;
            //邮件附件,第二个参数表示附件的文件类型，可以不用指定
            if (!string.IsNullOrWhiteSpace(strFilePath))
            {
                msg.Attachments.Add(new Attachment(strFilePath, System.Net.Mime.MediaTypeNames.Application.Rtf));
            }

            //是否是HTML邮件   
            msg.IsBodyHtml = false;
            msg.Priority = MailPriority.High;//邮件优先级   
            return msg;
        }

        /// <summary>
        /// localhost 发送邮件(需要在本地搭建SMTP服务器)
        /// </summary>
        /// <param name="msg"></param>
        /// <returns></returns>
        public static string SendMailLocalhost(MailMessage msg)
        {
            SmtpClient client = new SmtpClient();
            client.Host = "localhost";
            object userState = msg;
            try
            {
                //client.SendAsync(msg, userState);
                client.Send(msg);  
                //简单一点儿可以client.Send(msg);   
                return "发送成功";
            }
            catch (SmtpException ex)
            {
                return "发送邮件出错" + ex.Message;
            }
        }

        /// <summary>
        /// SMTP发送邮件
        /// </summary>
        /// <param name="msg"></param>
        /// <param name="strSendAddress"></param>
        /// <param name="strSmtp"></param>
        /// <returns></returns>
        public static string SendMailUseSmtp(MailMessage msg, string strSendAddress, string strSmtp)
        {
            SmtpClient client = new SmtpClient();
            //邮箱和SMTP授权码
            client.Credentials = new System.Net.NetworkCredential(strSendAddress, strSmtp);
            client.Host = "smtp.qq.com";
            object userState = msg;
            try
            {
                //client.SendAsync(msg, userState);
                client.Send(msg);
                //简单一点儿可以client.Send(msg);   
                return "发送成功";
            }
            catch (System.Net.Mail.SmtpException ex)
            {
                return "发送邮件出错" + ex.Message;
            }
        }

        /// <summary>
        /// SSL-SMTP发送邮件
        /// </summary>
        /// <param name="msg"></param>
        /// <param name="strSendAddress"></param>
        /// <param name="strSmtp"></param>
        /// <returns></returns>
        public static string SendMailUseSslSmtp(MailMessage msg,string strSendAddress,string strSmtp)
        {
            SmtpClient client = new SmtpClient();
            //GMail邮箱和SMTP授权码
            client.Credentials = new System.Net.NetworkCredential(strSendAddress, strSmtp);
            client.Port = 587;//Gmail使用的端口   
            client.Host = "smtp.qq.com";
            client.EnableSsl = true;//经过ssl加密   
            object userState = msg;
            try
            {
                //client.SendAsync(msg, userState);
                client.Send(msg);
                //简单一点儿可以client.Send(msg);   
                return "发送成功";
            }
            catch (System.Net.Mail.SmtpException ex)
            {
                return "发送邮件出错" + ex.Message;
            }
        }
    }
}
```

#### 调用
```cs
using System;
using System.Net.Mail;

namespace FrmSendMail
{
    class Program
    {
        static void Main(string[] args)
        {
            MailMessage mailInfo = MailHelper.SetMailInfo("a@qq.com", "b@qq.com", "c@qq.com",
                "localhost",
                "localhost测试", "内容测试", "");
            string msg = MailHelper.SendMailLocalhost(mailInfo);
            Console.WriteLine(msg);
            mailInfo = MailHelper.SetMailInfo("a@qq.com", "b@qq.com", "c@qq.com",
                "SMTP",
                "SMTP测试", "内容测试", "");
            msg = MailHelper.SendMailUseSmtp(mailInfo, "c@qq.com", "授权码");
            Console.WriteLine(msg);
            mailInfo = MailHelper.SetMailInfo("a@qq.com", "b@qq.com", "c@qq.com",
                "SSL-SMTP",
                "SSL-SMTP测试", "内容测试", "");
            msg = MailHelper.SendMailUseSslSmtp(mailInfo, "c@qq.com", "授权码");
            Console.WriteLine(msg);
        }

    }
}
```