import { NextResponse } from 'next/server';

export async function GET() {
	return NextResponse.json(
		{ error: 'Endpoint no implementado' },
		{ status: 501 },
	);
}
