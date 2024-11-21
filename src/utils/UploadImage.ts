import { StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { S3_SERVER_URL } from "./constants";
const UploadImage = async (fileName) => {
  const formdata = new FormData();
  const image = fileName;
  //   const pathParts = image.path.split("/");
  const name = fileName.fileName;

  formdata.append("file", {
    uri: image.uri,
    type: image.type,
    name: name,
  });

  try {
    //   setIsUploadingImage(true);
    const res = await axios.post(
      // 'http://ec2-52-14-151-251.us-east-2.compute.amazonaws.com:3005/upload',
      S3_SERVER_URL,
      formdata,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res;
  } catch (err) {}
};

export default UploadImage;

const styles = StyleSheet.create({});
