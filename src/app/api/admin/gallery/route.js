import executeQuery from "../../../lib/db";
import { NextResponse } from "next/server";
import { isApiValid } from "../../../lib/functions";
import path from "path";
import { writeFile } from "fs/promises";
import { promises as fs } from 'fs';


export async function POST(req) {
  try {
    const apiKey = await req.headers.get("authorization"); // Extract API key from header
    if (!isApiValid(apiKey)) {
      return NextResponse.json("unauthorized", { status: 401 });
    }

    const formData = await req.formData();

        //get the file and store it first
        const file = formData.get('file')
        if(!file){
            return NextResponse.json({'error': "No files received"}, {'status': 400})
        }
        
        const buffer = Buffer.from(await file.arrayBuffer())
        const fileName =  file.name.replaceAll(" ", "_");
        // console.log(fileName);
        
        const fullPath ="/assets/images/" + fileName
        // console.log(fullPath)
        await writeFile(
            path.join(process.cwd(), "public/assets/images/" + fileName),
            buffer
        )
        
        //get other data from the form
        const title = await formData.get('title')
        // console.log(title)
        //insert data into gallery table

        const isAdded = await executeQuery({
            query: `INSERT INTO gallery (title, image) values(?,?)`,
            values: [title,fullPath]
        })
        
        if(isAdded.affectedRows == 1){
            return NextResponse.json("Image Uploaded Successfully", {status: 201})
        } else {
            return NextResponse.json("Something went wrong", {status: 500})
        }

  } catch (err) {
    console.log(err);
    return NextResponse.json(err, { status: 500 });
  }
}

export async function GET(req) {
    try{
        const result = await executeQuery({
            query: "SELECT * FROM gallery"
        }) 
        return NextResponse.json(result)
    } catch(e){
        console.log(e)
        return NextResponse.json(e, {status: 500})
    }
}

export async function DELETE(req){
    try {
        const apiKey = await req.headers.get('authorization') 

        if (!isApiValid(apiKey)) {
            return NextResponse.json('unauthorized', {status: 401})
        }

        const url = new URL(req.url);
        const id = url.searchParams.get('id'); 
        if (!id) {
            return NextResponse.json('ID not provided', { status: 400 });
        }
        //delete the event's image

        const imageData = await executeQuery({
            query: `SELECT * from gallery WHERE imageId = ${id}`
        })
        console.log(imageData)

        const imageDataPath = process.cwd()+'/public'+imageData[0].image
        console.log(imageDataPath)
        
        //caution, it delete the file, check the path above before running this
        await fs.unlink(imageDataPath)
        console.log("file deleted")
        //
        
        //delete the event from database
        const result = await executeQuery({
            query: `DELETE FROM gallery WHERE imageId=${id}`
        })

        console.log(result)
        if (result.affectedRows == 1) {
            return NextResponse.json('Image has been deleted!', {status: 200})
        } else {
            console.log(result)
            return NextResponse.json('could not delete the Image, an error occured', {status: 500})
        }


    } catch (e) {
        console.log(e)
        return NextResponse.json({error: e}, {status:500})
    }
}