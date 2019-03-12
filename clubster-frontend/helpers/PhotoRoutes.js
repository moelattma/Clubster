import { ImagePicker, Permissions } from 'expo';
import { RNS3 } from 'react-native-aws3';
import v1 from 'uuid/v1';
import axios from 'axios';
import {accessKeyId, secretAccessKey} from '../keys/keys';

exports.changePicture = async (type) => {
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
        var imageURL;
        switch (type) {
          case type == 1 ://changing profile photo
            await RNS3.put(file, options).then((response) => {
                imageURL = response.body.postResponse.key;
            }).catch((err) => { console.log(err) });
            await axios.post('http://localhost:3000/api/changePhoto', { imageURL: imageURL }).then((response) => {
                this.setState({ img: 'https://s3.amazonaws.com/clubster-123/' + response.data.image });
            });
            break;
          case type == 2 ://uploading photo for org
            await RNS3.put(file, options).then((response) => {
              this.setState({
                imageURL: response.body.postResponse.key,
                uri: 'https://s3.amazonaws.com/clubster-123/' + response.body.postResponse.key,
                isImageUploaded: true
              })
            }).catch((err) => { console.log(err) });
            break;
          case type == 3 ://uploaded photo for event
            await RNS3.put(file, options).then((response) => {
              this.setState({
                imageURL: response.body.postResponse.key,
                uri: 'https://s3.amazonaws.com/clubster-123/' + response.body.postResponse.key,
                isImageUploaded: true
              })
              }).catch((err) => { console.log(err) });
            break;
          case type == 4 :
            axios.post(`http://localhost:3000/api/organizations/modifyOrgPicture/${this.props.screenProps._id}`, { imageURL }).then((response) => {
                this.setState({ img: 'https://s3.amazonaws.com/clubster-123/' + response.data.image });
            }).catch((err) => { return; });
            break;
          default:
            break;
        }
    } catch (error) { console.log(error); }
};
