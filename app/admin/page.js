'use client'
import Navbar from '../main/components/navbar';
import { useState, useEffect } from 'react';
import "../globals.css"

export default function Admin() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [payments, setPayments] = useState([]);
    const [userData, setUserData] = useState({});
    const [showButton, setShowButton] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const response = await fetch('/api/admin/checkAdmin', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    setIsAdmin(true);
                } else {
                    location.href = '/main';
                }
            } catch (error) {
                console.error('Check admin error:', error);
            }
        };
        checkAdmin();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin/formAdmin', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setPayments(data);
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/admin/allUser', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                }
            } catch (error) {
                console.error('Fetch user error:', error);
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async () => {
        // บันทึกข้อมูลการชำระเงิน

        setShowButton(false);
    };

    const handleCancel = async () => {
        // ลบข้อมูลการชำระเงิน

        setShowButton(true);
    };

    return (
        <>
            <Navbar />
            <div className='mx-9'>
                <h1 className='text-2xl font-prompt pb-4 font-bold m-5'>รายการการชำระเงินสาขา</h1>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className='pl-10 text-black'>ชื่อ</th>
                                <th className='text-black'>จำนวนเงินที่จ่าย</th>
                                <th className='text-black'>วันที่ส่งฟอร์ม</th>
                                <th className='text-black'>รูปหลักฐานการโอน</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={index}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className='pl-5'>
                                                <div className="font-bold">{userData[payment.cpe65_email]?.name} {userData[payment.cpe65_email]?.surname}</div>
                                                <div className="text-sm opacity-50">{payment.cpe65_email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        เดือนที่จ่าย
                                        <br />
                                        <span className="badge badge-ghost">{payment.selected_months}</span>
                                        <span className="badge badge-primary">รวมเป็น : </span>
                                    </td>
                                    <td>{payment.datetime}</td>
                                    <td>
                                        <img src={payment.file_loc} alt="รูปหลักฐานการโอน" className='w-2/4' />
                                    </td>
                                    <td>
                                        {showButton && ( // เช็คสถานะของ showButton เพื่อแสดงหรือซ่อนปุ่ม
                                            <button className="btn btn-primary btn-xs" onClick={handleSubmit}>ยืนยัน</button>
                                        )}
                                        <button className="btn btn-error btn-xs" onClick={handleCancel}>ยกเลิก</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </>
    )
}
