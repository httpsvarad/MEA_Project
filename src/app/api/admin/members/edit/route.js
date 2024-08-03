import executeQuery from "../../../../lib/db";
import { NextResponse } from "next/server";
import { isApiValid } from "../../../../lib/functions";

export async function DELETE(req) {
    try {
        const apiKey = await req.headers.get('authorization') 

        if (!isApiValid(apiKey)) {
            return NextResponse.json('unauthorized', {status: 401})
        }

        const data = await req.json()
        const { id } = data

        //deleting the member reg for the Rejected member 
        const result = await executeQuery({
            query: `DELETE FROM members WHERE memberId=${id}`
        })

        console.log(result)
        if (result.affectedRows == 1) {
            return NextResponse.json('Member has been Deleted!', {status: 200})
        } else {
            console.log(result)
            return NextResponse.json('could not delete member, an error occured', {status: 500})
        }


    } catch (e) {
        console.log(e)
        return NextResponse.json({error: e}, {status:500})
    }
}