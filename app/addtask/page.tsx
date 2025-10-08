/* eslint-disable @next/next/no-img-element */
"use client";
import Image from "next/image";
import logo from "./../../assets/logo.png";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('อัปโหลดรูปภาพและบันทึกข้อมูลแล้วนะ');
  }

  return (
    <div className="flex flex-col w-10/12 mx-auto min-h-screen pb-10">
      <div className="flex flex-col items-center mt-20 ">
        <Image src={logo} alt="Logo" width={150} height={150} />
        <h1 className="text-2xl font-bold mt-5">Manage Task App</h1>
        <h1 className="text-2xl font-bold">บันทึกงานที่ต้องทำ</h1>
      </div>

    <form onSubmit={handleUploadAndSave}>
    <div className="flex flex-col mt-5">
      <label className="text-lg font-bold">งานที่ต้องทำ</label>
      <input type="text" className="border border-gray-400 rounded-lg p-2 mt-2"/>
    </div>

          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">รายละเอียดงานที่ทำ</label>
            <textarea
              className="border border-gray-300 rounded-lg p-2"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="ระบุรายละเอียด"
              rows={4}
            />
          </div>

          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">อัพโหลดรูปภาพ</label>

            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <label
              htmlFor="fileInput"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32 text-center mt-2 cursor-pointer"
            >
              เลือกรูป
            </label>

            {preview_file && (
              <div className="mt-3 flex flex-col">
                <img
                  src={preview_file}
                  alt="Preview"
                  className="w-40 h-40 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setPreview_file("");
                  }}
                  className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 w-32 rounded"
                >
                  ลบรูป
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center mt-5">
            <label className="text-lg font-bold">สถานะงาน</label>
            <select
              className="border border-gray-300 rounded-lg p-2 ml-3"
              value={isComplete ? "complete" : "incomplete"}
              onChange={(e) => setIsComplete(e.target.value === "complete")}
            >
              <option value="incomplete">Incomplete</option>
              <option value="complete">Complete</option>
            </select>
          </div>

          <div className="flex justify-center mt-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-700"
              } text-white font-bold py-3 px-4 rounded`}
            >
              {isSubmitting ? "กำลังบันทึก..." : "บันทึกงาน"}
            </button>
          </div>
        </form>
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/alltask" className="text-blue-500 font-bold">
          ดูงานทั้งหมด
        </Link>
      </div>
    </div>
  )
}
