'use client'
import Navbar from '../main/components/navbar';
import { useState, useEffect } from 'react';
import "../globals.css"
import Lightbox from './components/Lightbox';

export default function Admin() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [payments, setPayments] = useState([]);
    const [userData, setUserData] = useState({});
    const [selectedPaymentIndex, setSelectedPaymentIndex] = useState(null); // เพิ่ม state สำหรับเก็บ index ของการชำระเงินที่ถูกเลือก
    const [lightboxImage, setLightboxImage] = useState(null);


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
                    location.href = '/';
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
                    setPayments(data.map(payment => ({ ...payment, showButton: true }))); // เพิ่ม showButton ในแต่ละ payment
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

    const handleSubmit = async (index) => {
        try {
            const confirmed = window.confirm("คุณจะอนุมัติรายการนี้ใช่หรือไม่?");
            if (!confirmed) return;
            setSelectedPaymentIndex(index); // เก็บ index ของการชำระเงินที่ถูกเลือก
            const selectedPayment = payments[index];
            const month = JSON.stringify({ month: selectedPayment.selected_months });
            const email = selectedPayment.cpe65_email;
            console.log(month)

            const statusResponse = await fetch('/api/admin/setStatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Status: true, email, month }), // ส่งสถานะและอีเมล์ไปยังเซิร์ฟเวอร์
            });

            if (!statusResponse.ok) {
                console.error('Failed to submit status');
                return; // ออกจากฟังก์ชันหากเกิดข้อผิดพลาด
            }

            // เมื่อยืนยันการดำเนินการเสร็จสิ้น ไม่ต้องเก็บ index อีกต่อไป
            setSelectedPaymentIndex(null);

            const paymentResponse = await fetch('/api/admin/submitPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, month }), // ส่งข้อมูลการชำระเงินไปยังเซิร์ฟเวอร์
            });

            if (paymentResponse.ok) {
                console.log('Submit payment success');
                // อัพเดทสถานะของแถวที่ถูกคลิก
                const updatedPayments = [...payments];
                updatedPayments[index].showButton = false;
                setPayments(updatedPayments);
            } else {
                console.error('Failed to submit payment');
            }
        } catch (error) {
            console.error('Error submit payment:', error);
        }
    };

    const handleCancel = async (index) => {
        try {
            const confirmed = window.confirm("คุณจะลบรายการนี้ใช่ไหม?");
            if (!confirmed) return;
            setSelectedPaymentIndex(index); // เก็บ index ของการชำระเงินที่ถูกเลือก
            const selectedPayment = payments[index];
            const month = JSON.stringify({ month: selectedPayment.selected_months });
            const email = selectedPayment.cpe65_email;

            const response = await fetch('/api/admin/deletePayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, month }), // ส่งข้อมูลการชำระเงินไปยังเซิร์ฟเวอร์
            });

            if (response.ok) {
                alert('ลบรายการเรียบร้อย');

                // ลบแถวที่ถูกคลิกออกจาก state
                const updatedPayments = [...payments];
                updatedPayments.splice(index, 1);
                setPayments(updatedPayments);
            }
        } catch (error) {
            console.error('Error cancel payment:', error);
        }
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
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className='pl-5'>
                                                <div className="font-bold">{userData[payment.cpe65_email]?.name} {userData[payment.cpe65_email]?.surname}</div>
                                                <div className="text-sm opacity-50">{payment.cpe65_email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <span className="badge badge-ghost">{payment.selected_months}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{payment.datetime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {/* Render the image in a way to open it in the lightbox */}
                                        <button onClick={() => setLightboxImage(payment.file_loc)}>
                                            <img src={payment.file_loc} alt="รูปหลักฐานการโอน" className='w-2/4' cursor-pointer />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {payment.showButton ? (
                                            <>
                                                {payment.status !== "submitted" && ( // ตรวจสอบสถานะว่าเป็น "submitted" หรือไม่
                                                    <>
                                                        <button className="btn btn-primary btn-x" onClick={() => handleSubmit(index)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                            </svg>
                                                        </button>
                                                        <button className="btn btn-error btn-x" onClick={() => handleCancel(index)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <p>ดำเนินการแล้ว</p>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {lightboxImage && (
                <Lightbox imageUrl={lightboxImage} onClose={() => setLightboxImage(null)} />
            )}
        </>
    )
}