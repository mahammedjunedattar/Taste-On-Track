'use client'
import React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
const Login = () => {
    const [form,setform] =  useState('')
    const router = useRouter()
    const onchange  = (e)=>{
    console.log(e.target.value)
        setform({...form,[e.target.name] : e.target.value})

    }
    const Loginuser = async (e)=>{
        e.preventDefault();
try {
    const response = await fetch('/apis/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(form),
        credentials: 'include' // Include credentials in the request
});
    const result = await response.json();
    localStorage.setItem('token',result.user._id)

    if (response.ok && !result.errors ) {
        console.log('your have logged in successefully')

        router.push('/')
    }
    else{
                console.log('some error has accured')

    }

    
} catch (error) {
    console.error('Error creating account:', error);
    
}

}
  return (
    <div>
    <section className="bg-yellow-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
          Flowbite    
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <form class="space-y-4 md:space-y-6" onSubmit={Loginuser}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                <input onChange={onchange} name="email" id="email" className="bg-yellow-50 border border-yellow-300 text-gray-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500" placeholder="name@quickbite.com" required=""/>
              </div>

              <button type="submit" className="w-full text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800"> Login Here</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                 <Link href="/Signup" className="font-medium text-yellow-600 hover:underline dark:text-yellow-500">create an account</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
  )
}

export default Login