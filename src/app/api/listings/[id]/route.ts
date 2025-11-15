import {db} from "../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: Request, {params}: {params: {id: string}}){
    try{
        const listings = await db
        .collection("listings")
        .findOne({_id: new ObjectId(params.id)});

        if(!listings){
            return new Response("Listing not found", {status: 404});
        }

       return new Response(JSON.stringify(listings), {
        status: 200,
        headers: {"Content-Type": "application/json"}
       });
    }   catch(error){
        console.error("Error fetching listings:", error);
        return new Response("Internal Server Error", {status: 500});
    }
}