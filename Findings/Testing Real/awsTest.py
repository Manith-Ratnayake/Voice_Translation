import boto3

def list_s3_buckets():
    # Create an S3 client
    s3_client = boto3.client('s3')

    # Fetch the list of buckets
    response = s3_client.list_buckets()

    print("Listing all S3 Buckets:")
    if 'Buckets' in response:
        for bucket in response['Buckets']:
            print(f"- {bucket['Name']} (Created on: {bucket['CreationDate']})")
    else:
        print("No buckets found.")

# Run the function
list_s3_buckets()
