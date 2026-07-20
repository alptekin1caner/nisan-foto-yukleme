# Nişan Fotoğraf Yükleme

Davetlilerin QR kod ile açıp fotoğraf yükleyebileceği, yüklenen dosyaların
otomatik olarak senin Google Drive'ına kaydedildiği basit bir web uygulaması.

## Vercel'e Deploy Etme

1. Bu klasörü GitHub'a bir repo olarak yükle (veya Vercel CLI ile doğrudan deploy et).
2. [vercel.com](https://vercel.com) üzerinden **New Project** ile bu repo'yu içe aktar.
3. Deploy etmeden önce (veya ettikten sonra) **Project Settings > Environment Variables**
   kısmına şu değerleri ekle:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REFRESH_TOKEN`
   - `GOOGLE_DRIVE_FOLDER_ID` (opsiyonel — boş bırakılırsa Drive'ın kök dizinine yüklenir)
4. Deploy et. Vercel sana `https://senin-projen.vercel.app` gibi bir adres verecek.
5. Bu adresin QR kodunu oluşturup (örneğin qr-code-generator.com gibi ücretsiz bir
   siteyle) davetlilere göster.

## Drive Klasör ID'sini Nasıl Bulurum?

Google Drive'da fotoğrafların gitmesini istediğin bir klasör oluştur, aç, adres
çubuğundaki URL'ye bak:

```
https://drive.google.com/drive/folders/BURADAKI_KISIM_KLASOR_ID
```

`BURADAKI_KISIM_KLASOR_ID` kısmını kopyalayıp `GOOGLE_DRIVE_FOLDER_ID` olarak gir.

## Yerelde Test Etme (opsiyonel)

```bash
npm install
cp .env.local.example .env.local   # sonra .env.local içine değerleri gir
npm run dev
```
