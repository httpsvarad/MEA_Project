import { NextResponse } from "next/server";
import executeQuery from "../lib/db";

export async function GET(req) {
  try {
    // SQL statements to create tables if they don't exist
    const createTables = "CREATE TABLE IF NOT EXISTS memberReg (id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,fullName VARCHAR(45), email VARCHAR(45) UNIQUE, contactNumber VARCHAR(20),designation VARCHAR(45), password VARCHAR(100), isApproved BOOLEAN DEFAULT FALSE); CREATE TABLE IF NOT EXISTS replies (replyId INT PRIMARY KEY AUTO_INCREMENT,fullName VARCHAR(45),email VARCHAR(45),contactNumber VARCHAR(20),address VARCHAR(200),message VARCHAR(300));";
    

    // Execute the query
    const result = await executeQuery({ query: createTables });

    // Return the result as a JSON response
    return NextResponse.json({ result });

  } catch (err) {
    console.error("Error executing query:", err);

    // Return an error response
    return NextResponse.json({ error: "Error executing query" }, { status: 500 });
  }
}
