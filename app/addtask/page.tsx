"use client"
import Image from "next/image"
import logo from "./../../assets/logo.png"
import Link from "next/link"
import { useState, useEffect} from "react"
import { supabase } from "../../lib/supabaseClient"

export default function Page() {
  //สร้างตัวแปร state เพื่อผูกกับข้อมูลที่เกิดขึ้นที่หน้าจอ และบันทึกลงฐานข้อมูล
  const [title, setTitle] = useState('');
  const [detail, setDetail] = useState('');
  const [is_completed, setIsCompleted] = useState<boolean>(false); //ค่าเริ่มต้นคือ ยังไม่เริ่ม (0)
  const [image_file, setImageFile] = useState<File | null >(null);
  const [preview_file, setPreviewFile] = useState<string | null>(null); //เก็บ URL ของรูปภาพที่เลือกมาแสดงที่หน้าจอ

  function handleSelectImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    setImageFile(file);

    if(file){
    setPreviewFile(URL.createObjectURL(file as Blob));
    }
  }

  async function handleUploadAndSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    alert('อัปโหลดรูปภาพและบันทึกข้อมูลแล้วนะ');
  }

  return (
    <div className="flex flex-col w-10/12 mx-auto">
    <div className="flex flex-col items-center  mt-20 ">
      <Image 
        src={logo}
        alt="logo"
        width={100}
        height={100}
      />
      <h1 className="text-xl font-bold mt-5">
        Manage Task App
      </h1>
      <h1 className="text-md mt-2 mb-10 font-bold">
        บันทึกงานของคุณ
      </h1>
    </div>
    {/* ส่วนของการเพิ่มงาน */}
    <div className="flex  flex-col border border-gray-500 mt-10 p-5 rounded-xl">
    <h1 className="text-center text-xl font-bold ">เพิ่มงาน</h1>

    <form onSubmit={handleUploadAndSave}>
    <div className="flex flex-col mt-5">
      <label className="text-lg font-bold">งานที่ต้องทำ</label>
      <input type="text" className="border border-gray-400 rounded-lg p-2 mt-2"/>
    </div>

    <div className="flex flex-col mt-5">
          <label className="text-lg font-bold">รายละเอียดงาน</label>
      <textarea className="border border-gray-500 rounded-lg p-2 "></textarea>
    </div>

    <div className="flex flex-col mt-5">
      <label className="text-lg font-bold">อัพโหลดรูปภาพ</label>
      <input type="file" className="hidden" accept="image/* " onChange={handleSelectImagePreview}/>
      <label htmlFor="fildInput" className=" bg-blue-500 rounded-lg p-2 text-white cursor-pointer w-30 text-center mt-5">เลือกรูป</label>
      {preview_file && (
        <div className="mt-3">
          <Image src={preview_file} alt="preview image" width={100} height={100} />
        </div>
      )}
    </div>

    <div className="flex flex-col mt-5">
      <label className="text-lg font-bold"> สถานะงาน</label>
      <select className="border border-gray-500 rounded-lg p-2">
        <option value="0">ยังไม่เริ่ม</option>
        <option value="1">เสร็จสิ้น</option>
      </select>
    </div>

    <div className="flex flex-col mt-5">
      <button type="submit" className="bg-green-500 rounded-lg p-2 text-white">บันทึกงานเพิ่มเติม</button>
    </div>
      </form>
        <div className="flex justify-center my-10">
      <Link href="/" className="bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white font-bold py-3 px-4 rounded">กลับไปหน้าแรก</Link>
    </div>

    </div>
    </div>
  )
}
