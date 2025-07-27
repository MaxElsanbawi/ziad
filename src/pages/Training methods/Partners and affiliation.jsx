import React from 'react'
import EC from "../../../public/EC.jpg"
import bmc from "../../../public/bmc.jpg"
import compatia from "../../../public/compatia.jpg"
import pc from "../../../public/pc.jpg"

export default function PartnersAndAffiliation() {
  return (
    <div dir='rtl' className='py-32 p-16 bg-[#F9FAFC]'>
    <h2 className='text-2xl font-bold text-gray-800 mb-4'>الشركاء و الانتماء</h2>
    <div className='text-lg text-gray-600 mb-8'>الشركاء</div>
    <div className="flex justify-center flex-col gap-8 max-w-6xl mx-auto">
      <span className="flex justify-center">
        <img src={EC} alt="Image 1" className="w-80 object-contain" />
      </span>
      <span className="flex justify-center">
        <img src={bmc} alt="Image 1" className="w-80 object-contain" />
      </span>
      <span className="flex justify-center">
        <img src={compatia} alt="Image 1" className="w-80 object-contain" />
      </span>
      <div className='border'> </div>
      <div className='text-lg text-gray-600 mb-8'>الانتماء</div>
      
      <span className="flex justify-center">
        <img src={pc} alt="Image 1" className="w-80 object-contain" />
      </span>
    </div>
  </div>
  )
}
