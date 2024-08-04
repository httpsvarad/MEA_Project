import { NextResponse } from "next/server";
import executeQuery from "../../lib/db";
import bcrypt from 'bcrypt';

export async function POST(req) {
  try {
    const data = await req.json();  
    const { fullName, email, contactNumber, designation, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = "INSERT INTO memberReg (fullName, email, contactNumber, designation, password) values(?,?,?,?,?)";
    const values = [fullName, email, contactNumber, designation, hashedPassword ];

    const result = await executeQuery({ query, values }); 

    if(result?.affectedRows == 1){
      return NextResponse.json('Successfully registered!', {status: '201'});
    } else {
      return NextResponse.json('duplicate email OR Error', {status: '500'});
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
