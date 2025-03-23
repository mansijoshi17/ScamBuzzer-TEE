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
let scamReportSchemaId: SecretVaultWrapper | null = null;

export async function createScamReportSchema() {
    const org = new SecretVaultWrapper(orgConfig.nodes, orgConfig.orgCredentials);
    await org.init();

    const schema = {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Scam Report Schema",  
        "type": "object",
        "properties": {
            "title": {
                "type": "string"
            },
            "url": {
                "type": "string"
            },
            "contractAddress": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "network": {
                "type": "object",
                "properties": {
                    "chainId": {
                        "type": "string"
                    },
                    "name": {
                        "type": "string"
                    }
                },
                "required": ["chainId", "name"]
            },
            "lossOfFunds": {    
                "type": "number"
            }
        },
        "required": ["title", "url", "description", "network", "lossOfFunds", "contractAddress"]
    };

    const schemaId = await org.createSchema(schema, 'Scam Report Schema');
    return schemaId;
}

export async function getScamReportSchema(schemaId: string) {
    const storedSchemaId = await new Promise<string>((resolve) => {
        chrome.storage.local.get(['schemaId'], (result) => {
            resolve(result.schemaId || schemaId);
        });
    });
    if (!scamReportSchemaId) {
        scamReportSchemaId = new SecretVaultWrapper(
            orgConfig.nodes,
            orgConfig.orgCredentials,
            storedSchemaId
        );
        await scamReportSchemaId.init();
    }
    return scamReportSchemaId;
}

export async function writeScamReportData(schemaId: string, data: any) {
    const collection = await getScamReportSchema(schemaId);
    return collection.writeToNodes(data);
}


export async function createSchema() {
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
                    "type": "object",
                    "properties": {
                        "%share": {
                            "type": "string"
                        }
                    },
                    "required": ["%share"]
                },
                "wallet_address": {
                    "type": "object",
                    "properties": {
                        "%share": {
                            "type": "string"
                        }
                    },
                    "required": ["%share"]
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