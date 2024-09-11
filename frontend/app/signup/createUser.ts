"use server";

import axios from "axios";
import { redirect } from "next/navigation";
import { API_URL } from "../constant/apiUrl";
export default async function createUser(

  formData: FormData
) {
const email=formData.get('email')
const password=formData.get('password')
const firstName=formData.get('firstName')
const lastName=formData.get('lastName')
const phone=formData.get('phone')

console.log('Form Data:', {
  email,
  password,
  firstName,
  lastName,
  phone,
});


  const res = await axios.post(`${API_URL}/register`, {email,password,firstName,lastName,phone});
  if (res) {
    console.log('created new user')
    return   redirect("/login");
    ;
  }
}
