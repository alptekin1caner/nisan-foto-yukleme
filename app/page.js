'use client';
import { useState } from 'react';

async function compressImage(file, maxDim = 1920, quality = 0.82) {
  try {
    const bitmap = await createImageBitmap(file);
    let { width, height } = bitmap;
    if (width > maxDim || height > maxDim) {
      const ratio = Math.min(maxDim / width, maxDim / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
      type: 'image/jpeg',
    });
  } catch (e) {
    return file;
  }
}

export default function Home() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | uploading | success | error
  const [message, setMessage] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (files.length === 0) return;

    setStatus('uploading');
    setMessage('');

    let successCount = 0;
    let firstErrorMsg = null;

    for (let i = 0; i < files.length; i++) {
      setMessage(`Yükleniyor... (${i + 1}/${files.length})`);
      try {
        const compressed = await compressImage(files[i]);
        const formData = new FormData();
        formData.append('files', compressed);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          successCount++;
        } else {
          const data = await res.json().catch(() => ({}));
          if (!firstErrorMsg) {
            firstErrorMsg = data.error || `Sunucu hatası (${res.status})`;
          }
        }
      } catch (err) {
        if (!firstErrorMsg) {
          firstErrorMsg = err?.message || 'Bilinmeyen bağlantı hatası';
        }
      }
    }

    if (successCount === files.length) {
      setStatus('success');
      setMessage(`${successCount} fotoğraf başarıyla yüklendi. Teşekkürler! 💛`);
      setFiles([]);
    } else if (successCount > 0) {
      setStatus('error');
      setMessage(
        `${successCount}/${files.length} fotoğraf yüklendi, bazıları başarısız oldu (${firstErrorMsg}). Tekrar dener misin?`
      );
    } else {
      setStatus('error');
      setMessage(`Yükleme başarısız oldu: ${firstErrorMsg}. Tekrar dener misin?`);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        fontFamily: "'Cormorant Garamond', serif",
        textAlign: 'center',
        background: '#fdf8f0',
        color: '#4a5d3a',
      }}
    >
      <div style={{ width: '100%', maxWidth: 340, position: 'relative' }}>
        <svg
          style={{ position: 'absolute', top: -10, left: -10, width: 90, height: 90 }}
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M5 5 Q30 10 20 35 Q40 25 45 45 Q55 20 70 30" stroke="#8fa876" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="20" cy="35" r="6" fill="#c9b6dd" />
          <circle cx="45" cy="45" r="5" fill="#e8b3c4" />
          <circle cx="70" cy="30" r="5" fill="#f0c98a" />
        </svg>
        <svg
          style={{ position: 'absolute', bottom: -10, right: -10, width: 90, height: 90, transform: 'rotate(180deg)' }}
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <path d="M5 5 Q30 10 20 35 Q40 25 45 45 Q55 20 70 30" stroke="#8fa876" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <circle cx="20" cy="35" r="6" fill="#c9b6dd" />
          <circle cx="45" cy="45" r="5" fill="#e8b3c4" />
          <circle cx="70" cy="30" r="5" fill="#f0c98a" />
        </svg>

        <p
          style={{
            fontSize: 15,
            letterSpacing: 2,
            margin: '0 0 18px',
            color: '#6b7d5a',
          }}
        >
          SÖZ &amp; NİŞAN DAVETİ
        </p>
        <p
          style={{
            fontFamily: "'Alex Brush', cursive",
            fontSize: 46,
            lineHeight: 1.25,
            margin: '0 0 4px',
            color: '#3d4d30',
          }}
        >
          Ceyda
          <br />
          &amp;
          <br />
          Berkan
        </p>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.5,
            margin: '22px 0 26px',
            color: '#555',
          }}
        >
          Bugün çektiğin fotoğrafları buradan bize gönderebilirsin.
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <label
            htmlFor="photo-input"
            style={{
              display: 'block',
              border: '1.5px dashed #b7c4a3',
              borderRadius: 14,
              padding: '22px 16px',
              marginBottom: 18,
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 15, color: '#6b7d5a' }}>
              {files.length > 0
                ? `${files.length} fotoğraf seçildi`
                : 'Fotoğraf seç'}
            </span>
          </label>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            style={{ display: 'none' }}
          />
          <button
            type="submit"
            disabled={status === 'uploading' || files.length === 0}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: 17,
              letterSpacing: 0.5,
              borderRadius: 10,
              border: 'none',
              background:
                status === 'uploading' || files.length === 0
                  ? '#a3ab97'
                  : '#4a5d3a',
              color: '#fdf8f0',
              cursor: files.length === 0 ? 'default' : 'pointer',
              fontFamily: "'Cormorant Garamond', serif",
            }}
          >
            {status === 'uploading'
              ? 'Yükleniyor...'
              : `Yükle${files.length ? ` (${files.length})` : ''}`}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: 20,
              fontSize: 16,
              color: status === 'success' ? '#3d6b2f' : '#a13a2f',
            }}
          >
            {message}
          </p>
        )}
      </div>
    </main>
  );
}
