document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const catalogLink = document.getElementById('catalog-link');
    let globalCategories = [];

    // Завантаження каталогу
    function loadCatalog(e) {
        if(e) e.preventDefault();
        mainContent.innerHTML = '<div class="flex justify-center mt-20"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div></div>';
        
        fetch('categories.json')
            .then(response => {
                if (!response.ok) throw new Error("HTTP помилка " + response.status);
                return response.json();
            })
            .then(data => {
                globalCategories = data;
                
                let html = '<div class="text-center mb-12"><h2 class="text-4xl font-extrabold text-white">Виберіть напрямок</h2><div class="w-24 h-1 bg-accent mx-auto mt-4 rounded-full"></div></div>';
                html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-8">';
                
                data.forEach(category => {
                    html += `
                        <div class="glass-card p-8 rounded-2xl cursor-pointer group hover:-translate-y-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] relative overflow-hidden" onclick="loadCategory('${category.shortname}', '${category.name}')">
                            <div class="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 transition group-hover:bg-accent/20"></div>
                            <h3 class="text-2xl font-bold text-white mb-4 relative z-10 group-hover:text-accent transition">${category.name}</h3>
                            <p class="text-gray-400 text-sm leading-relaxed relative z-10">${category.notes}</p>
                            <div class="mt-6 flex items-center text-accent text-sm font-semibold relative z-10">
                                Переглянути тури <span class="ml-2 group-hover:translate-x-2 transition-transform">&rarr;</span>
                            </div>
                        </div>
                    `;
                });
                html += '</div>';

                html += `
                    <div class="mt-16 text-center">
                        <button onclick="loadSpecials()" class="relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-transparent border-2 border-accent rounded-full hover:bg-accent hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent overflow-hidden group">
                            <span class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                            <span class="relative">✨ Відкрити Special Tour</span>
                        </button>
                    </div>
                `;
                
                mainContent.innerHTML = html;
            })
            .catch(error => {
                console.error('Помилка:', error);
                mainContent.innerHTML = `
                    <div class="bg-red-900/20 border border-red-500/50 p-6 rounded-xl text-center max-w-lg mx-auto mt-10">
                        <h3 class="text-red-400 font-bold text-xl mb-2">Помилка завантаження</h3>
                        <p class="text-gray-300">Схоже, ти відкрив файл безпосередньо у браузері. Використай Live Server, щоб запрацював Fetch API.</p>
                    </div>`;
            });
    }

    // Завантаження турів
    window.loadCategory = function(shortname, categoryName) {
        mainContent.innerHTML = '<div class="flex justify-center mt-20"><div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div></div>';
        
        fetch(`${shortname}.json`)
            .then(response => {
                if (!response.ok) throw new Error("HTTP помилка " + response.status);
                return response.json();
            })
            .then(data => {
                let html = `
                    <div class="mb-10 flex items-center">
                        <button onclick="document.getElementById('catalog-link').click()" class="text-gray-400 hover:text-white flex items-center transition bg-surfaceGlow px-4 py-2 rounded-lg border border-white/5 hover:border-white/20">
                            <span class="mr-2">&larr;</span> Назад
                        </button>
                    </div>
                    <div class="text-center mb-12">
                        <h2 class="text-4xl font-extrabold text-white">${categoryName}</h2>
                        <div class="w-24 h-1 bg-accent mx-auto mt-4 rounded-full"></div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                `;
                
                data.forEach(item => {
                    html += `
                        <div class="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(139,92,246,0.3)] flex flex-col">
                            <div class="relative overflow-hidden">
                                <img src="https://placehold.co/400x300/121212/8b5cf6?text=${item.shortname.toUpperCase()}" alt="${item.name}" class="w-full h-48 object-cover transform group-hover:scale-110 transition duration-500">
                                <div class="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
                                <div class="absolute bottom-4 right-4 bg-accent/90 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                                    ${item.price}
                                </div>
                            </div>
                            <div class="p-6 flex flex-col flex-grow">
                                <h4 class="text-xl font-bold text-white mb-2">${item.name}</h4>
                                <p class="text-sm text-gray-400 flex-grow leading-relaxed">${item.description}</p>
                                <button class="mt-6 w-full py-3 rounded-xl bg-surfaceGlow border border-white/5 text-white font-semibold hover:bg-accent hover:border-accent transition-all duration-300">
                                    Детальніше
                                </button>
                            </div>
                        </div>
                    `;
                });
                
                html += '</div>';
                mainContent.innerHTML = html;
            })
            .catch(error => {
                console.error('Помилка:', error);
                mainContent.innerHTML = '<p class="text-red-400 text-center mt-10">Помилка завантаження турів.</p>';
            });
    }

    // Specials
    window.loadSpecials = function() {
        if(globalCategories.length === 0) return;
        const randomIndex = Math.floor(Math.random() * globalCategories.length);
        const randomCategory = globalCategories[randomIndex];
        loadCategory(randomCategory.shortname, "🔥 VIP Пропозиція: " + randomCategory.name);
    }

    catalogLink.addEventListener('click', loadCatalog);
});
