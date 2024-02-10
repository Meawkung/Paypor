'use client'
import { useState, useEffect } from 'react';
import Navbar from '../main/components/navbar';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from "@supabase/supabase-js";
import '../globals.css'

const CDNURL = "https://rkcopmoevxfywvtpkqvt.supabase.co/storage/v1/object/public/images/"

export default function Main() {
  const [userData, setUserData] = useState(null);
  const [images, setImages] = useState([]);
  const supabase = createClient('https://rkcopmoevxfywvtpkqvt.supabase.co', 'process.env.SUPABASE_KEY');
  const [month, setMonth] = useState('');
  const [sumAll, setSumAll] = useState('');
  const [notPayOne, setNotPayOne] = useState('');
  const [notPayAll, setNotPayAll] = useState('');
  const [zeroAmount, setZeroAmount] = useState('');
  const [isChecked, setIsChecked] = useState(Array(zeroAmount?.amount?.length).fill(false));
  const [addPay200, setAddPay200] = useState(0);
  const [fileinput, setFileinput] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);


  async function getImages() {
    let { data, error } = await supabase
      .storage
      .from('images')
      .list(userData[0]?.student_id + "/", {
        limit: 100,
        offset: 0,
        sortBy: { column: "name", order: "asc" }
      });


    if (data !== null) {
      setImages(data);
    } else {
      alert('error');
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data.user);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);


  useEffect(() => {
    const fetchPaylist = async () => {
      try {
        const response = await fetch('/api/userPayment', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setMonth(data);

          const zeroAmountData = data?.payment?.filter(item => item.amount === 0);
          setZeroAmount({ amount: zeroAmountData });

        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchPaylist();
  }, []);


  useEffect(() => {
    const fetchPaylist = async () => {
      try {
        const response = await fetch('/api/allBalance', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          let sum = 0;
          data.forEach(item => {
            sum += item.total_amount;
          });
          setSumAll(sum);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchPaylist();
  }, []);


  useEffect(() => {
    const fetchPaymentOne = async () => {
      try {
        const response = await fetch('/api/notPayone', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();

          setNotPayOne(data.totalSum);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchPaymentOne();
  }, []);


  useEffect(() => {
    const fetchPaymentAll = async () => {
      try {
        const response = await fetch('/api/notPayall', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setNotPayAll(data.totalSum);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    fetchPaymentAll();
  }, []);


  const handleCheckboxChange = (index) => {
    const updatedCheckedState = [...isChecked];
    updatedCheckedState[index] = !updatedCheckedState[index];
    setIsChecked(updatedCheckedState);
  
    // ตรวจสอบว่า checkbox ที่ index ถูกเลือกหรือไม่
    if (updatedCheckedState[index]) {
      // เพิ่มค่า 100 เข้าไปในตัวแปร addPay200 เมื่อ checkbox ถูกเลือก และ index เป็น 0
      if (index === 0) {
        setAddPay200(prevValue => prevValue + 100);
      }else if(index === 1){
        setAddPay200(prevValue => prevValue + 50);
      } else {
        setAddPay200(prevValue => prevValue + 200);
      }
      const month = zeroAmount?.amount[index]?.month;
      setSelectedMonths(prevMonths => [...prevMonths, month]);
    } else {
      // ลบค่า 200 ออกจากตัวแปร addPay200 เมื่อ checkbox ไม่ถูกเลือก
      if (index === 0) {
        setAddPay200(prevValue => prevValue - 100);
      }else if(index === 1){
        setAddPay200(prevValue => prevValue - 50);
      } else {
        setAddPay200(prevValue => prevValue - 200);
      }
      const month = zeroAmount?.amount[index]?.month;
      setSelectedMonths(prevMonths => prevMonths.filter(item => item !== month));
    }
  };
  

  const handleSumitForm = async (e) => {
    e.preventDefault();
    let file = fileinput;
    let randomChar = uuidv4();
    // userid:65021521
    // 65021521/
    // 65021521/name.png
    if (selectedMonths === null || selectedMonths.length === 0) {
      alert('กรุณาเลือกเดือนที่ต้องการชำระ');
    } else {
      const { data, error } = await supabase
        .storage
        .from('images')
        .upload(`${userData[0].student_id}` + "/" + randomChar, file)

      if (data) {
        alert('success to upload');
        const publicUrl = supabase.storage.from('images').getPublicUrl(`${userData[0].student_id}` + "/" + randomChar)
        // 🔴⚠️ wait to insert publicURL to database with user email;
        const month = JSON.stringify({ month: selectedMonths });

        const response = await fetch('/api/formUpload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ publicUrl, month })
        });

        getImages();
      } else {
        alert('failed to upload');
        console.log(error);
      }
    }
  }

  const uploadImage = (e) => {
    let file = e.target.files[0];
    setFileinput(file);
    getImages();
  }


  return (
    <>
      <Navbar />
      <div className='mx-9'>
        <div id='dashboard'>
          {userData && (
            <div className='text-2xl py-7 flex justify-center'>
              <div className='flex-1'>
                <div className='underline pb-3'>สวัสดีคุณ</div>
                <span className='font-prompt'>{userData[0].name} {userData[0].surname}</span>
              </div>
            </div>
          )}
          <div className="stats shadow">
            <div className="stats px-10">
              <div className="stat">
                <div className="stat-title">ค้างชำระ</div>
                <div className="stat-value text-yellow-400 font-sans">{notPayOne}</div> {/* ยังไม่ได้ */}
              </div>
              <div className="stat">
                <div className="stat-title">ยอดค้างทั้งหมดในสาขา</div>
                <div className="stat-value text-red-400 font-sans">{notPayAll}</div> {/* ยังไม่ได้ */}
              </div>
              <div className="stat">
                <div className="stat-title">ยอดเงินเก็บทั้งสาขา</div>
                <div className="stat-value text-primary font-sans">{sumAll}</div>
              </div>
            </div>
          </div>
        </div>
        <p className="mr-3 text-red-500 text-xl py-5">เดือนที่คุณค้างชำระ</p>
        <div className='flex-1 mx-5 flex space-x-5 pt-1'>
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {month?.payment?.map((item, index) => (
                <div className="btn" key={index} style={{ marginRight: '20px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  <p className='pr-2'>{item.month}</p>
                  {item.amount === 0 ? (
                    // <input type="checkbox" className='checkbox cursor-default' disabled />
                    <div className="badge badge-error badge-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    // <input type="checkbox" className='checkbox checkbox-success cursor-default' checked />
                    <div className="badge badge-primary badge-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <label style={{ marginLeft: '5px', color: item.amount === 0 ? 'red' : 'green' }}>
                    {item.amount} <span className='text-black'>บาท</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div id='payment' className='py-6'>
          <h2 className='text-2xl py-5'>จ่ายเงิน</h2>
          <div className='flex-1 mx-5 flex space-x-5 pt-1'>
            <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
              {zeroAmount?.amount?.map((item, index) => (
                <div key={index} className={`btn ${isChecked[index] ? 'btn-success text-white' : 'btn-danger'}`} style={{ marginRight: '20px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                  <p className='pr-2'>{item.month}</p>
                  <div className={`badge badge-lg ${isChecked[index] ? 'badge-primary' : 'badge-error'}`} onClick={() => handleCheckboxChange(index)}>
                    {isChecked[index] ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9 13.5a.75.75 0 0 1-1.154.114l-6-6a.75.75 0 0 1 1.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <label className={`${isChecked[index] ? 'text-white' : 'text-red-500'}`} style={{ marginLeft: '5px' }}> {index === 0 ? '100' : index === 1 ? '50' : '200'} <span className={`${isChecked[index] ? 'text-white' : 'text-black'}`}>บาท</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <h2 className='py-5'>รวมเป็นเงิน {addPay200} บาท</h2>

          <div>แสกนเพื่อชำระเงิน</div>

          {addPay200 === 0 ? (
            <div>ไม่มีรายการที่ต้องชำระ</div>
          ) : (
            <img src={`https://promptpay.io/0987486424/${addPay200}.png/`}></img>
          )}

          <form onSubmit={handleSumitForm}>
            <input
              className="file-input file-input-bordered w-full max-w-xs"
              type="file"
              id="formFile"
              accept='image/*'
              onChange={(e) => uploadImage(e)}
            />
            <button type='submit' className='btn btn-primary'>ยืนยัน</button>
          </form>
        </div>
      </div>
      <div className='flex flex-wrap'>
        {images.length > 0 && (
          <div className='m-5'>
            <img src={CDNURL + `${userData[0].student_id}` + "/" + images[0].name} alt={images[0].name} />
          </div>
        )}
      </div>
    </>
  );
}
