import { S3Client, ListObjectsV2Command, DeleteObjectsCommand, DeleteBucketCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" }); // Change to your AWS region

const bucketName = [
    "voicetranslationpollymanith", 
    
    
];

//"voicebuketmanithratnayake", "voiceoutputbucketmanithratnayake", 

async function emptyAndDeleteBucket(bucketName) {
    try {
        // List objects in the bucket
        const listParams = { Bucket: bucketName };
        let listedObjects;
        
        do {
            listedObjects = await s3.send(new ListObjectsV2Command(listParams));

            if (listedObjects.Contents && listedObjects.Contents.length > 0) {
                // Delete all objects
                const deleteParams = {
                    Bucket: bucketName,
                    Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
                };
                await s3.send(new DeleteObjectsCommand(deleteParams));
            }
            
            listParams.ContinuationToken = listedObjects.NextContinuationToken;
        } while (listedObjects.IsTruncated);

        // Delete the bucket
        await s3.send(new DeleteBucketCommand({ Bucket: bucketName }));
        console.log(`Bucket "${bucketName}" and all its contents have been deleted.`);
    } catch (err) {
        console.error("Error deleting bucket:", err);
    }
}

emptyAndDeleteBucket(bucketName);
