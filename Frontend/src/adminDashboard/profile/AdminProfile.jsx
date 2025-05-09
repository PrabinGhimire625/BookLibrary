import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateUserProfile, userProfile } from '../../components/store/authSlice';
import Sidebar from '../sidebar/Sidebar';


const AdminProfile = () => {
    const dispatch = useDispatch();
    const { status, profile } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        dispatch(userProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                address: profile.address || '',
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateUserProfile({ id: profile.id, userData: formData }));
            if (status === 'success') {
                toast.success('AdminProfile updated');
                setIsEditing(false);
                dispatch(userProfile());
            } else {
                toast.error('Failed to update profile.');
            }
        } catch (error) {
            toast.error('An error occurred while updating.');
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex justify-center py-20 bg-white">
                <p className="text-lg font-semibold text-gray-700">Loading profile...</p>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex justify-center py-20 bg-white">
                <p className="text-lg text-red-600 font-semibold">Failed to load profile.</p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col md:flex-row min-h-screen">
                {/* Sidebar */}
                <Sidebar />

                <div className="w-full px-4 md:px-8 py-10 bg-gradient-to-b from-white via-gray-50 to-white">
                    <div className="bg-white shadow-2xl rounded-3xl max-w-3xl mx-auto p-6 md:p-10 border border-gray-200">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-extrabold text-gray-800">👤 Profile details</h1>
                            <p className="text-gray-500 mt-1">Welcome back, {profile.name?.split(' ')[0]}!</p>
                        </div>

                        {!isEditing ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-500">Name</label>
                                        <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500">Email</label>
                                        <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500">Phone</label>
                                        <p className="text-lg font-semibold text-gray-800">{profile.phone}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500">Address</label>
                                        <p className="text-lg font-semibold text-gray-800">{profile.address}</p>
                                    </div>
                                </div>

                                <div className="text-center mt-10">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300"
                                    >
                                        ✏️ Edit AdminProfile
                                    </button>
                                </div>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-500">Name</label>
                                        <input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500">Email</label>
                                        <input
                                            name="email"
                                            value={formData.email}
                                            disabled
                                            className="w-full p-2 border rounded bg-gray-200 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500">Phone</label>
                                        <input
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-500">Address</label>
                                        <input
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center gap-4 pt-6">
                                    <button
                                        type="submit"
                                        className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition duration-300"
                                    >
                                        💾 Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: profile.name || '',
                                                email: profile.email || '',
                                                phone: profile.phone || '',
                                                address: profile.address || ''
                                            });
                                        }}
                                        className="bg-gray-200 text-black px-6 py-2 rounded-full hover:bg-gray-300 transition duration-300"
                                    >
                                        ❌ Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminProfile;
