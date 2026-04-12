// // src/components/Dashboard.tsx
// import React from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { useLogoutMutation } from '../../../api/authApi';

// // Define the state shape directly instead of importing RootState
// interface RootState {
//     auth: {
//         token: string | null;
//         user: { email: string; role: string } | null;
//         isInitialized: boolean;
//     }
// }

// const Dashboard: React.FC = () => {
//     const navigate = useNavigate();
//     const user = useSelector((state: RootState) => state.auth.user);
//     const [logout] = useLogoutMutation();

//     const handleLogout = async () => {
//         try {
//             await logout().unwrap();
//             navigate('/login');
//         } catch (error) {
//             console.error('Logout failed:', error);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100">
//             <nav className="bg-white shadow-sm">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                     <div className="flex justify-between h-16">
//                         <div className="flex items-center">
//                             <h1 className="text-xl font-semibold text-gray-900">
//                                 Dashboard
//                             </h1>
//                         </div>
//                         <div className="flex items-center space-x-4">
//                             <span className="text-sm text-gray-600">
//                                 Welcome, {user?.email || 'User'}
//                             </span>
//                             <span className="px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
//                                 {user?.role?.replace('ROLE_', '') || 'User'}
//                             </span>
//                             <button
//                                 onClick={handleLogout}
//                                 className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                             >
//                                 Logout
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             </nav>
            
//             <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//                 <div className="px-4 py-6 sm:px-0">
//                     <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
//                         <p className="text-gray-500">Welcome to your dashboard!</p>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default Dashboard;