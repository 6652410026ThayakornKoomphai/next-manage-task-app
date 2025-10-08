"use client"

import Image from "next/image"
import logo from "./../../assets/logo.png"
import Link from "next/link"
import { useState, useEffect} from "react"
import { supabase } from "../../lib/supabaseClient"

//สร้างประเภทตัวแปรเพื่อเก็บข้อมูลที่ดึงมาจาก supabase
type Task = {
  id: number
  title: string
  detail: string
  is_completed: boolean
  image_url: string
  created_at: string
  update_at: string
}

export default function Page() {
  //สร้างตัวแปร state เพื่อเก็บข้อมูล task ที่ดึงมาจาก supabase
  const [tasks, setTasks] = useState<Task[]>([]);

  //เพื่อ Page ถูกโหลด จะดึงข้อมูล task จาก supabase มาแสดงที่หน้า Page
  useEffect(() => {
    async function fetchTasks() {
      const { data, error } = await supabase
        .from('task_tb')
        .select('id, title, detail, is_completed, image_url, created_at, update_at') // เลือกข้อมูลทั้งหมด
        .order('created_at', { ascending: false }); // เรียงลำดับข้อมูลจาก วันที่เพิ่ม(create_at) มากไปน้อย

        if(error) {
          alert('มี ข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง');
          console.log(error.message);
        return;
        }

        if(data){
          setTasks(data as Task[]); //เก็บข้อมูลที่ดึงมาไว้ที่ตัวแปร state tasks
        }
        
  }

  fetchTasks();
  }, []);

async function handleDelete(id: number, image_url: string) {
if (confirm("คุณต้องการลบงานนี้ใช่หรือไม่?")) {
  // ลบรูปภาพจาก Supabase Storage ถ้ามี
  if (image_url != "" ) {
    const image_name = image_url.split("/").pop() as string;
    const { data, error } = await supabase.storage
      .from("task_bk")
      .remove([image_name]);
 
    if (error) {
      alert("พบข้อผิดพลาดในการลบรูปภาพ:");
      console.log(error.message);
      return;
      }
  }
  // ลบงานจากฐานข้อมูล
  const { data ,error } = await supabase
    .from("task_tb")
    .delete()
    .eq("id", id);
 
  // ตรวจสอบข้อผิดพลาดและแจ้งเตือนผู้ใช้
  if (error) {
    alert("พบข้อผิดพลาดในการลบงาน:");
    console.log(error.message);
    return;
  }
 
 
  // ลบข้อมูลออกจากรายการที่แสดงผล
  setTasks(tasks.filter((task) => task.id !== id));
  }
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
    <div className="flex  justify-end">
    <Link href='/addtask' className="mt-10 bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white font-bold py-3 px-4 rounded">
    เพิ่มงาน
    </Link>
    </div>
    
    {/* ส่วนแสดงข้อมูลที่ดึงมาเป็นแบบตาราง */}
    <div className="mt-5">
    <table className="table-auto min-w-full border border-black text-sm mt-10">
      <thead className="bg-gray-200">
      <tr>
        <th className="border border-black p-2">รูป</th>
        <th className="border border-black p-2">งานที่ต้องทำ</th>
        <th className="border border-black p-2">รายละเอียด</th>
        <th className="border border-black p-2">สถานะ</th>
        <th className="border border-black p-2">วันที่เพิ่ม</th>
        <th className="border border-black p-2">วันที่แก้ไข</th>
        <th className="border border-black p-2">Action</th>
      </tr>
      </thead>
      <tbody>
        {/* วน Loop ตามจำนวนข้อมูลที่อยู่ใน state: tasks */}
        {tasks.map((task) => (
          <tr key= {task.id}>
            <td className="border border-black p-2">
              {task.image_url 
              ? <Image src={task.image_url} alt="logo" width={50} height={50}/> 
              : '-'}
            </td>
            <td className="border border-black p-2">{task.title}</td>
            <td className="border border-black p-2">{task.detail}</td>
            <td className={`border border-black p-2 ${task.is_completed ? 'text-green-600' : 'text-red-600'}`}>{task.is_completed ? 'สำเร็จ' : 'ยังไม่สำเร็จ'}</td>
            <td className="border border-black p-2">{new Date(task.created_at).toLocaleDateString()}</td>
            <td className="border border-black p-2">{new Date(task.update_at).toLocaleDateString()}</td>
            <td className="border border-black p-2"><Link href={`/edittask/${task.id}`} className="mr-2 text-green-400 font-bold">แก้ไข</Link>
            <button onClick={()=>{handleDelete(task.id, task.image_url)}} className="text-red-400 font-bold cursor-pointer">ลบ</button></td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    <div className="flex justify-center my-10">
      <Link href="/" className="bg-blue-500 hover:bg-blue-700 transition-all duration-300 text-white font-bold py-3 px-4 rounded">กลับไปหน้าแรก</Link>
    </div>
    </div>
  )
}
