import { useParams, Link } from "react-router-dom";
import { useCustomers } from "../features/customers/customers.queries";
import { useBookings } from "../features/bookings/bookings.queries";

const CustomerDetailsPage = () => {
    const { id } = useParams();
    const { data: customers = [] } = useCustomers();
    const { data: bookings = [] } = useBookings();

    const customer = customers.find(c => (c._id || c.id) === id);
    const customerBookings = bookings.filter(b => b.customerId === id);

    if (!customer) return <div className="p-8 text-center">Клієнта не знайдено</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/customers" className="text-indigo-600 hover:text-indigo-800 mb-6 inline-block">
                    ← Назад до списку
                </Link>

                <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Картка клієнта</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {customer.isActive ? 'Активний' : 'Неактивний'}
                        </span>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
                        <div>
                            <p className="text-sm text-gray-500">Ім'я та Прізвище</p>
                            <p className="text-lg font-medium">{customer.firstName} {customer.lastName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-lg font-medium">{customer.email}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Телефон</p>
                            <p className="text-lg font-medium">{customer.phone || 'Не вказано'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Адреса</p>
                            <p className="text-lg font-medium">
                                {customer.address ? `${customer.address.city}, ${customer.address.street}` : 'Не вказано'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-900">Історія візитів</h3>
                    </div>
                    <div className="p-0">
                        {customerBookings.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Послуга</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {customerBookings.map((booking) => (
                                        <tr key={booking._id || booking.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.bookingDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.serviceId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{booking.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Історія візитів порожня
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsPage;
