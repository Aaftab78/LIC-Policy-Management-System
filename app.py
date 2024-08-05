from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///lic_policy_management.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    contact_information = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(255), nullable=False)
    date_of_birth = db.Column(db.Date, nullable=False)
    occupation = db.Column(db.String(100), nullable=False)

@app.route('/api/customers', methods=['GET', 'POST'])
def handle_customers():
    if request.method == 'POST':
        data = request.json
        new_customer = Customer(
            name=data['name'],
            contact_information=data['contact_information'],
            address=data['address'],
            date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d'),
            occupation=data['occupation']
        )
        db.session.add(new_customer)
        db.session.commit()
        return jsonify({'id': new_customer.id}), 201

    customers = Customer.query.all()
    return jsonify([{
        'id': customer.id,
        'name': customer.name,
        'contact_information': customer.contact_information,
        'address': customer.address,
        'date_of_birth': customer.date_of_birth.isoformat(),
        'occupation': customer.occupation
    } for customer in customers])

@app.route('/api/customers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def handle_customer(id):
    customer = Customer.query.get_or_404(id)

    if request.method == 'GET':
        return jsonify({
            'id': customer.id,
            'name': customer.name,
            'contact_information': customer.contact_information,
            'address': customer.address,
            'date_of_birth': customer.date_of_birth.isoformat(),
            'occupation': customer.occupation
        })

    if request.method == 'PUT':
        data = request.json
        customer.name = data['name']
        customer.contact_information = data['contact_information']
        customer.address = data['address']
        customer.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d')
        customer.occupation = data['occupation']
        db.session.commit()
        return jsonify({'id': customer.id})

    if request.method == 'DELETE':
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': 'Customer deleted'})

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/customers')
def show_customers():
    customers = Customer.query.all()
    return render_template('customers.html', customers=customers)


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
