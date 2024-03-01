import { Link } from "react-router-dom";

export const SearchType = ({ motion }) => {
    return (
        <div className='flex flex-col items-center justify-around'>
            
            <section className=' relative h-1/3 w-full gap-0 items-center rounded-lg overflow-hidden bg-green-300 shadow-md shadow-slate-500'>
            <div className = "grid grid-cols-2 grid-rows-2 w-full h-full">
                    <div className = 'h-full p-0'>
                        <img className = 'h-full w-full object-cover' src = 'https://firebasestorage.googleapis.com/v0/b/sessions-7df6d.appspot.com/o/utilities%2Fguitar.webp?alt=media&token=9ee15be5-b8fe-4cf3-b159-1fb46808bc6e'/>
                    </div>
                    <div className = 'h-full'>
                        <img className = 'h-full w-full object-cover' src = 'https://firebasestorage.googleapis.com/v0/b/sessions-7df6d.appspot.com/o/utilities%2Fflute.webp?alt=media&token=48d0c5da-0f55-463e-a05f-90cd7f634b38'/>
                    </div>
                    <div className = 'h-full overflow-hidden'>
                        <img className = 'h-full w-full object-cover' src = 'https://firebasestorage.googleapis.com/v0/b/sessions-7df6d.appspot.com/o/utilities%2Fviolin.webp?alt=media&token=f32471ba-d5b0-46f1-8f0b-0465af818ec5'/>
                    </div>
                    <div className = 'h-full overflow-hidden'>
                        <img className = 'h-full w-full object-cover' src = 'https://firebasestorage.googleapis.com/v0/b/sessions-7df6d.appspot.com/o/utilities%2Fpiano.webp?alt=media&token=f15157dd-9f40-44e5-a321-ab15c5a2348b' />
            </div>
            <div className='flex bg-white text-3xl font-bold text-blue-800 rounded-[50%] border border-black h-[10rem] w-[10rem] items-center absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2'>
                    <Link to="/search/users" className = 'text-center text-blue-800 '> Search Musicians</Link>
                </div>
            </div>
                
           

            </section>




            <section className='h-1/5 flex items-center '>
                <h1 className='text-slate-500 text-4xl font-black text-center'>LOOKING FOR SOMEONE TO JAM WITH?</h1>
                
            </section>

           
           
            <div className="cursor-pointer rounded-lg overflow-hidden shadow-md shadow-slate-500 h-1/3 w-full bg-cover bg-center bg-[url(https://firebasestorage.googleapis.com/v0/b/sessions-7df6d.appspot.com/o/utilities%2Forchestra.jpeg?alt=media&token=39d1a233-c2ca-441b-91d5-34c4f6ec5c40)] bg-blend-multiply bg-gray-400 bg-no-repeat">
                <Link to="/search/groups" className = 'h-full w-full flex justify-center items-center'>
                <p className='text-white font-bold text-3xl '>Search Groups</p>
                    {/* <p className='absolute text-white top-[50%] left-[50%] font-bold text-4xl -translate-x-1/2 -translate-y-1/2 w-max'>Search Groups</p> */}
                    {/* <img className='object-contain' src='https://firebasestorage.googleapis.com/v0/b/sessions-7df6d.appspot.com/o/utilities%2Forchestra.jpeg?alt=media&token=39d1a233-c2ca-441b-91d5-34c4f6ec5c40' alt='orchestra' /> */}
                </Link>
            </div>
        </div>
    )
}