import { ImagePicker, Permissions } from 'expo';
import { RNS3 } from 'react-native-aws3';
import v1 from 'uuid/v1';
import axios from 'axios';
import { accessKeyId, secretAccessKey } from '../../keys/keys';

exports.changePicture = async (oldImage = null) => {
  var imageURL;
  await Permissions.askAsync(Permissions.CAMERA);
  await Permissions.askAsync(Permissions.CAMERA_ROLL);
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      base64: false,
    });
    if (result.cancelled)
      return;

    const key = `${v1()}.jpeg`;
    const file = {
      uri: result.uri,
      type: 'image/jpeg',
      name: key
    };
    const options = {
      keyPrefix: 's3/',
      bucket: 'clubster-123',
      region: 'us-east-1',
      accessKey: accessKeyId,
      secretKey: secretAccessKey,
      successActionStatus: 201
    }
    await RNS3.put(file, options).then((response) => {
      imageURL = response.body.postResponse.key;
    }).catch((err) => { console.log(err) });
    if (oldImage && imageURL) {
      // delete oldImage using s3
    }
  } catch (err) {}
  return imageURL;
};

/*
<script src="https://sdk.amazonaws.com/js/aws-sdk-2.1.24.min.js"></script>
      <script type="text/javascript">
        AWS.config.update({
            accessKeyId : 'YOUR_ACCESS_KEY',
            secretAccessKey : 'YOUR_SECRET_KEY'
        });
        AWS.config.region = 'REGION'; // ex: ap-southeast-1
    </script>

function deleteFile() {
    var bucketInstance = new AWS.S3();
    var params = {
        Bucket: 'BUCKET_NAME',
        Key: 'FILENAME'
    };
    bucketInstance.deleteObject(params, function (err, data) {
        if (data) {
            console.log("File deleted successfully");
        }
        else {
            console.log("Check if you have sufficient permissions : "+err);
        }
    });
}
*/
