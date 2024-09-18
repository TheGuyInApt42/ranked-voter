import { MongoClient } from 'mongodb';
import { MONGO_CONNECTION_STRING } from '$env/static/private';

const uri = MONGO_CONNECTION_STRING;
const client = new MongoClient(uri);

export async function GET() {
	await client.connect();
	const database = client.db('voting_db');
	const collection = database.collection('choices');

	const choices = await collection.find({}).toArray();

	return new Response(JSON.stringify(choices), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export async function POST({ request }) {
	const data = await request.json();

	await client.connect();
	const database = client.db('voting_db');
	const collection = database.collection('choices');

	// Check if the choice exists
	const existingChoice = await collection.findOne({ name: data.name });
	if (existingChoice) {
		await collection.updateOne({ name: data.name }, { $inc: { votes: 1 } });
	} else {
		await collection.insertOne({ name: data.name, votes: 1 });
	}

	return new Response(null, { status: 200 });
}
