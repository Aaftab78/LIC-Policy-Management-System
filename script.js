document.getElementById('customer-form').addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
    e.preventDefault();

    const customerId = document.getElementById('customer-id').value;
    const name = document.getElementById('name').value;
    const contact_information = document.getElementById('contact_information').value;
    const address = document.getElementById('address').value;
    const date_of_birth = document.getElementById('date_of_birth').value;
    const occupation = document.getElementById('occupation').value;

    const customer = {
        name,
        contact_information,
        address,
        date_of_birth,
        occupation
    };

    if (customerId) {
        updateCustomer(customerId, customer);
    } else {
        addCustomer(customer);
    }
}

function addCustomer(customer) {
    fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('customer-form').reset();
        fetchCustomers();
    })
    .catch(error => console.error('Error:', error));
}

function updateCustomer(id, customer) {
    fetch(`http://localhost:5000/api/customers/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(customer)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('customer-form').reset();
        document.getElementById('customer-id').value = '';
        fetchCustomers();
    })
    .catch(error => console.error('Error:', error));
}

function deleteCustomer(id) {
    fetch(`http://localhost:5000/api/customers/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        fetchCustomers();
    })
    .catch(error => console.error('Error:', error));
}

function fetchCustomers() {
    fetch('http://localhost:5000/api/customers')
        .then(response => response.json())
        .then(data => {
            const customerList = document.getElementById('customer-list');
            customerList.innerHTML = '';
            data.forEach(customer => {
                const li = document.createElement('li');
                li.innerHTML = `
                    ${customer.name} - ${customer.contact_information} - ${customer.address} - ${customer.date_of_birth} - ${customer.occupation}
                    <button onclick="editCustomer(${customer.id})">Edit</button>
                    <button onclick="deleteCustomer(${customer.id})">Delete</button>
                `;
                customerList.appendChild(li);
            });
        })
        .catch(error => console.error('Error:', error));
}

function editCustomer(id) {
    fetch(`http://localhost:5000/api/customers/${id}`)
        .then(response => response.json())
        .then(customer => {
            document.getElementById('customer-id').value = customer.id;
            document.getElementById('name').value = customer.name;
            document.getElementById('contact_information').value = customer.contact_information;
            document.getElementById('address').value = customer.address;
            document.getElementById('date_of_birth').value = customer.date_of_birth;
            document.getElementById('occupation').value = customer.occupation;
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', fetchCustomers);
