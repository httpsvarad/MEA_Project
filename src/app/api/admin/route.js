import executeQuery from "../../lib/db";
import { NextResponse } from "next/server";
import { isApiValid } from "../../lib/functions";

export async function GET(){
    try{
        const result = await executeQuery({
            query: "SELECT * FROM memberReg ORDER BY id DESC"
        }) 
        return NextResponse.json(result)
    } catch(e){
        console.log(e)
        return NextResponse.json({error: err}, {status: 500})
    }
}