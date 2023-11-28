import { Agent } from "https";
import { NextApiRequest, NextApiResponse } from "next";
import fetch from 'node-fetch';

const {
    BACKEND_WALLET_ADDRESS,
    NFT_CONTRACT_ADDRESS,
    ENGINE_URL,
    THIRDWEB_SECRET_KEY
} = process.env;

const agent = new Agent({
    rejectUnauthorized: false
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (
            !BACKEND_WALLET_ADDRESS ||
            !NFT_CONTRACT_ADDRESS ||
            !ENGINE_URL ||
            !THIRDWEB_SECRET_KEY
        ) {
            return res.status(500).json({ message: 'missing environment variables' });
        }

        const { userAddress } = await req.body;

        const response = await fetch(
            `${ENGINE_URL}/contract/mumbai/${NFT_CONTRACT_ADDRESS}/erc1155/claim-to`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${THIRDWEB_SECRET_KEY}`,
                    'x-backend-wallet-address': BACKEND_WALLET_ADDRESS
                },
                body: JSON.stringify({
                    receiver: userAddress,
                    tokenId: "0",
                    quantity: "1",
                }),
                agent: agent
            }
        )

        if (response.status === 400) {
            return res.status(400).json({ message: 'bad request' });
        }

        return res.status(200).json({ message: 'success' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
}
