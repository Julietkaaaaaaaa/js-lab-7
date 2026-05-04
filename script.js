document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const catalogLink = document.getElementById('catalog-link');
    let globalCategories = [];

    // Завантаження каталогу категорій
    function loadCatalog(e) {
        if(e) e.preventDefault();
        mainContent.innerHTML = '<div class="text-center mt-20 text-accent">Завантаження каталогу...</div>';
        
        fetch('categories.json')
            .then(response => {
                if (!response.ok) throw new Error("HTTP помилка");
                return response.json();
            })
            .then(data => {
                globalCategories = data;
                
                let html = '<h2 class="text-3xl font-bold text-white text-center mb-10">Категорії товарів</h2>';
                html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">';
                
                data.forEach(category => {
                    html += `
                        <div class="glass-card p-6 rounded-xl cursor-pointer hover:border-accent transition duration-300" onclick="loadCategory('${category.shortname}', '${category.name}')">
                            <h3 class="text-xl font-bold text-white mb-2">${category.name}</h3>
                            <p class="text-gray-400 text-sm mb-4">${category.notes}</p>
                            <span class="text-accent text-sm font-semibold">Перейти в розділ &rarr;</span>
                        </div>
                    `;
                });
                html += '</div>';

                // Кнопка Specials (вимагалася за лекцією)
                html += `
                    <div class="mt-12 text-center pt-8 border-t border-gray-800">
                        <button onclick="loadSpecials()" class="bg-accent text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-medium">
                            Показати випадкову категорію
                        </button>
                    </div>
                `;
                
                mainContent.innerHTML = html;
            })
            .catch(error => {
                console.error('Помилка:', error);
                mainContent.innerHTML = '<p class="text-red-500 text-center mt-10">Помилка завантаження (не забудьте запустити через Live Server).</p>';
            });
    }

    // Завантаження товарів
    window.loadCategory = function(shortname, categoryName) {
        mainContent.innerHTML = '<div class="text-center mt-20 text-accent">Завантаження товарів...</div>';
        
        fetch(`${shortname}.json`)
            .then(response => {
                if (!response.ok) throw new Error("HTTP помилка");
                return response.json();
            })
            .then(data => {
                let html = `
                    <div class="mb-8">
                        <button onclick="document.getElementById('catalog-link').click()" class="text-gray-400 hover:text-white transition flex items-center gap-2 bg-surface px-4 py-2 rounded-lg border border-gray-700">
                            &larr; Назад до каталогу
                        </button>
                    </div>
                    <h2 class="text-3xl font-bold text-white mb-8">${categoryName}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                `;
                
                data.forEach(item => {
                    // Зображення СУВОРО до 200x200 пікселів за вимогами лабораторної
                    html += `
                        <div class="glass-card rounded-xl p-5 flex flex-col items-center hover:-translate-y-1 transition duration-300">
                            
                            <img src="images/${item.shortname}.jpg" 
                                 onerror="this.src='https://placehold.co/200x200/171717/3b82f6?text=NO+PHOTO'" 
                                 alt="${item.name}" 
                                 class="w-[200px] h-[200px] object-cover rounded-lg mb-4 border border-gray-800 shadow-md">
                            
                            <h4 class="text-lg font-bold text-white text-center w-full">${item.name}</h4>
                            <p class="text-sm text-gray-400 mt-2 flex-grow text-center">${item.description}</p>
                            
                            <div class="mt-4 pt-4 border-t border-gray-800 w-full text-center">
                                <span class="text-xl font-bold text-accent">${item.price}</span>
                            </div>
                            
                        </div>
                    `;
                });
                
                html += '</div>';
                mainContent.innerHTML = html;
            });
    }

    // Випадкова категорія (Спецпропозиція)
    window.loadSpecials = function() {
        if(globalCategories.length === 0) return;
        const randomIndex = Math.floor(Math.random() * globalCategories.length);
        const randomCategory = globalCategories[randomIndex];
        loadCategory(randomCategory.shortname, "Рекомендуємо: " + randomCategory.name);
    }

    catalogLink.addEventListener('click', loadCatalog);
});
