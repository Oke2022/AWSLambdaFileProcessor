exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    
    try {
        // Handle S3 event
        if (event.Records && event.Records[0].eventSource === 'aws:s3') {
            const s3Event = event.Records[0];
            const bucketName = s3Event.s3.bucket.name;
            const objectKey = s3Event.s3.object.key;
            
            console.log(`File uploaded: ${objectKey} to bucket: ${bucketName}`);
            
            // Your file processing logic here
            // For example: resize image, parse CSV, etc.
            
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: `Successfully processed file: ${objectKey}`,
                    bucket: bucketName,
                    key: objectKey,
                    timestamp: new Date().toISOString()
                })
            };
        }
        
        // Handle API Gateway event
        if (event.httpMethod) {
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({
                    message: 'Lambda function is working!',
                    requestId: event.requestContext?.requestId,
                    timestamp: new Date().toISOString()
                })
            };
        }
        
        // Default response
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Event processed successfully',
                eventType: typeof event
            })
        };
        
    } catch (error) {
        console.error('Error processing event:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message
            })
        };
    }
};
