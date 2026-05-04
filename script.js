document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const catalogLink = document.getElementById('catalog-link');
    let globalCategories = [];

    // Завантаження каталогу (категорій)
    function loadCatalog(e) {
        if(e) e.preventDefault();
        mainContent.innerHTML = '<div class="text-center text-xl mt-10">Завантаження каталогу...</div>';
        
        fetch('categories.json')
            .then(response => response.json())
            .then(data => {
                globalCategories = data;
                
                let html = '<h2 class="text-3xl font-bold mb-8 text-center text-primary">Наші напрямки</h2>';
                html += '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">';
                
                data.forEach(category => {
                    html += `
                        <div class="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent cursor-pointer hover:shadow-lg transition" onclick="loadCategory('${category.shortname}', '${category.name}')">
                            <h3 class="text-xl font-bold text-primary">${category.name}</h3>
                            <p class="text-sm text-gray-500 mt-3">${category.notes}</p>
                        </div>
                    `;
                });
                html += '</div>';

                // Кнопка Specials
                html += `
                    <div class="mt-12 text-center border-t pt-8">
                        <button onclick="loadSpecials()" class="bg-accent text-white px-8 py-3 rounded hover:bg-blue-500 transition font-bold shadow">
                            Спеціальна пропозиція (Specials)
                        </button>
                        <p class="text-xs text-gray-400 mt-2">Випадково підібраний напрямок для вас</p>
                    </div>
                `;
                
                mainContent.innerHTML = html;
            })
            .catch(error => {
                console.error('Помилка:', error);
                mainContent.innerHTML = '<p class="text-red-500 text-center mt-10">Помилка завантаження даних.</p>';
            });
    }

    // Завантаження турів вибраної категорії
    window.loadCategory = function(shortname, categoryName) {
        mainContent.innerHTML = '<div class="text-center text-xl mt-10">Завантаження турів...</div>';
        
        fetch(`${shortname}.json`)
            .then(response => response.json())
            .then(data => {
                let html = `
                    <div class="mb-6">
                        <button onclick="document.getElementById('catalog-link').click()" class="text-secondary hover:text-accent font-medium">
                            &larr; Повернутися до каталогу
                        </button>
                    </div>
                    <h2 class="text-3xl font-bold text-center text-primary mb-8">${categoryName}</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                `;
                
                data.forEach(item => {
                    // Зображення 200x200 як вимагається
                    html += `
                        <div class="bg-white p-4 rounded-lg shadow border border-gray-100 flex flex-col">
                            <img src="https://placehold.co/200x200/f1f5f9/475569?text=${item.shortname}" alt="${item.name}" class="w-[200px] h-[200px] object-cover mx-auto rounded mb-4">
                            <h4 class="text-lg font-bold text-primary text-center">${item.name}</h4>
                            <p class="text-sm text-gray-600 mt-2 flex-grow text-center">${item.description}</p>
                            <p class="text-xl font-bold text-accent mt-4 text-center">${item.price}</p>
                        </div>
                    `;
                });
                
                html += '</div>';
                mainContent.innerHTML = html;
            })
            .catch(error => console.error('Помилка:', error));
    }

    // Випадкова категорія через Math.random()
    window.loadSpecials = function() {
        if(globalCategories.length === 0) return;
        const randomIndex = Math.floor(Math.random() * globalCategories.length);
        const randomCategory = globalCategories[randomIndex];
        loadCategory(randomCategory.shortname, "Спецпропозиція: " + randomCategory.name);
    }

    catalogLink.addEventListener('click', loadCatalog);
});