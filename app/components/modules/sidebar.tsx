import { doc, getDoc } from "firebase/firestore";
import type { FormEventHandler } from "react";
import { Link, useFetcher } from "react-router";
import { firebaseDb } from "~/src/toadFirebase";

const handleFunnyButtonPress: FormEventHandler<HTMLFormElement> = async (event) => {
	console.log("Funny button was pressed.");
	
	console.log(`Value was: '${event.target.coolInput.value}'.`);

	const docSnap = await getDoc(doc(firebaseDb, "billTestCollection", "testIdOne"));
	if (docSnap.exists()) {
		console.log(docSnap.data());
	} else {
		console.log("Couldn't do it.");
	}
}

export default function Sidebar() {
	let fetcher = useFetcher();

	return (
		<div className="flex flex-col items-center bg-lime-700 w-72 p-2">
			<p>Welcome back, Sophie!</p>
			<Link to="/" className="underline text-blue-800 visited:text-purple-800">Home</Link>
			<Link to="/page-b" className="underline text-blue-800 visited:text-purple-800">Page B</Link>
			<Link to="/page-c" className="underline text-blue-800 visited:text-purple-800">Page C</Link>
			
			<div className="h-40"></div>

			<fetcher.Form onSubmit={handleFunnyButtonPress}>
				<input type="text" name="coolInput"></input>
				<button type="submit" className="bg-gray-400">Funny Button</button>
			</fetcher.Form>
		</div>
	);
}
