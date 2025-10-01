import Image from "next/image"
import logo from "./../assets/logo.png"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col items-center  mt-20 ">
      <Image 
        src={logo}
        alt="logo"
        width={150}
        height={150}
      />
      <h1 className="text-4xl font-bold mt-10">
        Manage Task App
      </h1>
      <h1 className="text-2xl mt-5 mb-10">
        บันทึกงานของคุณ
      </h1>
      <Link href="/alltask" className="mt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-60 rounded"> เข้าใช้งาน </Link>
    </div>
  )
}

