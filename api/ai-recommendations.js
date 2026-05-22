export default function handler(req, res) {
  res.status(200).json({
    version: '2.1.0',
    mode: 'safe-demo',
    note: 'Gerçek AI öneri için oyun verileri ve kullanıcı izleme geçmişi Supabase/ENV ile bağlanabilir.',
    recommendations: [
      { title: 'Alan Wake 2 devam et', confidence: 94, reason: 'Korku + hikaye etiketleri güçlü eşleşiyor.' },
      { title: 'Outlast Trials başlat', confidence: 87, reason: 'Korku kategorisinde yeni seri boşluğu var.' }
    ]
  });
}
