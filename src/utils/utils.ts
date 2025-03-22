import { SecretVaultWrapper } from 'secretvaults';

const orgSecretKey = import.meta.env.WXT_NILLION_ORG_SECRET_KEY;
const orgDid = import.meta.env.WXT_NILLION_ORG_DID; 

export const orgConfig = {
    orgCredentials: {
        secretKey: orgSecretKey,
        orgDid: orgDid,
    },
    nodes: [
        {
            url: 'https://nildb-nx8v.nillion.network',
            did: 'did:nil:testnet:nillion1qfrl8nje3nvwh6cryj63mz2y6gsdptvn07nx8v',
        },
        {
            url: 'https://nildb-p3mx.nillion.network',
            did: 'did:nil:testnet:nillion1uak7fgsp69kzfhdd6lfqv69fnzh3lprg2mp3mx',
        },
        {
            url: 'https://nildb-rugk.nillion.network',
            did: 'did:nil:testnet:nillion1kfremrp2mryxrynx66etjl8s7wazxc3rssrugk',
        },
    ],
}; 

let svWrapper: SecretVaultWrapper | null = null;

export async function createSchema(){
    const org = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials);
    await org.init();

    const schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Bookmark Wallet Schema",
        "type": "array",
        "items": {
            "type": "object",
            "properties": {
                "_id": {
                    "type": "string",
                    "format": "uuid",
                    "coerce": true
                },
                "name": {
                    "type": "string",
                },
                "wallet_address": {
                    "type": "string",
                }
            },
            "required": ["_id", "name", "wallet_address"]
        }
    };

    const newSchema = await org.createSchema(schema, 'Bookmark Wallet Schema');
   return newSchema;
    
} 
export async function getCollection(schemaId: string) {
    const storedSchemaId = await new Promise<string>((resolve) => {
        chrome.storage.local.get(['schemaId'], (result) => {
            resolve(result.schemaId || schemaId);
        });
    }); 
    if (!svWrapper) {
      svWrapper = new SecretVaultWrapper(
        orgConfig.nodes,
        orgConfig.orgCredentials,
        storedSchemaId
      );
      await svWrapper.init();
    }
    return svWrapper;
  }
  
  export async function writeCollectionData(schemaId: string, data: any) { 
    const collection = await getCollection(schemaId); 
    return collection.writeToNodes(data);
  }
  
  export async function readCollectionData(schemaId: string, query: any = {}) { 
    const collection = await getCollection(schemaId); 
    return collection.readFromNodes({});
  }

export const saveWalletbyNillion = async (requestOptions: any) => {
    const response = await fetch("https://nildb-demo.nillion.network/api/v1/data/create", requestOptions);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save wallet: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("Wallet saved successfully:", result);
    return result;
}