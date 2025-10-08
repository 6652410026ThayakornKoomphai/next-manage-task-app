"use client";
import Image from "next/image";
import logo from "./../../../assets/logo.png";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const id = useParams().id;
  const router = useRouter();

  //ดึงข้อมูลจาก supabase เพื่อผูกกับข้อมูลที่เกิดขึ้น และบันทึกลงฐานข้อมูล
  const [title, setTitle] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [is_Completed, setIsCompleted] = useState<boolean>(false);
  const [image_File, setImageFile] = useState<File | null>(null);
  const [preview_File, setPreviewFile] = useState<string>("");
  const [old_image_file, setOldImageFile] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("task_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("พบปัญหาในการดึงข้อมูลจาก");
        console.log(error.message);
        return;
      }
      setTitle(data.title);
      setDetail(data.detail);
      setIsCompleted(data.is_completed);
      setPreviewFile(data.image_url);
      setOldImageFile(data.image_url);
    }
    fetchData();
  }, [id]);

  //เลือกรูปภาพและแสดงตัวอย่างรูปภาพ
  function handleSelecImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;

    setImageFile(file);
    if (file) {
      setPreviewFile(URL.createObjectURL(file as Blob));
    }
  }

  //อัพโหลดรูปภาพและบันทึกแก้ไขข้อมูลลงฐานข้อมูลSupabase
  async function handleUplodeAndUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    //อับโหลดรูปภาพ
    //สร้างตัวแปร image_url เพื่อเก็บ URL ของรูปภาพที่อัพโหลด เพื่อเอาไปบันทึกลงตาราง task_tb
    let image_url = "";

    // validate image file
    if (image_File) {
      //ลบรูปออกจาก stroage (ถ้ามีรูป)
      if (old_image_file != "") {
        //เอาเฉพาะชื่อรูปจาก image_url เก็บในตัวแปล
        const image_name = old_image_file.split("/").pop() as string;
        //ลบรูปออกจาก storage
        const { error } = await supabase.storage
          .from("task_bk")
          .remove([image_name]);
        //ตรวจสอบ error
        if (error) {
          alert("พบปัญหาในการลบรูปภาพ");
          console.log(error.message);
          return;
        }
      }
      // if have image file, upload to supabase storage
      // named new file to avoid duplicate file name
      const new_image_file_name = `${Date.now()}-${image_File.name}`;

      // upload image to supabase storage
      const { error } = await supabase.storage
        .from("task_bk")
        .upload(new_image_file_name, image_File);

      // after upload image, check the result
      // if there is error, show alert and return, if no error, get the image url and stored in variable image_url
      if (error) {
        // show alert and return
        alert("พบปัญหาในการอัพโหลดรูปภาพ กรุณาลองใหม่อีกครั้ง");
        console.log(error.message);
        return;
      } else {
        // no error, get the image url and stored in variable image_url
        const { data } = await supabase.storage
          .from("task_bk")
          .getPublicUrl(new_image_file_name);
        image_url = data.publicUrl;
      }
    }

    //แก้ไขข้อมูลในตาราง บน Supabase
    const { error } = await supabase
      .from("task_tb")
      .update({
        title: title,
        detail: detail,
        is_completed: is_Completed,
        image_url: image_url,
        update_at: new Date().toISOString(),
      })
      .eq("id", id);
    //ตรวจสอบ error
    if (error) {
      alert("พบปัญหาในการแก้ไขข้อมูล");
      console.log(error.message);
      return;
    } else {
      alert("แก้ไขข้อมูลเรียบร้อยแล้ว");
      router.push("/alltask");
    }
  }

  return (
    <div className="flex flex-col w-10/12 mx-auto">
      {/* display logo and title */}
      <div className="flex flex-col items-center mt-20">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h1 className="text-2xl font-bold mt-5">Manage Task App</h1>
        <h1 className="text-2xl font-bold">บันทึกงานที่ต้องทำ</h1>
      </div>

      {/* display edit task form */}
      <div className="flex flex-col mt-10 border border-black p-5 rounded-xl">
        <h1 className="text-center text-2xl font-bold">✏️ แก้ไขงาน</h1>
        <form onSubmit={handleUplodeAndUpdate}>
          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">งานที่ทำ</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-500 p-2 rounded-md"
            />
          </div>
          {/* display detail task */}
          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">รายละเอียดงาน</label>
            <textarea
              className="border border-gray-500 p-2 rounded-md"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
            />
          </div>

          {/* display image preview */}
          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">อัพโหลดรูปภาพ</label>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleSelecImagePreview}
            />
            <label
              htmlFor="fileInput"
              className="bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white text-center p-2 rounded-xl cursor-pointer w-30"
            >
              เลือกรูปภาพ
            </label>
            {preview_File && (
              <div className="mt-3">
                <Image
                  src={preview_File}
                  alt="preview image"
                  width={100}
                  height={100}
                />
              </div>
            )}
          </div>

          {/* display status task */}
          <div className="flex flex-col mt-5">
            <label className="text-lg font-bold">สถานะงาน</label>
            <select
              className="border border-gray-500 p-2 rounded-md"
              value={is_Completed ? "1" : "0"}
              onChange={(e) => setIsCompleted(e.target.value === "1")}
            >
              <option value="0">ยังไม่สำเร็จ</option>
              <option value="1">สำเร็จ</option>
            </select>
          </div>

          {/* display save button */}
          <div className="flex flex-col mt-5">
            <button className="bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white px-4 py-2 rounded-md">
              บันทึกการแก้ไขงาน
            </button>
          </div>
        </form>
        {/* display return to all task page */}
        <div className="flex justify-center mt-10">
          <Link
            href="/alltask"
            className="font-bold text-lg text-blue-500 hover:text-blue-700 transition-all duration-300 px-4 py-2 rounded-md"
          >
            กลับไปหน้าแสดงงานทั้งหมด
          </Link>
        </div>
      </div>
    </div>
  );
}