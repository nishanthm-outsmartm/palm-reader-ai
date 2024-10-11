import pinataSDK from '@pinata/sdk';

const pinata = new pinataSDK(process.env.PINATA_API_KEY!, process.env.PINATA_SECRET_API_KEY!);

export async function uploadToPinata(file: File): Promise<{ ipfsHash: string }> {
  try {
    const result = await pinata.pinFileToIPFS(file.stream(), {
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