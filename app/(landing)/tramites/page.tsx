

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { LandingHeader } from "@/components/ui/landingHeader";

const TramitesPage = () => {
  return (
    <>
      <LandingHeader title="Trámites de compraventa" />

      <div className="bg-[#F3F5F9] py-10 px-4 flex flex-col gap-4">

           <Accordion className='bg-white p-5'>
  <AccordionItem value="item-1 ">
    <AccordionTrigger className='text-black font-bold'>     Lorem Ipsum is simply dummy text of the printing and typesetting industry. </AccordionTrigger>
    <AccordionContent>
   Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
    </AccordionContent>
  </AccordionItem>
</Accordion>

<div className='flex flex-row gap-2 bg-white p-5'>
  <div className='w-1/3'>image</div>
  <div className='w-2/3 text-sm '>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</div>
</div>
  
       
        <Accordion className='bg-white px-5'>
  <AccordionItem value="item-1 ">
    <AccordionTrigger className='text-black font-bold'>     Lorem Ipsum is simply dummy text of the printing and typesetting industry. </AccordionTrigger>
    <AccordionContent>
   Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
    </AccordionContent>
  </AccordionItem>
</Accordion>

<Label className='bg-white p-5'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Label>
      
           <Accordion className='bg-white px-5'>
  <AccordionItem value="item-1 ">
    <AccordionTrigger className='text-black font-bold'>     Lorem Ipsum is simply dummy text of the printing and typesetting industry. </AccordionTrigger>
    <AccordionContent>
   Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
    </AccordionContent>
  </AccordionItem>
</Accordion>

<Label className='bg-white p-5'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Label>
     
          <Accordion className='bg-white px-5'>
  <AccordionItem value="item-1 ">
    <AccordionTrigger className='text-black font-bold'>     Lorem Ipsum is simply dummy text of the printing and typesetting industry. </AccordionTrigger>
    <AccordionContent>
   Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
    </AccordionContent>
  </AccordionItem>
</Accordion>

<Label className='bg-white px-5'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Label>
     
          <Accordion className='bg-white px-5'>
  <AccordionItem value="item-1 ">
    <AccordionTrigger className='text-black font-bold'>     Lorem Ipsum is simply dummy text of the printing and typesetting industry. </AccordionTrigger>
    <AccordionContent>
   Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
    </AccordionContent>
  </AccordionItem>
</Accordion>

<Label className='bg-white p-5'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Label>
          <Accordion className='bg-white px-5'>
  <AccordionItem value="item-1 ">
    <AccordionTrigger className='text-black font-bold'>     Lorem Ipsum is simply dummy text of the printing and typesetting industry. </AccordionTrigger>
    <AccordionContent>
   Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
    </AccordionContent>
  </AccordionItem>
</Accordion>

<Label className='bg-white p-5'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</Label>
     
      
      </div>
    </>
    )
}

export default TramitesPage