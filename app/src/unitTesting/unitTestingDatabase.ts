import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "../toadFirebase";

async function main() {
    console.log("====== Starting Test ======");

    

    console.log("====== Finished Test ======");
    process.exit();
}

async function testUsers() {
    const ret = await getDoc(doc(firebaseDb, "users", "billmularski@gmail.com"));
    
    if (ret.exists()) {
        console.log(ret.id);
    }
}

main();
