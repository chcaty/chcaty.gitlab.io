---
title: CSharp-Aes加密
date: 2019-05-27 21:55:14
categories: C# 
tags: 
 - 加密
 - C#
---
#### 起源
最近负责的一个项目,对接的东西刚好有需要用到AES加密,就顺便学习记录一下
<!--more-->
#### Aes是什么
在密码学中又称Rijndael加密法，是美国联邦政府采用的一种区块加密标准,是对称密钥加密中最流行的算法之一

#### Aes加密
```cs
/// <summary>
/// Aes加密 
/// </summary>
/// <param name="text">明文</param>
/// <param name="password">密钥</param>
/// <param name="iv">偏移量</param>
/// <returns>密文</returns>
public static string AesEncrypt(string text, string password, string iv)
{

    byte[] pwdBytes = Encoding.UTF8.GetBytes(password);
    byte[] keyBytes = new byte[16];
    int len = pwdBytes.Length;
    if (len > keyBytes.Length)
        len = keyBytes.Length;
    Array.Copy(pwdBytes, keyBytes, len);
    RijndaelManaged rhinelandCipher = new RijndaelManaged()
    {
        Mode = CipherMode.CBC,
        Padding = PaddingMode.Zeros,
        KeySize = 128,
        BlockSize = 128,
        Key = keyBytes,
        IV = Encoding.UTF8.GetBytes(iv)
    };

    ICryptoTransform transform = rhinelandCipher.CreateEncryptor();
    byte[] plainText = Encoding.UTF8.GetBytes(text);
    byte[] cipherBytes = transform.TransformFinalBlock(plainText, 0, plainText.Length);

    return Convert.ToBase64String(cipherBytes);

}
```

#### Aes解密
```cs
/// <summary>
/// Aes解密
/// </summary>
/// <param name="text">密文</param>
/// <param name="password">密钥</param>
/// <param name="iv">偏移量</param>
/// <returns>明文</returns>
public static string AesDecrypt(string text, string password, string iv)
{
    byte[] encryptedData = Convert.FromBase64String(text);
    byte[] pwdBytes = Encoding.UTF8.GetBytes(password);
    byte[] keyBytes = new byte[16];
    int len = pwdBytes.Length;
    if (len > keyBytes.Length) 
        len = keyBytes.Length;
    Array.Copy(pwdBytes, keyBytes, len);
    RijndaelManaged rhinelandCipher = new RijndaelManaged()
    {
        Mode = CipherMode.CBC,
        Padding = PaddingMode.Zeros,
        KeySize = 128,
        BlockSize = 128,
        Key = keyBytes,
        IV = Encoding.UTF8.GetBytes(iv)
    };

    ICryptoTransform transform = rhinelandCipher.CreateDecryptor();
    byte[] plainText = transform.TransformFinalBlock(encryptedData, 0, encryptedData.Length);
    return Encoding.UTF8.GetString(plainText);
}
```

#### 调用
```cs
static void Main(string[] args)
{
    //密钥
    string password = "1234567890123456";
    //加密初始化向量
    string iv = "1234567887654321";
    string message = AesEncrypt("abcdefghigklmnopqrstuvwxyz0123456789", password, iv);
    Console.WriteLine(message);
    message = AesDecrypt("S8AclhU3eZDc0zV+upMD1dnm3ZwhoH+lNIA4U6+6O1w8QFy55oYo3fwgYUQdNNn0", password, iv);
    Console.WriteLine(message);
}
```
