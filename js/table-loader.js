// Parse CSV data and populate tables
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        
        const obj = {};
        const values = lines[i].split(',').map(v => v.trim());
        
        headers.forEach((header, index) => {
            obj[header] = values[index] || '';
        });
        
        data.push(obj);
    }
    
    return data;
}

// Populate table with data
function populateTable(tableId, data) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody') || table;
    
    // Remove existing rows (keep header)
    const rows = tbody.querySelectorAll('tr');
    for (let i = rows.length - 1; i > 0; i--) {
        rows[i].remove();
    }
    
    // Add new rows from CSV data
    data.forEach(row => {
        const tr = document.createElement('tr');
        
        // Handle Image column specially
        if (row.Image) {
            const imageCell = document.createElement('td');
            imageCell.className = 'image-cell';
            const img = document.createElement('img');
            img.src = row.Image;
            img.alt = row['Beer Name'] || row['Cider Name'] || 'Product Image';
            img.className = 'entry-image';
            imageCell.appendChild(img);
            tr.appendChild(imageCell);
        }
        
        // Add remaining columns (skip Image column)
        Object.keys(row).forEach(key => {
            if (key !== 'Image') {
                const td = document.createElement('td');
                td.textContent = row[key];
                tr.appendChild(td);
            }
        });
        
        tbody.appendChild(tr);
    });
}

// Load CSV files and populate tables
function loadTables() {
    // Load beers
    fetch('data/beers.csv')
        .then(response => response.text())
        .then(data => {
            const beersData = parseCSV(data);
            populateTable('beer-table', beersData);
        })
        .catch(error => console.error('Error loading beers.csv:', error));
    
    // Load ciders
    fetch('data/ciders.csv')
        .then(response => response.text())
        .then(data => {
            const cidersData = parseCSV(data);
            populateTable('cider-table', cidersData);
        })
        .catch(error => console.error('Error loading ciders.csv:', error));
}

// Run when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTables);
} else {
    loadTables();
}
