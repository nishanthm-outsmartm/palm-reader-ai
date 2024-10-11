import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';

const pinata = new pinataSDK(process.env.PINATA_API_KEY!, process.env.PINATA_SECRET_API_KEY!);

export async function uploadToPinata(file: File): Promise<{ ipfsHash: string }> {
  try {
    // Convert the File object to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create a readable stream from the buffer
    const stream = Readable.from(buffer);

    const result = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: file.name,
      },
    });
    return { ipfsHash: result.IpfsHash };
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    throw error;
  }
}