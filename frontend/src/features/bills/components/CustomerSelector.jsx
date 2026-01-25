import { useState, useEffect } from 'react';
import { Search, User, Plus, UserPlus } from 'lucide-react';
import { billsAPI } from '../services/bills.api';
import toast from 'react-hot-toast';

const CustomerSelector = ({ selectedCustomer, onSelectCustomer }) => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (showDropdown && customers.length === 0) {
            fetchCustomers();
        }
    }, [showDropdown]);

    useEffect(() => {
        filterCustomers();
    }, [searchTerm, customers]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await billsAPI.getCustomersForPOS();
            if (response.success) {
                setCustomers(response.data);
            }
        } catch (error) {
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    const filterCustomers = () => {
        if (!searchTerm) {
            setFilteredCustomers(customers);
            return;
        }

        const filtered = customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm)
        );
        setFilteredCustomers(filtered);
    };

    const handleSelectCustomer = (customer) => {
        onSelectCustomer(customer);
        setShowDropdown(false);
        setSearchTerm('');
    };

    const handleCreateCustomer = async (e) => {
        e.preventDefault();
        try {
            const customerData = {
                ...newCustomer,
                isNewCustomer: true
            };

            const response = await billsAPI.createCustomer(customerData);

            if (response.success) {
                onSelectCustomer(response.data);
                setShowNewCustomerForm(false);
                setNewCustomer({ name: '', email: '', phone: '', address: '' });
                toast.success('Customer created successfully');
                fetchCustomers(); // Refresh the list
            }
        } catch (error) {
            toast.error('Failed to create customer');
            console.error('Customer creation error:', error);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-xl">
                    <User className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Customer</h3>
            </div>

            {selectedCustomer ? (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="font-semibold text-purple-900">{selectedCustomer.name}</h4>
                            <p className="text-sm text-purple-700">{selectedCustomer.email}</p>
                            <p className="text-sm text-purple-700">{selectedCustomer.phone}</p>
                        </div>
                        <button
                            onClick={() => onSelectCustomer(null)}
                            className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                            Change
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Search Customer */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search customer by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />

                        {showDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                {loading ? (
                                    <div className="p-4 text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto"></div>
                                    </div>
                                ) : filteredCustomers.length > 0 ? (
                                    filteredCustomers.map(customer => (
                                        <button
                                            key={customer.id}
                                            onClick={() => handleSelectCustomer(customer)}
                                            className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="font-semibold text-gray-900">{customer.name}</div>
                                            <div className="text-sm text-gray-600">{customer.email}</div>
                                            <div className="text-sm text-gray-600">{customer.phone}</div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        No customers found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Walk-in Customer Button */}
                    <button
                        onClick={() => handleSelectCustomer({
                            id: 'walk-in',
                            name: 'Walk-in Customer',
                            email: '',
                            phone: ''
                        })}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <User className="h-5 w-5" />
                        <span>Walk-in Customer</span>
                    </button>

                    {/* New Customer Button */}
                    <button
                        onClick={() => setShowNewCustomerForm(true)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                        <UserPlus className="h-5 w-5" />
                        <span>Add New Customer</span>
                    </button>
                </div>
            )}

            {/* New Customer Form Modal */}
            {showNewCustomerForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Customer</h3>
                        <form onSubmit={handleCreateCustomer} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Customer Name *"
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <input
                                type="tel"
                                placeholder="Phone *"
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            />
                            <textarea
                                placeholder="Address"
                                value={newCustomer.address}
                                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                rows="3"
                            />
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowNewCustomerForm(false)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors"
                                >
                                    Add Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerSelector;