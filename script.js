document.addEventListener('DOMContentLoaded', () => {
    const currentDateInput = document.getElementById('currentDate');
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    currentDateInput.value = `${year}-${month}-${day}`;

    const addItemBtn = document.getElementById('addItemBtn');
    const deleteAllItemsBtn = document.getElementById('deleteAllItemsBtn');
    
    const itemTableBody = document.querySelector('.item-table tbody');

    const totalItemsElement = document.getElementById('totalItems');
    const totalQtyWtElement = document.getElementById('totalQtyWt');
    const grossAmountElement = document.getElementById('grossAmount');
    const netAmountElement = document.getElementById('netAmount');

    let itemIdCounter = 0; 
    

    const updateAllTotals = () => {
        let totalItems = 0;
        let totalQtyWt = 0;
        let grossAmount = 0;
        let netAmount = 0;

        const rows = itemTableBody.querySelectorAll('tr[data-item-id]');

        rows.forEach(row => {
            totalItems++;
            const priceInput = row.querySelector('.item-price');
            const qtyInput = row.querySelector('.item-qty');

            const price = parseFloat(priceInput?.value) || 0;
            const qty = parseFloat(qtyInput?.value) || 0;

            const itemAmount = price * qty;
            const itemNetAmount = itemAmount; 

            row.querySelector('.item-amount').textContent = itemAmount.toFixed(2);
            row.querySelector('.item-net-amount').textContent = itemNetAmount.toFixed(2);

            totalQtyWt += qty;
            grossAmount += itemAmount;
            netAmount += itemNetAmount;
        });

        totalItemsElement.textContent = totalItems;
        totalQtyWtElement.textContent = totalQtyWt.toFixed(2);
        grossAmountElement.textContent = grossAmount.toFixed(2);
        netAmountElement.textContent = netAmount.toFixed(2);
    };

    const addNewItemRow = () => {
        itemIdCounter++;
        const newRow = itemTableBody.insertRow();
        newRow.dataset.itemId = itemIdCounter; 

        newRow.innerHTML = `
            <td>${itemIdCounter}</td>
            <td><input type="text" class="item-barcode" value="" placeholder="Barcode"></td>
            <td><input type="text" class="item-name" value="" placeholder="Item Name"></td>
            <td><input type="number" step="0.01" class="item-price" value="0.00" placeholder="0.00"></td>
            <td><input type="number" step="0.01" class="item-qty" value="1.00" placeholder="1.00"></td>
            <td><input type="text" class="item-unit" value="Pcs" placeholder="Unit"></td>
            <td class="item-amount">0.00</td>
            <td class="item-net-amount">0.00</td>
            <td class="action-column">
                <button class="delete-row-btn" data-item-id="${itemIdCounter}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;

        const priceInput = newRow.querySelector('.item-price');
        const qtyInput = newRow.querySelector('.item-qty');
        const deleteRowBtn = newRow.querySelector('.delete-row-btn');

        const handleInputChange = () => {
            updateAllTotals();
        };

        priceInput.addEventListener('input', handleInputChange);
        qtyInput.addEventListener('input', handleInputChange);
        deleteRowBtn.addEventListener('click', (event) => {
            
            event.target.closest('tr').remove(); 
            updateAllTotals(); 
        });

        updateAllTotals(); 
    };

    addItemBtn.addEventListener('click', addNewItemRow);

    deleteAllItemsBtn.addEventListener('click', () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete the entire list of items!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete all!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                itemTableBody.innerHTML = ''; 
                itemIdCounter = 0; 
                updateAllTotals(); 
                Swal.fire(
                    'Deleted!',
                    'Your item list has been cleared.',
                    'success'
                );
            }
        });
    });

    updateAllTotals();
});
