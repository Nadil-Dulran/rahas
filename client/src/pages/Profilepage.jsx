import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext.jsx'

const Profilepage = () => {

  const { authUser, updateProfile } = useContext(AuthContext)

  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  // Initialize safely; authUser may be null on first render
  const [name, setName] = useState(authUser?.fullName || authUser?.fullname || '')
  const [bio, setBio] = useState(authUser?.bio ?? 'Hi Everyone, I am Using RahasChat')

  // Keep form state in sync when authUser loads/changes
  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || authUser.fullname || '')
      setBio(authUser.bio ?? 'Hi Everyone, I am Using RahasChat')
    }
  }, [authUser])

const handleSubmit = async (e) => {
  e.preventDefault();
  const nameToSend = name || "";

  // prepare payload keys that backend expects: fullName, bio, profilePic
  if (!selectedImg) {
    try {
      await updateProfile({ fullName: nameToSend, bio });
      navigate("/");
    } catch (error) {
      console.error("Profile update failed:", error);
    }
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(selectedImg);
  reader.onloadend = async () => {
    try {
      const base64data = reader.result; // data:image/...
      await updateProfile({ fullName: nameToSend, bio, profilePic: base64data });
      navigate("/");
    } catch (error) {
      console.error("Profile update with image failed:", error);
    }
  };
};

  return (
    <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-400 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-10 flex-1">
          <h3 className="text-lg">Profile Information</h3>
          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} type="file" id="avatar" accept='.png, .jpg, .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} alt="" className={`w-12 h-12 ${selectedImg && 'rounded-full'}`}/>
            Upload profile picture
            </label>
            <input onChange={(e)=>setName(e.target.value)} value={name} type="text" required placeholder='Your name' className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' />
            <textarea onChange={(e)=>setBio(e.target.value)} value={bio} placeholder="Write your bio..." required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>
            <button type="Submit" className='py-3 bg-linear-to-r from-purple-500 to-violet-700 text-white rounded-md cursor-pointer'>Save</button>
        </form>
        <img className={`max-w-44 aspect-square mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} src={authUser?.profilePic || assets.logo_icon} alt="" />
      </div>

    </div>
  )
}

export default Profilepage