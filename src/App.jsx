import React, { useState, useEffect } from 'react';

export default function App() {
  // LocalStorage'dan mevcut promptları çek veya boş dizi başlat
  const [prompts, setPrompts] = useState(() => {
    const saved = localStorage.getItem('promptVault');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Görsel Oluşturma Promptu', category: 'Tasarım', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
      { id: 2, title: 'Kod Tamamlama Promptu', category: 'Yazılım', content: 'Cod lanawwi dolor sit amet, consectetur adipiscing elit.' },
      { id: 3, title: 'SEO Analiz Promptu', category: 'Pazarlama', content: 'SEO Analiz-dolor sit amet, consectetur adipiscing elit.' }
    ];
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Yazılım');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  
  // Bildirim (Toast) mesajı için state
  const [toastMessage, setToastMessage] = useState(null);

  // State her değiştiğinde LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('promptVault', JSON.stringify(prompts));
  }, [prompts]);

  // Bildirim gösterme fonksiyonu
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Yeni prompt ekleme
  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newPrompt = {
      id: Date.now(),
      title,
      category,
      content,
    };

    setPrompts([newPrompt, ...prompts]);
    setTitle('');
    setContent('');
    showToast('Prompt başarıyla eklendi!');
  };

  // Prompt silme
  const handleDelete = (id) => {
    setPrompts(prompts.filter(p => p.id !== id));
    showToast('Prompt silindi.');
  };

  // Panoya Kopyalama Fonksiyonu
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Panoya kopyalandı! 📋');
  };

  // Arama ve filtreleme mantığı
  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tümü' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 relative">
      
      {/* Şık Toast Bildirim Balonu */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Başlık Alanı */}
        <header className="text-center space-y-2 py-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
            PromptVault
          </h1>
          <p className="text-slate-500 text-sm sm:text-base">Yapay Zeka Komut Yönetim Asistanı</p>
        </header>

        {/* Yeni Prompt Ekleme Formu */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-2">Yeni Prompt Ekle</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Prompt Başlığı..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
              >
                <option value="Yazılım">Yazılım</option>
                <option value="Tasarım">Tasarım</option>
                <option value="Pazarlama">Pazarlama</option>
                <option value="Genel">Genel</option>
              </select>
            </div>
            <textarea
              placeholder="Prompt içeriğini buraya yazın..."
              rows="3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            ></textarea>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all text-sm"
            >
              Prompt Ekle
            </button>
          </form>
        </section>

        {/* Arama ve Filtreleme Çubuğu */}
        <section className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <input
            type="text"
            placeholder="Promptlar içinde ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-72 px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['Tümü', 'Yazılım', 'Tasarım', 'Pazarlama', 'Genel'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Prompt Listesi Kartları */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Kayıtlı Promptlar ({filteredPrompts.length})</h2>
          
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 text-slate-400 text-sm">
              Aradığınız kriterlere uygun prompt bulunamadı.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredPrompts.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between space-y-3 relative group hover:shadow-md transition-all">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-slate-800 text-base">{item.title}</h3>
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-semibold">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-xl border border-slate-100/60 leading-relaxed">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleCopy(item.content)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-all flex items-center gap-1"
                    >
                      📋 Kopyala
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-medium rounded-lg transition-all"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
