import executeQuery from "../../../lib/db";
import { NextResponse } from "next/server";
import { isApiValid } from "../../../lib/functions";

export async function GET(){
    try{
        const result = await executeQuery({
            query: "SELECT * FROM members ORDER BY memberId DESC"
        }) 
        return NextResponse.json(result)
    } catch(e){
        console.log(e)
        return NextResponse.json({error: err}, {status: 500})
    }
}

export async function POST(req) {
    try {
        const apiKey = await req.headers.get('authorization') 
        if (!isApiValid(apiKey)) {
            return NextResponse.json('unauthorized', {status: 401})
        }

        const data = await req.json()
        const { id } = data
        // console.log(id)
        const result = await executeQuery({
            query: `SELECT * FROM memberReg WHERE id = ${id}` 
        })

        const {fullName, email, contactNumber, designation} = result[0]
        console.log("Adding " + fullName+ " to members")

        //marking member as approved
        const status = await changeStatus(id)
        if (status?.changedRows == 1){

            //adding to the members table
            const isAdded = await executeQuery({
                query: `INSERT INTO members (fullName, email, contactNumber, designation) VALUES(?,?,?,?)`,
                values: [fullName, email, contactNumber, designation]
            })
            console.log(isAdded)

            return NextResponse.json('Member has been approved and added successfully', {status: 201})

        } else {
            return NextResponse.json('unable to approve the member OR is already approved', {status: 500})
        }

    } catch (e) {
        console.log(e)
        return NextResponse.json({error: e}, {status: 500})
    }
}

async function changeStatus(id){
    const result = await executeQuery({
        query: `UPDATE memberReg SET isApproved =1 WHERE id=${id};`
    })
    return result
}

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
            query: `DELETE FROM memberReg WHERE id=${id}`
        })

        console.log(result)
        if (result.affectedRows == 1) {
            return NextResponse.json('Member Rejected, Deleted from members requests', {status: 200})
        } else {
            console.log(result)
            return NextResponse.json('could not Reject the member, an error occured', {status: 500})
        }


    } catch (e) {
        console.log(e)
        return NextResponse.json({error: e}, {status:500})
    }
}