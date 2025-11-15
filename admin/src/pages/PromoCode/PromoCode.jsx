import React, { useState, useEffect } from 'react'
import './PromoCode.css';
import axios from "axios";
import { toast } from 'react-toastify';

const PromoCode = ({url}) => {
    const [promoCodes, setPromoCodes] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCode, setNewCode] = useState({
        code: "",
        discountAmount: "",
        discountType: "fixed", // fixed or percentage
        minOrderAmount: "",
        maxDiscount: "",
        validUntil: ""
    });

    // Fetch all promo codes
    const fetchPromoCodes = async () => {
        try {
            const response = await axios.get(`${url}/api/promo/list`);
            if (response.data.success) {
                setPromoCodes(response.data.data);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error fetching promo codes");
        }
    }

    // Create new promo code
    const createPromoCode = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${url}/api/promo/create`, newCode);
            if (response.data.success) {
                toast.success("Promo code created successfully");
                setShowCreateForm(false);
                setNewCode({
                    code: "",
                    discountAmount: "",
                    discountType: "fixed",
                    minOrderAmount: "",
                    maxDiscount: "",
                    validUntil: ""
                });
                fetchPromoCodes();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error creating promo code");
        }
    }

    // Delete promo code
    const deletePromoCode = async (codeId) => {
        if (!window.confirm("Are you sure you want to delete this promo code?")) {
            return;
        }
        
        try {
            const response = await axios.post(`${url}/api/promo/delete`, { codeId });
            if (response.data.success) {
                toast.success("Promo code deleted successfully");
                fetchPromoCodes();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting promo code");
        }
    }

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setNewCode(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }

    const isCodeExpired = (validUntil) => {
        return new Date(validUntil) < new Date();
    }

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    return (
        <div className='promo-code add'>
            <div className="promo-code-header">
                <h2>Promo Code Management</h2>
                <button 
                    className="create-promo-btn"
                    onClick={() => setShowCreateForm(true)}
                >
                    + Create New Code
                </button>
            </div>

            {/* Create New Promo Code Form */}
            {showCreateForm && (
                <div className="create-promo-form">
                    <div className="form-header">
                        <h3>Create New Promo Code</h3>
                        <button 
                            className="close-btn"
                            onClick={() => setShowCreateForm(false)}
                        >
                            ×
                        </button>
                    </div>
                    <form onSubmit={createPromoCode}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Promo Code *</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={newCode.code}
                                    onChange={onChangeHandler}
                                    placeholder="e.g., WELCOME50"
                                    required
                                    maxLength="20"
                                />
                            </div>

                            <div className="form-group">
                                <label>Discount Type *</label>
                                <select
                                    name="discountType"
                                    value={newCode.discountType}
                                    onChange={onChangeHandler}
                                    required
                                >
                                    <option value="fixed">Fixed Amount (₹)</option>
                                    <option value="percentage">Percentage (%)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    {newCode.discountType === 'fixed' ? 'Discount Amount (₹) *' : 'Discount Percentage (%) *'}
                                </label>
                                <input
                                    type="number"
                                    name="discountAmount"
                                    value={newCode.discountAmount}
                                    onChange={onChangeHandler}
                                    placeholder={newCode.discountType === 'fixed' ? '100' : '10'}
                                    required
                                    min="1"
                                />
                            </div>

                            {newCode.discountType === 'percentage' && (
                                <div className="form-group">
                                    <label>Maximum Discount (₹)</label>
                                    <input
                                        type="number"
                                        name="maxDiscount"
                                        value={newCode.maxDiscount}
                                        onChange={onChangeHandler}
                                        placeholder="500"
                                        min="1"
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Minimum Order Amount (₹)</label>
                                <input
                                    type="number"
                                    name="minOrderAmount"
                                    value={newCode.minOrderAmount}
                                    onChange={onChangeHandler}
                                    placeholder="0"
                                    min="0"
                                />
                            </div>

                            <div className="form-group">
                                <label>Valid Until *</label>
                                <input
                                    type="date"
                                    name="validUntil"
                                    value={newCode.validUntil}
                                    onChange={onChangeHandler}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setShowCreateForm(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="submit-btn">
                                Create Promo Code
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Promo Codes List */}
            <div className="promo-codes-list">
                <h3>Active Promo Codes</h3>
                {promoCodes.length === 0 ? (
                    <div className="no-promo-codes">
                        <p>No promo codes created yet.</p>
                    </div>
                ) : (
                    <div className="promo-codes-table">
                        <div className="table-header">
                            <div>Code</div>
                            <div>Discount</div>
                            <div>Min Order</div>
                            <div>Valid Until</div>
                            <div>Status</div>
                            <div>Actions</div>
                        </div>
                        {promoCodes.map((promo) => (
                            <div key={promo._id} className={`table-row ${isCodeExpired(promo.validUntil) ? 'expired' : ''}`}>
                                <div className="code-cell">
                                    <span className="code-text">{promo.code}</span>
                                    {isCodeExpired(promo.validUntil) && (
                                        <span className="expired-badge">Expired</span>
                                    )}
                                </div>
                                <div className="discount-cell">
                                    {promo.discountType === 'fixed' ? (
                                        <span className="discount-amount">₹{promo.discountAmount}</span>
                                    ) : (
                                        <span className="discount-percentage">{promo.discountAmount}%</span>
                                    )}
                                    {promo.discountType === 'percentage' && promo.maxDiscount && (
                                        <span className="max-discount">(Max ₹{promo.maxDiscount})</span>
                                    )}
                                </div>
                                <div className="min-order-cell">
                                    {promo.minOrderAmount ? `₹${promo.minOrderAmount}` : 'No minimum'}
                                </div>
                                <div className="valid-until-cell">
                                    {formatDate(promo.validUntil)}
                                </div>
                                <div className="status-cell">
                                    <span className={`status-badge ${isCodeExpired(promo.validUntil) ? 'expired' : 'active'}`}>
                                        {isCodeExpired(promo.validUntil) ? 'Expired' : 'Active'}
                                    </span>
                                </div>
                                <div className="actions-cell">
                                    <button 
                                        className="delete-btn"
                                        onClick={() => deletePromoCode(promo._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default PromoCode