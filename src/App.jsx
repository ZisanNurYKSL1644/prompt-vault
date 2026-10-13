import { useState, useEffect } from 'react';

function App() {
  // Prompt listesi ve form state'leri
  const [prompts, setPrompts] = useState(() => {
    const saved = localStorage.getItem('prompts');
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Yazılım');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);

  // LocalStorage'a kaydetme
  useEffect(() => {
    localStorage.setItem('prompts', JSON.stringify(prompts));
  }, [prompts]);

  // Ekleme veya Güncelleme İşlemi
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    if (editId) {
      // Güncelleme
      setPrompts(prompts.map(p => p.id === editId ? { ...p, title, category, content } : p));
      setEditId(null);
    } else {
      // Ekleme
      const newPrompt = { id: Date.now(), title, category, content };
      setPrompts([...prompts, newPrompt]);
    }

    setTitle('');
    setContent('');
  };

  // Silme İşlemi
  const handleDelete = (id) => {
    setPrompts(prompts.filter(p => p.id !== id));
  };

  // Düzenleme için form doldurma
  const handleEdit = (prompt) => {
    setEditId(prompt.id);
    setTitle(prompt.title);
    setCategory(prompt.category);
    setContent(prompt.content);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-600">PromptVault 🚀</h1>
          <p className="text-gray-600">Yapay Zeka Komut Yönetim Asistanı</p>
        </header>

        {/* Ekleme / Güncelleme Formu */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">{editId ? 'Promptu Güncelle' : 'Yeni Prompt Ekle'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Prompt Başlığı..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Yazılım">Yazılım</option>
              <option value="Tasarım">Tasarım</option>
              <option value="Metin">Metin Yazarlığı</option>
            </select>
          </div>
          <textarea
            placeholder="Prompt içeriğini buraya yazın..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border p-2 rounded-lg w-full h-24 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            {editId ? 'Güncelle' : 'Ekle'}
          </button>
        </form>

        {/* Listeleme Alanı */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prompts.length === 0 ? (
            <p className="text-gray-500 col-span-2 text-center">Henüz eklenmiş bir prompt yok.</p>
          ) : (
            prompts.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between">
                <div>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">{p.category}</span>
                  <h3 className="text-lg font-bold mt-2 text-gray-800">{p.title}</h3>
                  <p className="text-gray-600 text-sm mt-1 bg-gray-50 p-3 rounded-lg border">{p.content}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-sm bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;